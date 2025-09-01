import * as fs from "node:fs/promises";
import * as path from "node:path";
import prettier from "prettier";

const SUPPORTED_EXTENSIONS = new Set([".html", ".js", ".css", ".ts", ".tsx", ".jsx", ".json"]);

async function getFilesToPrettify(dir: string): Promise<string[]> {
  let results: string[] = [];
  const list = await fs.readdir(dir, { withFileTypes: true });

  for (const file of list) {
    const fullPath = path.resolve(dir, file.name);
    if (file.isDirectory()) {
      if (file.name !== "node_modules") {
        results = results.concat(await getFilesToPrettify(fullPath));
      }
    } else if (SUPPORTED_EXTENSIONS.has(path.extname(fullPath))) {
      results.push(fullPath);
    }
  }
  return results;
}

async function formatFile(filePath: string): Promise<void> {
  const fileInfo = await prettier.getFileInfo(filePath);
  if (fileInfo.ignored || !fileInfo.inferredParser) {
    return;
  }

  const options = (await prettier.resolveConfig(filePath)) || {};
  const content = await fs.readFile(filePath, "utf8");

  try {
    const formatted = await prettier.format(content, {
      ...options,
      filepath: filePath,
    });

    if (formatted !== content) {
      await fs.writeFile(filePath, formatted, "utf8");
    }
  } catch (ex) {
    console.warn(`Failed to prettify file ${filePath}:`, ex);
  }
}

export async function prettifyDirectory(directory: string): Promise<void> {
  const files = await getFilesToPrettify(directory);
  const promises = files.map(formatFile);
  
  const results = await Promise.allSettled(promises);

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(`Error processing file ${files[index]}:`, result.reason);
    }
  });
}
