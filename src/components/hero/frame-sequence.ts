/**
 * Framework-onafhankelijke engine voor scroll-gestuurde frame-sequenties.
 *
 * - Laadt frames "grof naar fijn" (0, laatste, elke 32e, 16e … 1e) zodat scrubben direct werkt
 *   en de beeldkwaliteit progressief toeneemt.
 * - Beperkte gelijktijdigheid, prioriteit voor het frame waar de gebruiker naartoe scrolt.
 * - Houdt gecomprimeerde <img>-elementen vast (geen ImageBitmaps) om geheugen op mobiel te sparen.
 * - `get(i)` geeft altijd het dichtstbijzijnde geladen frame terug: nooit een leeg canvas.
 */

export type FrameFormat = "avif" | "webp";

export type FrameSource = {
  /** Map onder /public, bijv. "/hero/v1/m" */
  dir: string;
  count: number;
  format: FrameFormat;
  /** Alleen elke n-de frame laden (Save-Data / trage verbinding). */
  stride?: number;
};

export function frameUrl(src: FrameSource, index: number) {
  return `${src.dir}/${String(index + 1).padStart(3, "0")}.${src.format}`;
}

function loadImage(url: string, priority: boolean): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    if (priority) img.fetchPriority = "high";
    img.onload = () => {
      // Decoderen buiten het scrollmoment, zodat tekenen later geen hapering geeft.
      if (typeof img.decode === "function") img.decode().then(() => resolve(img), () => resolve(img));
      else resolve(img);
    };
    img.onerror = () => reject(new Error(`Frame niet geladen: ${url}`));
    img.src = url;
  });
}

export class FrameCache {
  readonly count: number;
  private readonly images: (HTMLImageElement | undefined)[];
  private readonly state: Uint8Array; // 0 = idle, 1 = bezig, 2 = klaar, 3 = mislukt
  private queue: number[] = [];
  private active = 0;
  private destroyed = false;
  private loaded = 0;
  private readonly stride: number;
  private readonly concurrency: number;

  onProgress?: (ratio: number) => void;
  onFrame?: (index: number) => void;

  constructor(private readonly src: FrameSource, concurrency = 6) {
    this.count = src.count;
    this.stride = Math.max(1, src.stride ?? 1);
    this.concurrency = concurrency;
    this.images = new Array(src.count);
    this.state = new Uint8Array(src.count);
  }

  /** Totaal te laden frames (rekening houdend met stride). */
  get total() {
    return Math.ceil(this.count / this.stride) + ((this.count - 1) % this.stride === 0 ? 0 : 1);
  }

  start() {
    const order: number[] = [];
    const seen = new Set<number>();
    const push = (i: number) => {
      if (i < 0 || i >= this.count || seen.has(i)) return;
      seen.add(i);
      order.push(i);
    };
    push(0);
    push(this.count - 1);
    for (const step of [32, 16, 8, 4, 2, 1]) {
      if (step < this.stride) break;
      for (let i = 0; i < this.count; i += step) push(i);
    }
    this.queue = order;
    this.pump();
  }

  /** Zet frames rond `index` vooraan in de wachtrij (bij snel scrollen naar een onbekend punt). */
  prioritize(index: number) {
    const i = this.align(index);
    if (this.state[i] !== 0) return;
    const neighbors = [i, i + this.stride, i - this.stride].filter(
      (n) => n >= 0 && n < this.count && this.state[n] === 0,
    );
    this.queue = [...neighbors, ...this.queue.filter((q) => !neighbors.includes(q))];
    this.pump();
  }

  /** Dichtstbijzijnde geladen frame (eerst exact, dan steeds verder naar beide kanten). */
  get(index: number): HTMLImageElement | undefined {
    const i = Math.max(0, Math.min(this.count - 1, Math.round(index)));
    if (this.state[i] === 2) return this.images[i];
    for (let d = 1; d < this.count; d++) {
      const lo = i - d;
      const hi = i + d;
      if (lo >= 0 && this.state[lo] === 2) return this.images[lo];
      if (hi < this.count && this.state[hi] === 2) return this.images[hi];
    }
    return undefined;
  }

  isReady(index: number) {
    return this.state[index] === 2;
  }

  destroy() {
    this.destroyed = true;
    this.queue = [];
    for (const img of this.images) if (img) img.src = "";
  }

  private align(i: number) {
    const clamped = Math.max(0, Math.min(this.count - 1, Math.round(i)));
    return Math.min(this.count - 1, Math.round(clamped / this.stride) * this.stride);
  }

  private pump() {
    while (!this.destroyed && this.active < this.concurrency && this.queue.length) {
      const i = this.queue.shift()!;
      if (this.state[i] !== 0) continue;
      this.state[i] = 1;
      this.active++;
      loadImage(frameUrl(this.src, i), i === 0)
        .then((img) => {
          if (this.destroyed) return;
          this.images[i] = img;
          this.state[i] = 2;
          this.loaded++;
          this.onFrame?.(i);
          this.onProgress?.(Math.min(1, this.loaded / this.total));
        })
        .catch(() => {
          if (!this.destroyed) this.state[i] = 3;
        })
        .finally(() => {
          this.active--;
          this.pump();
        });
    }
  }
}

/** Teken een afbeelding "object-fit: cover" met instelbaar focuspunt. */
export function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
  focusX = 0.5,
  focusY = 0.5,
) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;
  const scale = Math.max(width / iw, height / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (width - dw) * focusX;
  const dy = (height - dh) * focusY;
  ctx.drawImage(img, dx, dy, dw, dh);
}

/** Detecteer AVIF-ondersteuning met een 1×1-testafbeelding. */
export function supportsAvif(dataUri: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.width > 0);
    img.onerror = () => resolve(false);
    img.src = dataUri;
  });
}

/** Moet de lichte variant worden geladen? (Save-Data of trage verbinding) */
export function prefersLightAssets(): boolean {
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  const c = nav.connection;
  if (!c) return false;
  return Boolean(c.saveData) || c.effectiveType === "2g" || c.effectiveType === "slow-2g";
}

export const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
