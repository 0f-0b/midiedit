const { min, trunc } = Math;

export function toLength(value: number): number {
  const len = trunc(value);
  return len > 0 ? min(len, Number.MAX_SAFE_INTEGER) : 0;
}
