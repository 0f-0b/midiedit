export function mergeClass(newClass: string, propClass: string | undefined): string {
  return propClass ? `${newClass} ${propClass}` : newClass;
}
