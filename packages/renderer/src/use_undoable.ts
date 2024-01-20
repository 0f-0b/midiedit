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
    (value) => {
      setState({
        history: history.toSpliced(
          cursor + 1,
          Infinity,
          typeof value === "function"
            ? (value as (prevState: S) => S)(current)
            : value,
        ),
        cursor: cursor + 1,
      });
    },
    (value) => {
      setState({
        history: history.with(
          cursor,
          typeof value === "function"
            ? (value as (prevState: S) => S)(current)
            : value,
        ),
        cursor,
      });
    },
    (value) => {
      setState({
        history: [
          typeof value === "function"
            ? (value as (prevState: S) => S)(current)
            : value,
        ],
        cursor: 0,
      });
    },
    cursor === 0 ? undefined : () => {
      setState({ history, cursor: cursor - 1 });
    },
    cursor === history.length - 1 ? undefined : () => {
      setState({ history, cursor: cursor + 1 });
    },
  ];
}
