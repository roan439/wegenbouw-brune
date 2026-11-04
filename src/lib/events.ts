/** Kleine event-bus om vanuit een dienst of project het contactformulier voor te vullen. */
export const WORK_TYPE_EVENT = "brune:werksoort";

export function selectWorkType(value: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<string>(WORK_TYPE_EVENT, { detail: value }));
}
