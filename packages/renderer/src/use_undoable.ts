import { type SetStateAction, useState } from "react";

interface Undoable<S> {
  history: S[];
  cursor: number;
}

export function useUndoable<S>(initialState: S | (() => S)): [
  state: S,
  setState: (value: SetStateAction<S>) => undefined,
  replaceState: (value: SetStateAction<S>) => undefined,
  resetState: (value: SetStateAction<S>) => undefined,
  undo: (() => undefined) | undefined,
  redo: (() => undefined) | undefined,
] {
  const [state, setState] = useState<Undoable<S>>(() => ({
    history: [
      typeof initialState === "function"
        ? (initialState as () => S)()
        : initialState,
    ],
    cursor: 0,
  }));
  const { history, cursor } = state;
  const current = history[cursor];
  return [
    current,
    (value): undefined => {
      setState({
        history: [
          ...history.slice(0, cursor + 1),
          typeof value === "function"
            ? (value as (prevState: S) => S)(current)
            : value,
        ],
        cursor: cursor + 1,
      });
      return;
    },
    (value): undefined => {
      setState({
        history: [
          ...history.slice(0, cursor),
          typeof value === "function"
            ? (value as (prevState: S) => S)(current)
            : value,
          ...history.slice(cursor + 1),
        ],
        cursor,
      });
      return;
    },
    (value): undefined => {
      setState({
        history: [
          typeof value === "function"
            ? (value as (prevState: S) => S)(current)
            : value,
        ],
        cursor: 0,
      });
      return;
    },
    cursor === 0 ? undefined : (): undefined => {
      setState({ history, cursor: cursor - 1 });
      return;
    },
    cursor === history.length - 1 ? undefined : (): undefined => {
      setState({ history, cursor: cursor + 1 });
      return;
    },
  ];
}
