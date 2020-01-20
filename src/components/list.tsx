import * as React from "react";
import { ReactNode } from "react";
import { HTMLProps, mergeClass } from "./props";

export interface ListProps extends HTMLProps<HTMLUListElement> {
  elements: readonly ReactNode[];
  selectedIndex: number;
  notEmpty?: boolean;
  onSelect: (index: number) => void;
  onAdd: (index: number, selected: number) => void;
  onDelete: (index: number, selected: number) => void;
}

export default class List extends React.Component<ListProps> {
  public render(): ReactNode {
    const { elements, selectedIndex, notEmpty, onSelect, onAdd, onDelete, className, ...props } = this.props;
    const count = elements.length;
    return <ul className={mergeClass("list", className)} {...props}>
      {elements.map((element, index) => {
        const selected = index === selectedIndex;
        return <li key={index} className={selected ? "list-element selected" : "list-element"} aria-selected={selected}>
          <div className="list-element-content" onClick={() => onSelect(index)}>{element}</div>
          <div className="edit-buttons">
            <button className="small-button" onClick={() => onAdd(index, selectedIndex + +(index <= selectedIndex))}>+</button>
            {(!notEmpty || count > 1) && <button className="small-button" onClick={() => onDelete(index, Math.max(0, selectedIndex - +(index <= selectedIndex)))}>-</button>}
          </div>
        </li>;
      })}
      <div className="list-element-buttons edit-buttons">
        <button onClick={() => onAdd(count, selectedIndex)}>+</button>
      </div>
    </ul>;
  }
}
