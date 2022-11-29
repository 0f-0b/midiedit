import type { Api, IpcListener } from "../../preload/src/index";

export type { Api, IpcListener };
export const { api } = window as never as { api: Api };
