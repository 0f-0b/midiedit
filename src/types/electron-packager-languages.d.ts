import { onCompleteFn } from "electron-packager";

declare function setLanguages(languages: readonly string[]): onCompleteFn;
export = setLanguages;
