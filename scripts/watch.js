#!/usr/bin/env node

import electronPath from "electron";
import { spawn } from "node:child_process";
import { once } from "node:events";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { build, createServer as createDevServer } from "vite";

process.chdir(fileURLToPath(new URL("..", import.meta.url)));

/**
 * @param {import("vite").InlineConfig} [config]
 * @returns {Promise<import("vite").ViteDevServer>}
 */
async function startDevServer(config) {
  const server = await createDevServer(config);
  return await server.listen();
}

/**
 * @param {import("vite").ViteDevServer} rendererDevServer
 * @returns {import("vite").Plugin}
 */
function createWatchPreloadPlugin(rendererDevServer) {
  return {
    name: "watch-preload",
    writeBundle() {
      rendererDevServer.ws.send({ type: "full-reload" });
    },
  };
}

/**
 * @param {import("vite").ViteDevServer} rendererDevServer
 * @returns {import("vite").Plugin}
 */
function createWatchMainPlugin(rendererDevServer) {
  /** @type {import("node:child_process").ChildProcess | null} */
  let child = null;
  const exit = (/** @type {number} */ code) => process.exit(code);
  return {
    name: "watch-main",
    async writeBundle() {
      if (child) {
        child.off("exit", exit);
        const onceExit = once(child, "exit");
        child.kill();
        await onceExit;
        child = null;
      }
      child = spawn(String(electronPath), ["--inspect", "."], {
        env: {
          VITE_DEV_SERVER_URL: rendererDevServer.resolvedUrls?.local[0],
        },
        stdio: "inherit",
      });
      child.once("exit", exit);
    },
  };
}

const mode = process.env.NODE_ENV || undefined;
const rendererDevServer = await startDevServer({
  configFile: "packages/renderer/vite.config.ts",
  mode,
  logLevel: "warn",
});
await build({
  configFile: "packages/preload/vite.config.ts",
  mode,
  plugins: [
    createWatchPreloadPlugin(rendererDevServer),
  ],
  build: {
    watch: {},
  },
  logLevel: "warn",
});
await build({
  configFile: "packages/main/vite.config.ts",
  mode,
  plugins: [
    createWatchMainPlugin(rendererDevServer),
  ],
  build: {
    watch: {},
  },
  logLevel: "warn",
});
