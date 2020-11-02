import * as React from "react";
import { ReactNode } from "react";
import { AutoSizer, List as VList, ListRowRenderer } from "react-virtualized";
import { AddButton, RemoveButton } from "./edit-buttons";

export interface ListProps {
  rowCount: number;
  rowHeight: number | ((index: number) => number);
  rowRenderer: (index: number) => ReactNode;
  selectedIndex: number;
  canAppend: boolean;
  canInsert: (index: number) => boolean;
  canRemove: (index: number) => boolean;
  onSelect: (index: number) => void;
  onAdd: (index: number, selectedIndex: number) => void;
  onRemove: (index: number, selectedIndex: number) => void;
}

export default function List({ rowCount, rowHeight, rowRenderer, selectedIndex, onSelect, canAppend, canInsert, canRemove, onAdd, onRemove }: ListProps): JSX.Element {
  const measureRow = typeof rowHeight === "number" ? rowHeight : ({ index }: { index: number; }) => index === rowCount ? 28 : rowHeight(index);
  const renderRow: ListRowRenderer = ({ index, key, style }) => {
    if (index === rowCount)
      return <div key={key} style={style}>
        <div className="list-buttons">
          <AddButton onClick={() => onAdd(rowCount, selectedIndex)} />
        </div>
      </div>;
    const selected = index === selectedIndex;
    const canInsertHere = canInsert(index);
    const canRemoveHere = canRemove(index);
    return <div key={key} style={style} className={`list-element-container${selected ? " selected" : ""}`}>
      <div className="list-element" onClick={() => onSelect(index)}>{rowRenderer(index)}</div>
      {(canInsertHere || canRemoveHere) && <div className="list-buttons">
        {canInsertHere && <AddButton onClick={() => onAdd(index, selectedIndex + +(index <= selectedIndex))} />}
        {canRemoveHere && <RemoveButton onClick={() => onRemove(index, Math.max(0, selectedIndex - +(index <= selectedIndex)))} />}
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
