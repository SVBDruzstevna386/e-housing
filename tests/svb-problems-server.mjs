import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mime = { ".js": "text/javascript", ".mjs": "text/javascript", ".html": "text/html", ".css": "text/css", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".json": "application/json", ".webmanifest": "application/manifest+json" };
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://127.0.0.1");
    const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
    const filename = path.resolve(root, `.${decodeURIComponent(pathname)}`);
    if (!filename.startsWith(root + path.sep)) throw new Error("Outside test root");
    let data = await readFile(filename);
    if (pathname === "/index.html") {
      data = Buffer.from(data.toString().replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase[^>]*><\/script>/, "")
        .replace(/\?v=\d+/g, `?qa=${Date.now()}`)
        .replace("</body>", `<script src="/tests/${url.searchParams.get("fixture") === "calendar" ? "calendar-media" : "svb-problems"}-fixture.js" defer></script></body>`));
    }
    if (pathname === "/app.js") data = Buffer.from(data.toString().replace(/\nboot\(\);\s*$/, "\n"));
    res.writeHead(200, { "Content-Type": mime[path.extname(filename)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}).listen(8766, "127.0.0.1", () => console.log("Isolated UI fixture: http://127.0.0.1:8766"));
