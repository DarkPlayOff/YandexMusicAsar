import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { $ } from "bun";
import { prettifyDirectory } from "./prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __projectRoot = path.resolve(__dirname, "..", "..");

type ProgressLogger = (message: string) => void;

const staticFiles = {
  packageJson: "package.json",
  configJs: "main/config.js",
  mainJs: "main/index.js",
  preloadJs: "main/lib/preload.js",
  createWindowJs: "main/lib/createWindow.js",
  updaterJs: "main/lib/modUpdater.js",
  systemMenuJs: "main/lib/systemMenu.js",
} as const;

async function verifyStaticFiles(appPath: string, log: ProgressLogger) {
  log(`🛠️  Locate static files [${Object.keys(staticFiles).join(", ")}]`);
  for (const [key, relPath] of Object.entries(staticFiles)) {
    const fullPath = path.join(appPath, relPath);
    try {
      await fs.access(fullPath);
      log(`✔️   Found ${key}`);
    } catch {
      log(`❌ ${key} was not found at ${fullPath}`);
      throw new Error(`File not found: ${key}`);
    }
  }
}

async function patchMainJsForAnalytics(mainJsPath: string, log: ProgressLogger) {
  log("🛠️  Disable metrics/analytics");

  const blockedAnalyticsUrls = [
    "https://yandex.ru/clck/*",
    "https://mc.yandex.ru/*",
    "https://api.music.yandex.net/dynamic-pages/trigger/*",
    "https://log.strm.yandex.ru/*",
    "https://api.acquisition-gwe.plus.yandex.net/*",
    "https://api.events.plus.yandex.net/*",
    "https://events.plus.yandex.net/*",
    "https://plus.yandex.net/*",
    "https://yandex.ru/ads/*",
    "https://strm.yandex.ru/ping",
  ];

  let mainJsContents = await fs.readFile(mainJsPath, "utf8");
  const patchContent = `
    const { session } = require("electron");
    session.defaultSession.webRequest.onBeforeRequest(
      { urls: ${JSON.stringify(blockedAnalyticsUrls)} },
      (details, callback) => callback({ cancel: true })
    );
    session.defaultSession.webRequest.onBeforeSendHeaders(
      { urls: ["https://api.music.yandex.net/*"] },
      (details, callback) => {
        const bannedHeaders = ["x-yandex-music-device", "x-request-id"];
        bannedHeaders.forEach(header => delete details.requestHeaders[header]);
        callback({ requestHeaders: details.requestHeaders });
      }
    );
  `;

  mainJsContents = mainJsContents.replace("createWindow)();", `createWindow)();${patchContent}`);
  await fs.writeFile(mainJsPath, mainJsContents);

  log("✔️   Done");
  return mainJsContents;
}

async function removeSplashScreen(appPath: string, log: ProgressLogger) {
  log("🛠️  Remove startup video intro");
  const splashScreenPath = path.join(appPath, "app", "media", "splash_screen");
  try {
    await fs.rm(splashScreenPath, { recursive: true, force: true });
    log("✔️   Done");
  } catch (error) {
    log("⚠️  Splash screen was not found, skipping.");
  }
}

async function patchUpdater(updaterPath: string, log: ProgressLogger) {
  try {
    let updaterContents = await fs.readFile(updaterPath, "utf8");
    const oldRepoSlug = "TheKing-OfTime/YandexMusicModClient";
    const newRepoSlug = "DarkPlayOff/YandexMusicAsar";

    if (updaterContents.includes(oldRepoSlug)) {
      updaterContents = updaterContents.replaceAll(oldRepoSlug, newRepoSlug);
      await fs.writeFile(updaterPath, updaterContents);
      log("✔️   Done link patching");
    }
  } catch {
  }
}

async function buildAndInjectMods(
  appPath: string,
  mainJsContents: string,
  preloadJsPath: string,
  log: ProgressLogger,
) {
  log("🛠️  Copy mods to build");
  const modSourcesDir = path.join(__projectRoot, "src/mod");
  const modCompiledDir = path.join(modSourcesDir, "dist");
  const modPreloadScript = path.join(modSourcesDir, "preload.ts");

  log("\n---- 🚧 Building renderer.js ----");
  await $`bun ui:build`;

  log("\n---- 🚧 Building preload.js ----");
  await Bun.build({
    target: "browser",
    format: "cjs",
    sourcemap: "linked",
    minify: false,
    entrypoints: [modPreloadScript],
    outdir: modCompiledDir,
  });

  const [preloadJsPatch, modRendererContents] = await Promise.all([
    fs.readFile(path.join(modCompiledDir, "preload.js"), "utf8"),
    fs.readFile(path.join(modCompiledDir, "renderer.js"), "utf8"),
  ]);

  const preloadJsOriginal = await fs.readFile(preloadJsPath, "utf8");
  const newPreloadJs = `${preloadJsOriginal}\n\n// yandexMusicMod preload.js\n(async () => {${preloadJsPatch}})();`;
  

  const modDestDir = path.join(appPath, "app", "yandexMusicMod");
  await fs.cp(modCompiledDir, modDestDir, { recursive: true });

  const wrappedRenderer = `(function () {\n${modRendererContents}\n})()`;
  await fs.writeFile(path.join(modDestDir, "renderer.js"), wrappedRenderer);

  const appHtmlPath = path.join(appPath, "app");
  const htmlFiles = (await fs.readdir(appHtmlPath, { recursive: true }) as string[]).filter((file) =>
    file.endsWith(".html"),
  );

  for (const htmlFile of htmlFiles) {
    const fullHtmlPath = path.join(appHtmlPath, htmlFile);
    log(`patching html file ${fullHtmlPath}`);
    const htmlFileContents = await fs.readFile(fullHtmlPath, "utf8");
    const patchedHtml = htmlFileContents.replace(
      "<head>",
      `<head><script src="/yandexMusicMod/renderer.js"></script>
       <link rel="stylesheet" href="/yandexMusicMod/renderer.css">`,
    );
    await fs.writeFile(fullHtmlPath, patchedHtml);
  }

  
  await fs.writeFile(preloadJsPath, newPreloadJs);

  log("✔️   Done");
}

export async function processBuild(appPath: string): Promise<string[]> {
  const progressArray: string[] = [];
  const logProgress: ProgressLogger = (message) => {
    progressArray.push(message);
    console.log(message);
  };

  try {
    logProgress(`[1] Patching sources in ${appPath}`);

    await verifyStaticFiles(appPath, logProgress);

    const updaterJsPath = path.join(appPath, staticFiles.updaterJs);
    await patchUpdater(updaterJsPath, logProgress);

    const mainJsPath = path.join(appPath, staticFiles.mainJs);
    let mainJsContents = await patchMainJsForAnalytics(mainJsPath, logProgress);

    await removeSplashScreen(appPath, logProgress);

    const preloadJsPath = path.join(appPath, staticFiles.preloadJs);
    await buildAndInjectMods(appPath, mainJsContents, preloadJsPath, logProgress);

    logProgress(`🛠️  Prettify all files in ${appPath}`);
    await prettifyDirectory(appPath);
    logProgress("✔️   Done");

    return progressArray;
  } catch (error) {
    if (error instanceof Error) {
      logProgress(`❌ Fatal error: ${error.message}`);
    } else {
      logProgress(`❌ An unknown error occurred.`);
    }
    return progressArray;
  }
}