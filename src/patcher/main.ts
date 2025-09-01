import { processBuild } from "./patcher";
import * as fs from "node:fs";

const appPath = process.argv[2];

if (!appPath) {
  console.error("Enter the path to unpacked asar.");
  console.error("Example: bun run start -- pathToUnpackedAsar");
  process.exit(1);
}

if (!fs.existsSync(appPath)) {
  console.error(`Path not found: ${appPath}`);
  process.exit(1);
}

await processBuild(appPath);