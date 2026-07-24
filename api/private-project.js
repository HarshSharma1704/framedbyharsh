import { readFile } from 'node:fs/promises';
import { isValidPrivateProjectPassword, preparePrivateProjectHtml } from './private-html.js';

const PASSWORD = process.env.PRIVATE_PROJECT_PASSWORD || 'accinternal';
const PROJECT_FILES = {
  'digital-payments-settlement-platform': new URL('./protected/private-digital-payments-settlement-platform.html', import.meta.url),
  'secure-network-access-management-platform': new URL('./protected/private-secure-network-access-management-platform.html', import.meta.url)
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

  if (!body || !isValidPrivateProjectPassword(body.password, PASSWORD)) {
    response.status(401).json({ error: 'Incorrect password' });
    return;
  }

  const projectFile = PROJECT_FILES[body.project];
  if (!projectFile) {
    response.status(400).json({ error: 'Unknown private project' });
    return;
  }

  let html;
  try {
    html = preparePrivateProjectHtml(await readFile(projectFile, 'utf8'));
  } catch (error) {
    console.error('Unable to load protected project file', error);
    response.status(500).json({ error: 'Unable to load private project' });
    return;
  }

  response.setHeader('Cache-Control', 'no-store, max-age=0');
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.status(200).send(html);
}
