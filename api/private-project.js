import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { preparePrivateProjectHtml } from './private-html.js';

const PASSWORD = process.env.PRIVATE_PROJECT_PASSWORD || 'accinternal';
const PROJECT_FILES = {
  'private-index': path.join('public', 'pages', 'projects.html'),
  'digital-payments-settlement-platform': path.join('api', 'protected', 'private-digital-payments-settlement-platform.html'),
  'secure-network-access-management-platform': path.join('api', 'protected', 'private-secure-network-access-management-platform.html')
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body = request.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  if (!body || body.password !== PASSWORD) {
    response.status(401).json({ error: 'Incorrect password' });
    return;
  }

  const projectFile = PROJECT_FILES[body.project];
  if (!projectFile) {
    response.status(400).json({ error: 'Unknown private project' });
    return;
  }

  const filePath = path.join(process.cwd(), projectFile);
  const html = preparePrivateProjectHtml(await readFile(filePath, 'utf8'));

  response.setHeader('Cache-Control', 'no-store, max-age=0');
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.status(200).send(html);
}
