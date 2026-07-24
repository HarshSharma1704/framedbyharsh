import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { preparePrivateProjectHtml } from './api/private-html.js';

const projectFiles = {
  'private-index': path.join('public', 'pages', 'projects.html'),
  'digital-payments-settlement-platform': path.join('api', 'protected', 'private-digital-payments-settlement-platform.html'),
  'secure-network-access-management-platform': path.join('api', 'protected', 'private-secure-network-access-management-platform.html')
};

function privateProjectApi() {
  return {
    name: 'private-project-api',
    configureServer(server) {
      server.middlewares.use('/api/private-project', async (request, response) => {
        if (request.method !== 'POST') {
          response.statusCode = 405;
          response.setHeader('Content-Type', 'application/json');
          response.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let rawBody = '';
        request.on('data', (chunk) => {
          rawBody += chunk;
        });
        request.on('end', async () => {
          let body = {};
          try {
            body = JSON.parse(rawBody || '{}');
          } catch {
            body = {};
          }

          const password = process.env.PRIVATE_PROJECT_PASSWORD || 'accinternal';
          if (body.password !== password) {
            response.statusCode = 401;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({ error: 'Incorrect password' }));
            return;
          }

          const projectFile = projectFiles[body.project];
          if (!projectFile) {
            response.statusCode = 400;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({ error: 'Unknown private project' }));
            return;
          }

          const filePath = path.join(server.config.root, projectFile);
          const html = preparePrivateProjectHtml(await readFile(filePath, 'utf8'));
          response.statusCode = 200;
          response.setHeader('Cache-Control', 'no-store, max-age=0');
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.end(html);
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), privateProjectApi()]
});
