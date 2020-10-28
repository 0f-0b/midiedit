export function indexedFilter<T, S extends T>(array: readonly T[], predicate: (value: T, index: number, array: readonly T[]) => value is S, thisArg?: unknown): { value: S; index: number; }[];
export function indexedFilter<T>(array: readonly T[], predicate: (value: T, index: number, array: readonly T[]) => unknown, thisArg?: unknown): { value: T; index: number; }[];
export function indexedFilter<T>(array: readonly T[], predicate: (value: T, index: number, array: readonly T[]) => unknown, thisArg?: unknown): { value: T; index: number; }[] {
  const result: { value: T; index: number; }[] = [];
  let index = 0;
  for (const value of array) {
    if (predicate.call(thisArg, value, index, array))
      result.push({ value, index });
    index++;
  }
  return result;
}

export function mergeClass(newClass: string, propClass: string | undefined): string {
  return propClass ? `${newClass} ${propClass}` : newClass;
}
