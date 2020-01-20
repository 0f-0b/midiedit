import { DOMAttributes, HTMLAttributes } from "react";

export type HTMLProps<T> = Omit<HTMLAttributes<T>, keyof DOMAttributes<T>>;

export function mergeClass(newClass: string, propClass: string | undefined): string {
  return propClass ? `${newClass} ${propClass}` : newClass;
}
