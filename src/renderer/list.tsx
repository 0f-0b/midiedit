import * as React from "react";
import { ReactNode } from "react";
import { AddButton, RemoveButton } from "./edit-buttons";
import { mergeClass } from "./util";

export interface ListProps extends Omit<React.ComponentPropsWithoutRef<"ul">, "onSelect"> {
  elements: readonly ReactNode[];
  selectedIndex: number;
  readOnly?: boolean;
  notEmpty?: boolean;
  onSelect: (index: number) => void;
  onAdd: (index: number, selectedIndex: number) => void;
  onDelete: (index: number, selectedIndex: number) => void;
}

export default function List({ elements, selectedIndex, readOnly, notEmpty, onSelect, onAdd, onDelete, className, ...props }: ListProps): JSX.Element {
  return <ul className={mergeClass("list", className)} {...props}>
    {elements.map((element, index) => {
      const selected = index === selectedIndex;
      return <li key={index} className={`list-element-container${selected ? " selected" : ""}`} aria-selected={selected}>
        <div className="list-element" onClick={() => onSelect(index)}>{element}</div>
        {readOnly || <div className="list-buttons">
          <AddButton onClick={() => onAdd(index, selectedIndex + +(index <= selectedIndex))} />
          {(notEmpty && elements.length === 1) || <RemoveButton onClick={() => onDelete(index, Math.max(0, selectedIndex - +(index <= selectedIndex)))} />}
        </div>}
      </li>;
    })}
    {readOnly || <div className="list-buttons">
      <AddButton onClick={() => onAdd(elements.length, selectedIndex)} />
    </div>}
  </ul>;
}
