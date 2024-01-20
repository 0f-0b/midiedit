import { useEffect } from "react";
import useLatest from "use-latest";
import { api, type IpcListener } from "./api.ts";

export function useIpc(channel: string, listener: IpcListener): undefined {
  const ref = useLatest(listener);
  useEffect(() => {
    const id = api.addIpcListener(channel, (...args) => ref.current(...args));
    return () => api.removeIpcListener(channel, id);
  }, [channel]); // eslint-disable-line react-hooks/exhaustive-deps
}
