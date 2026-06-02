export type Mode = "velo" | "restaurant" | "incident";

export let currentMode: Mode = "velo";

export function setMode(mode: Mode) {
  currentMode = mode;
}