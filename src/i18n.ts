import * as i18next from "i18next";
import * as path from "path";
import LanguageDetector = require("i18next-electron-language-detector");
import Backend = require("i18next-node-fs-backend");

export function initLocales(): Promise<i18next.TFunction> {
  return (i18next as unknown as i18next.i18n)
    .use(LanguageDetector)
    .use(Backend)
    .init({
      fallbackLng: "en",
      cleanCode: true,
      backend: {
        loadPath: path.resolve(__dirname, "../locales/{{lng}}.json")
      }
    });
}

export const __ = (i18next as unknown as i18next.i18n).t.bind(i18next);
