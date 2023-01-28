import { useEffect } from "react";
import useLatest from "use-latest";
import { api, type IpcListener } from "./api.ts";

export function useIpc(channel: string, listener: IpcListener): undefined {
  const ref = useLatest(listener);
  useEffect(() => {
    const listener: IpcListener = (event, ...args) =>
      ref.current(event, ...args);
    api.addIpcListener(channel, listener);
    return () => api.removeIpcListener(channel, listener);
  }, [channel]); // eslint-disable-line react-hooks/exhaustive-deps
  return;
}
