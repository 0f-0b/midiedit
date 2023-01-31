declare global {
  interface Array<T> {
    with<U>(index: number, value: U): (T | U)[];
  }

  interface ReadonlyArray<T> {
    with<U>(index: number, value: U): (T | U)[];
  }
}

export {};
