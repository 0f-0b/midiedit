export function scan<T, U>(arr: T[], cb: (prev: U, cur: T, index: number, arr: T[]) => U, initialValue: U): U[] {
  const result: U[] = [];
  for (let i = 0, len = arr.length; i < len; i++)
    result.push(initialValue = cb(initialValue, arr[i], i, arr));
  return result;
}

export function mergeClass(newClass: string, propClass: string | undefined): string {
  return propClass ? `${newClass} ${propClass}` : newClass;
}
