import { clsx } from "clsx";
import React, { type ReactNode } from "react";
import { AddButton, RemoveButton } from "./edit_button.tsx";
import classes from "./list.module.css";

export interface ListProps {
  rowCount: number;
  rowRenderer: (index: number) => ReactNode;
  selectedIndex: number;
  canAppend: boolean;
  canInsert: boolean | ((index: number) => boolean);
  canRemove: boolean | ((index: number) => boolean);
  onSelect: (index: number) => void;
  onAdd: (index: number) => void;
  onRemove: (index: number) => void;
}

export function List(
  {
    rowCount,
    rowRenderer,
    selectedIndex,
    onSelect,
    canAppend,
    canInsert,
    canRemove,
    onAdd,
    onRemove,
  }: ListProps,
): JSX.Element {
  return (
    <ol className={classes.list}>
      {Array.from({ length: rowCount }, (_, index) => {
        const selected = index === selectedIndex;
        const canInsertHere = typeof canInsert === "boolean"
          ? canInsert
          : canInsert(index);
        const canRemoveHere = typeof canRemove === "boolean"
          ? canRemove
          : canRemove(index);
        return (
          <li
            key={index}
            className={clsx(
              classes.elementWrapper,
              selected && classes.selected,
            )}
            tabIndex={0}
            onKeyDown={(event) => {
              if (
                event.target === event.currentTarget &&
                event.key === "Enter" && !selected
              ) {
                onSelect(index);
              }
            }}
            aria-selected={selected}
          >
            <div
              className={classes.element}
              onClick={() => {
                if (!selected) {
                  onSelect(index);
                }
              }}
            >
              {rowRenderer(index)}
            </div>
            {(canInsertHere || canRemoveHere) && (
              <div className={classes.buttons}>
                {canInsertHere && (
                  <AddButton
                    onClick={() => onAdd(index)}
                    aria-label="Insert"
                  />
                )}
                {canRemoveHere && (
                  <RemoveButton
                    onClick={() => onRemove(index)}
                    aria-label="Remove"
                  />
                )}
              </div>
            )}
          </li>
        );
      })}
      {canAppend && (
        <li className={classes.appendButtonWrapper}>
          <div className={classes.buttons}>
            <AddButton
              onClick={() => onAdd(rowCount)}
              aria-label="Append"
            />
          </div>
        </li>
      )}
    </ol>
  );
}
