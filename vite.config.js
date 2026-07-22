import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const routeFiles = new Map([
  ['/', '/framer/home.html'],
  ['/about', '/framer/about.html'],
  ['/projects', '/framer/projects.html'],
  ['/stack', '/framer/stack.html'],
  ['/contact', '/framer/home.html'],
  ['/projects/3d-web-portfolio', '/framer/project-3d-web-portfolio.html'],
  ['/projects/north-website-design-ui-ux', '/framer/project-north-website-design-ui-ux.html'],
  ['/projects/vr-hospital-simulation', '/framer/project-vr-hospital-simulation.html'],
  ['/private-projects/digital-payments-settlement-platform', '/framer/private-digital-payments-settlement-platform.html']
]);

function framerRoutes() {
  return {
    name: 'framer-routes',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const requestUrl = new URL(request.url, 'http://localhost');
        const route = requestUrl.pathname.replace(/\/$/, '') || '/';
        const file = routeFiles.get(route);

        if (!file) {
          next();
          return;
        }

        const htmlPath = path.join(server.config.publicDir, file);
        const html = await readFile(htmlPath, 'utf8');
        const transformed = await server.transformIndexHtml(requestUrl.pathname, html);

        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html');
        response.end(transformed);
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), framerRoutes()]
});
