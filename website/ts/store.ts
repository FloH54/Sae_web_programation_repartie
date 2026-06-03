export type Mode = "velo" | "restaurant" | "incident" | "crous";

export let currentMode: Mode = "velo";

export function setMode(mode: Mode) {
  currentMode = mode;
}