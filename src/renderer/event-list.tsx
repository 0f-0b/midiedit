import { Track } from "../common/midi";
import { getEventName, newTrackEvent } from "./events";
import List from "./list";

export interface EventListProps {
  track: Track;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onChange: (track: Track) => void;
}

export default function EventList({ track, selectedIndex, onSelect, onChange }: EventListProps): JSX.Element {
  return <List
    rowCount={track.length}
    rowHeight={50}
    rowRenderer={index => {
      const event = track[index];
      return <>
        <b>{getEventName(event.type)}</b><br />
        {`Delta: ${event.delta}`}
      </>;
    }}
    selectedIndex={selectedIndex}
    canAppend={false}
    canInsert={true}
    canRemove={index => index < track.length - 1}
    onSelect={index => onSelect(index)}
    onAdd={index => {
      onChange([...track.slice(0, index), newTrackEvent("text", 0), ...track.slice(index)]);
      onSelect(index);
    }}
    onRemove={index => {
      onChange([...track.slice(0, index), ...track.slice(index + 1)]);
      if (selectedIndex !== 0 && index <= selectedIndex)
        onSelect(selectedIndex - 1);
    }} />;
}
