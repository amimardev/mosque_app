import http from 'http';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { getRequestListener } from '@hono/node-server';
import { createServer as createViteServer } from 'vite';
import { app } from './src/server/app';

dotenv.config();

async function startServer() {
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const honoListener = getRequestListener(app.fetch);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    const server = http.createServer((req, res) => {
      if (req.url && (req.url.startsWith('/api') || req.url === '/api')) {
        return honoListener(req, res);
      }
      vite.middlewares(req, res);
    });

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Hono Server running on http://localhost:${PORT} (development)`);
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const indexHtml = fs.existsSync(path.join(distPath, 'index.html'))
      ? fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8')
      : '<html><body>Loading...</body></html>';

    const server = http.createServer((req, res) => {
      if (req.url && (req.url.startsWith('/api') || req.url === '/api')) {
        return honoListener(req, res);
      }

      // Static file serving
      const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
      const filePath = path.join(distPath, parsedUrl.pathname);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes: Record<string, string> = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.svg': 'image/svg+xml',
          '.ico': 'image/x-icon',
          '.webp': 'image/webp',
          '.woff': 'font/woff',
          '.woff2': 'font/woff2',
          '.ttf': 'font/ttf',
        };
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        return fs.createReadStream(filePath).pipe(res);
      }

      // SPA fallback
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(indexHtml);
    });

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Hono Server running on http://localhost:${PORT} (production)`);
    });
  }
}

startServer();
