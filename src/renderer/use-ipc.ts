/* eslint-disable */
import type { IpcRendererEvent } from "electron";
import { useEffect } from "react";
import useLatest from "use-latest";
import { api, IpcListener } from "./api";

export default function useIpc(channel: string, listener: IpcListener): void {
  const ref = useLatest(listener);
  useEffect(() => {
    const listener = (event: IpcRendererEvent, ...args: any[]): void => ref.current(event, ...args);
    api.addIpcListener(channel, listener);
    return () => void api.removeIpcListener(channel, listener);
  }, [channel]);
}
