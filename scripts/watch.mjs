import { spawn } from "child_process";
import { createServer, build } from "vite";
import electron from "electron";

/**
 * @type {(server: import('vite').ViteDevServer) => Promise<import('rollup').RollupWatcher>}
 */
function watchMain(server) {
  /**
   * @type {import('child_process').ChildProcessWithoutNullStreams | null}
   */
  let electronProcess = null;
  const address = server.httpServer.address();
  const env = Object.assign(process.env, {
    VITE_DEV_SERVER_HOST: address.address,
    VITE_DEV_SERVER_PORT: address.port,
  });

  return build({
    configFile: "packages/main/vite.config.ts",
    mode: "development",
    plugins: [
      {
        name: "electron-main-watcher",
        writeBundle() {
          electronProcess?.kill();
          electronProcess = spawn(electron, ["."], { stdio: "inherit", env });
        },
      },
    ],
    build: {
      watch: true,
    },
  });
}

/**
 * @type {(server: import('vite').ViteDevServer) => Promise<import('rollup').RollupWatcher>}
 */
function watchPreload(server) {
  return build({
    configFile: "packages/preload/vite.config.ts",
    mode: "development",
    plugins: [
      {
        name: "electron-preload-watcher",
        writeBundle() {
          server.ws.send({ type: "full-reload" });
        },
      },
    ],
    build: {
      watch: true,
    },
  });
}

// bootstrap
const server = await createServer({
  configFile: "packages/renderer/vite.config.ts",
});

await server.listen().then(async (s) => {
  console.log("Vite dev server running at:");
  console.log(`  Local: http://localhost:${server.config.server.port}/`);
  console.log(
    `  Network: http://${server.config.server.host}:${server.config.server.port}/`
  );
  await watchPreload(server);
  await watchMain(server);
});
