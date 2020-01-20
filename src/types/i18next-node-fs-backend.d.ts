import { BackendModule } from "i18next";

declare const module: BackendModule<{
  loadPath: string;
  addPath: string;
  jsonIndent: number;
  parse: (data: string) => object;
}>;
export = module;
