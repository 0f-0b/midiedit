/* eslint-disable */
import { ipcRenderer, IpcRendererEvent } from "electron";
import { useEffect } from "react";
import useLatest from "use-latest";

export default function useIpc(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): void {
  const ref = useLatest(listener);
  useEffect(() => {
    const listener = (event: IpcRendererEvent, ...args: any[]): void => ref.current(event, ...args);
    ipcRenderer.addListener(channel, listener);
    return () => void ipcRenderer.removeListener(channel, listener);
  }, [channel]);
}
