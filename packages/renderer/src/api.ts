import type { Api, IpcListener } from "../../preload/src/index.ts";

export type { Api, IpcListener };
export const { api } = window as never as { api: Api };
