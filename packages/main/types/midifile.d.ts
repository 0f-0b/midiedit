declare module "midifile" {
  import type { Event, MIDIEvent, TextEvent } from "midievents";

  class MIDIFile {
    header: MIDIFile.Header;
    tracks: MIDIFile.Track[];
    constructor(buffer?: ArrayBuffer | Uint8Array);
    getEvents(type?: number, subtype?: number): MIDIFile.ResolvedEvent[];
    getMidiEvents(): MIDIFile.ResolvedMIDIEvent[];
    getLyrics(): MIDIFile.ResolvedLyricEvent[];
    getTrackEvents(index: number): Event[];
    setTrackEvents(index: number, events: readonly Event[]): undefined;
    deleteTrack(index: number): undefined;
    addTrack(index: number): undefined;
    getContent(): ArrayBuffer;
  }

  namespace MIDIFile {
    type Format = 0 | 1 | 2;
    type SMPTEFrames = 24 | 25 | 29.97 | 30;
    type ResolvedEvent = Event & { playTime: number; track?: number };
    type ResolvedMIDIEvent = MIDIEvent & { playTime: number; track?: number };
    type ResolvedLyricEvent = TextEvent & {
      playTime: number;
      track?: number;
      text: string;
    };

    class Header {
      static readonly HEADER_LENGTH: 14;
      static readonly FRAMES_PER_SECONDS: 1;
      static readonly TICKS_PER_BEAT: 2;
      datas: DataView;
      constructor(buffer?: ArrayBuffer);
      getFormat(): Format;
      setFormat(format: Format): undefined;
      getTracksCount(): number;
      setTracksCount(n: number): undefined;
      getTickResolution(tempo: number): number;
      getTimeDivision():
        | typeof Header.FRAMES_PER_SECONDS
        | typeof Header.TICKS_PER_BEAT;
      getTicksPerBeat(): number;
      setTicksPerBeat(ticksPerBeat: number): undefined;
      getSMPTEFrames(): SMPTEFrames;
      getTicksPerFrame(): number;
      setSMTPEDivision(
        smpteFrames: SMPTEFrames | 29,
        ticksPerFrame: number,
      ): undefined;
    }

    class Track {
      static readonly HDR_LENGTH: 8;
      datas: DataView;
      constructor(buffer?: ArrayBuffer, start?: number);
      getTrackLength(): number;
      setTrackLength(trackLength: number): undefined;
      getTrackContent(): DataView;
      setTrackContent(dataView: DataView | Uint8Array): undefined;
    }
  }

  export = MIDIFile;
}
