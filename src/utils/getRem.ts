export function getRem(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
