import * as React from "react";
import { ReactNode } from "react";
import { AddButton, RemoveButton } from "./edit-buttons";
import { mergeClass } from "./util";

export interface ListProps extends Omit<React.ComponentPropsWithoutRef<"ul">, "onSelect"> {
  elements: readonly ReactNode[];
  selectedIndex: number;
  notEmpty?: boolean;
  onSelect: (index: number) => void;
  onAdd: (index: number, selectedIndex: number) => void;
  onDelete: (index: number, selectedIndex: number) => void;
}

export default function List({ elements, selectedIndex, notEmpty, onSelect, onAdd, onDelete, className, ...props }: ListProps): JSX.Element {
  return <ul className={mergeClass("list", className)} {...props}>
    {elements.map((element, index) => {
      const selected = index === selectedIndex;
      return <li key={index} className={selected ? "list-element selected" : "list-element"} aria-selected={selected}>
        <div className="list-element-content" onClick={() => onSelect(index)}>{element}</div>
        <div className="list-element-buttons">
          <AddButton onClick={() => onAdd(index, selectedIndex + +(index <= selectedIndex))} />
          {(!notEmpty || elements.length > 1) && <RemoveButton onClick={() => onDelete(index, Math.max(0, selectedIndex - +(index <= selectedIndex)))} />}
        </div>
      </li>;
    })}
    <div className="list-element-buttons">
      <AddButton onClick={() => onAdd(elements.length, selectedIndex)} />
    </div>
  </ul>;
}
