import { createServer as createViteServer } from "vite";
import type { Express } from "express";
import { fileURLToPath } from "url";
import path from "path";

export function log(message: string, source: string = "express") {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, isDev: boolean = true) {
  try {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      configFile: false,
    });

    app.use(vite.ssrFixStacktrace);
    app.use(vite.middlewares);
    
    return vite;
  } catch (error) {
    console.error('Vite setup error:', error);
    throw error;
  }
}

export function serveStatic(app: Express, isDev: boolean = false) {
  const distPath = path.resolve("dist");
  
  if (!isDev) {
    app.use(express.static(distPath));
  }
  
  app.get("*", (req, res) => {
    const indexPath = path.join(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Application not built. Run npm run build first.");
    }
  });
}