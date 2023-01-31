declare global {
  interface Array<T> {
    toSpliced(start: number, deleteCount?: number): T[];
    toSpliced<U>(start: number, deleteCount?: number, ...items: U[]): (T | U)[];
  }

  interface ReadonlyArray<T> {
    toSpliced(start: number, deleteCount?: number): T[];
    toSpliced<U>(start: number, deleteCount?: number, ...items: U[]): (T | U)[];
  }
}

export {};
