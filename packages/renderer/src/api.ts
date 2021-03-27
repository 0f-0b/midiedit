import type { Api, IpcListener } from "../../preload/src/index";

export type { Api, IpcListener };
export default (window as unknown as { api: Api; }).api;
