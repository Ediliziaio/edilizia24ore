import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";

const root = process.cwd();
const publicRoot = join(root, "public");
const images = [];

function collect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) collect(file);
    else if (entry.isFile() && /\.webp$/i.test(entry.name)) {
      images.push("/" + relative(publicRoot, file).split(sep).join("/"));
    }
  }
}

collect(join(publicRoot, "images"));
const target = join(root, "src", "data", "webp-images.json");
const content = JSON.stringify(images.sort(), null, 2) + "\n";
mkdirSync(dirname(target), { recursive: true });
let previous;
try { previous = readFileSync(target, "utf8"); } catch { /* First generation. */ }
if (previous !== content) writeFileSync(target, content);
console.log(`Image manifest: ${images.length} existing WebP files`);
