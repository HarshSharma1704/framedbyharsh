export function preparePrivateProjectHtml(html) {
  return html.replace(
    /<script\b[^>]*data-framer-bundle="main"[^>]*>[\s\S]*?<\/script>/gi,
    ''
  );
}
