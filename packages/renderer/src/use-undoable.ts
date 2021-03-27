import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

export interface Undoable<S> {
  history: S[];
  cursor: number;
}

export default function useUndoable<S>(initialState: S | (() => S)): [
  state: S,
  setState: Dispatch<SetStateAction<S>>,
  replaceState: Dispatch<SetStateAction<S>>,
  resetState: Dispatch<SetStateAction<S>>,
  undo: (() => void) | undefined,
  redo: (() => void) | undefined
] {
  const [state, setState] = useState<Undoable<S>>(() => ({
    history: [typeof initialState === "function" ? (initialState as () => S)() : initialState],
    cursor: 0
  }));
  const { history, cursor } = state;
  const current = history[cursor];
  return [
    current,
    value => setState({
      history: [...history.slice(0, cursor + 1), typeof value === "function" ? (value as (prevState: S) => S)(current) : value],
      cursor: cursor + 1
    }),
    value => setState({
      history: [...history.slice(0, cursor), typeof value === "function" ? (value as (prevState: S) => S)(current) : value, ...history.slice(cursor + 1)],
      cursor
    }),
    value => setState({
      history: [typeof value === "function" ? (value as (prevState: S) => S)(current) : value],
      cursor: 0
    }),
    cursor === 0 ? undefined : () => setState({
      history,
      cursor: cursor - 1
    }),
    cursor === history.length - 1 ? undefined : () => setState({
      history,
      cursor: cursor + 1
    })
  ];
}
