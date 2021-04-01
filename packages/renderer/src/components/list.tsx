import type { ReactNode } from "react";
import * as React from "react";
import type { ListRowRenderer } from "react-virtualized";
import { AutoSizer, List as VList } from "react-virtualized";
import { AddButton, RemoveButton } from "./edit-button";
import classes from "./list.module.css";

export interface ListProps {
  rowCount: number;
  rowHeight: number | ((index: number) => number);
  rowRenderer: (index: number) => ReactNode;
  selectedIndex: number;
  canAppend: boolean;
  canInsert: boolean | ((index: number) => boolean);
  canRemove: boolean | ((index: number) => boolean);
  onSelect: (index: number) => void;
  onAdd: (index: number) => void;
  onRemove: (index: number) => void;
}

export default function List({ rowCount, rowHeight, rowRenderer, selectedIndex, onSelect, canAppend, canInsert, canRemove, onAdd, onRemove }: ListProps): JSX.Element {
  const measureRow = typeof rowHeight === "number" ? rowHeight : ({ index }: { index: number; }) => index === rowCount ? 28 : rowHeight(index);
  const renderRow: ListRowRenderer = ({ index, key, style }) => {
    if (index === rowCount)
      return <div key={key} style={style}>
        <div className={classes.buttons}>
          <AddButton onClick={() => onAdd(rowCount)} />
        </div>
      </div>;
    const selected = index === selectedIndex;
    const canInsertHere = typeof canInsert === "boolean" ? canInsert : canInsert(index);
    const canRemoveHere = typeof canRemove === "boolean" ? canRemove : canRemove(index);
    return <div key={key} style={style} className={selected ? classes.selectedContainer : classes.elementContainer}>
      <div className={classes.element} onClick={() => selected || onSelect(index)}>{rowRenderer(index)}</div>
      {(canInsertHere || canRemoveHere) && <div className={classes.elementButtons}>
        {canInsertHere && <AddButton onClick={() => onAdd(index)} />}
        {canRemoveHere && <RemoveButton onClick={() => onRemove(index)} />}
      </div>}
    </div>;
  };
  return <AutoSizer>
    {({ width, height }) =>
      <VList
        width={width}
        height={height}
        rowCount={rowCount + Number(canAppend)}
        rowHeight={measureRow}
        rowRenderer={renderRow} />}
  </AutoSizer>;
}
