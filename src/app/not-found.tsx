export default function NotFound() {
  return (
    <main id="inhoud" className="pattern-paving grid min-h-[80svh] place-items-center bg-ink px-5 pt-24 text-center">
      <div>
        <p className="eyebrow text-brune">404 · Wegafsluiting</p>
        <h1 className="display mt-4 text-[clamp(2.6rem,8vw,6rem)]">Deze weg loopt dood.</h1>
        <p className="mx-auto mt-5 max-w-md text-white/65">
          De pagina die u zoekt bestaat niet (meer). Volg de omleiding terug naar de homepage.
        </p>
        <a href="/" className="btn btn-primary mt-8">
          Terug naar home
        </a>
      </div>
    </main>
  );
}
