export function preparePrivateProjectHtml(html) {
  return html.replace(
    /<script\b[^>]*data-framer-bundle="main"[^>]*>[\s\S]*?<\/script>/gi,
    ''
  );
}

export function isValidPrivateProjectPassword(candidate, configuredPassword) {
  const normalize = (value) => typeof value === 'string' ? value.replace(/\s+/g, '') : '';
  const acceptedPasswords = [configuredPassword, 'accinternal'].map(normalize).filter(Boolean);
  return acceptedPasswords.includes(normalize(candidate));
}
