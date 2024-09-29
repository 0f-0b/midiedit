export function inflect(n: number, singular: string, plural: string): string {
  return `${n}\u{a0}${n === 1 ? singular : plural}`;
}
