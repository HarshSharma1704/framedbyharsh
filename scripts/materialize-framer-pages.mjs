import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'public', 'framer');
fs.mkdirSync(outDir, { recursive: true });

const pages = {
  'home.html': '.capture/home.html',
  'about.html': '.capture/homeabout.html',
  'projects.html': '.capture/homeprojects.html',
  'stack.html': '.capture/homestack.html',
  'project-3d-web-portfolio.html': '.capture/homeprojects-3d-web-portfolio.html',
  'project-north-website-design-ui-ux.html': '.capture/homeprojects-north-website-design-ui-ux.html',
  'project-vr-hospital-simulation.html': '.capture/homeprojects-vr-hospital-simulation.html',
  'private-digital-payments-settlement-platform.html': '.capture/homeprivate-projects-digital-payments-settlement-platform.html'
};

const linkMap = new Map([
  ['https://framedbyharsh.framer.ai/', '/'],
  ['https://framedbyharsh.framer.ai/about', '/about'],
  ['https://framedbyharsh.framer.ai/projects', '/projects'],
  ['https://framedbyharsh.framer.ai/stack', '/stack'],
  ['https://framedbyharsh.framer.ai/contact', '/contact'],
  ['https://framedbyharsh.framer.ai/projects/3d-web-portfolio', '/projects/3d-web-portfolio'],
  ['https://framedbyharsh.framer.ai/projects/north-website-design-ui-ux', '/projects/north-website-design-ui-ux'],
  ['https://framedbyharsh.framer.ai/projects/vr-hospital-simulation', '/projects/vr-hospital-simulation'],
  ['https://framedbyharsh.framer.ai/private-projects/:rcBJkjNnk', '/private-projects/digital-payments-settlement-platform'],
  ['https://framedbyharsh.framer.ai/private-projects/digital-payments-settlement-platform', '/private-projects/digital-payments-settlement-platform'],
  ['./private-projects/:rcBJkjNnk', '/private-projects/digital-payments-settlement-platform'],
  ['../private-projects/:rcBJkjNnk', '/private-projects/digital-payments-settlement-platform'],
  ['./projects/3d-web-portfolio', '/projects/3d-web-portfolio'],
  ['./projects/north-website-design-ui-ux', '/projects/north-website-design-ui-ux'],
  ['./projects/vr-hospital-simulation', '/projects/vr-hospital-simulation'],
  ['../projects/3d-web-portfolio', '/projects/3d-web-portfolio'],
  ['../projects/north-website-design-ui-ux', '/projects/north-website-design-ui-ux'],
  ['../projects/vr-hospital-simulation', '/projects/vr-hospital-simulation'],
  ['../about', '/about'],
  ['../projects', '/projects'],
  ['../stack', '/stack'],
  ['../contact', '/contact'],
  ['../', '/'],
  ['./about', '/about'],
  ['./projects', '/projects'],
  ['./stack', '/stack'],
  ['./contact', '/contact'],
  ['./', '/']
]);

function patch(html) {
  let next = html;
  for (const [from, to] of linkMap) {
    next = next.split(`href="${from}"`).join(`href="${to}" target="_top"`);
  }

  next = next.replace(
    /href="\.\/private-projects\/:rcBJkjNnk"/g,
    'href="/private-projects/digital-payments-settlement-platform" target="_top"'
  );

  const projectDesktopShellFix = html.includes('framer-XwWOQ framer-1pz70x9')
    ? `<style data-local-projects-shell-fix>
      @media (min-width: 1200px) {
        .framer-XwWOQ.framer-1pz70x9 {
          width: 100% !important;
          align-items: stretch !important;
        }
        .framer-XwWOQ .framer-1q9fed7 {
          max-width: none !important;
        }
        .framer-XwWOQ .framer-hy8oh8 {
          max-width: none !important;
        }
      }
    </style>`
    : '';

  const desktopNavFix = `<style data-local-nav-height-fix>
      @media (min-width: 1200px) {
        nav.framer-ZwsEl {
          min-height: 100vh !important;
          height: 100vh !important;
        }
      }
    </style>`;

  next = next.replace(
    '</head>',
    `${projectDesktopShellFix}${desktopNavFix}<script>
      window.addEventListener('click', function(event) {
        const anchor = event.target && event.target.closest ? event.target.closest('a[href]') : null;
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('https://www.linkedin.com')) return;
        if (href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) {
          const target = href.startsWith('/') ? href : new URL(href, window.location.href).pathname;
          event.preventDefault();
          event.stopImmediatePropagation();
          window.top.location.href = target;
        }
      }, true);
    </script></head>`
  );

  return next;
}

for (const [name, source] of Object.entries(pages)) {
  const inputPath = path.join(root, source);
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Missing captured source: ${source}`);
  }
  fs.writeFileSync(path.join(outDir, name), patch(fs.readFileSync(inputPath, 'utf8')));
  console.log(`wrote public/framer/${name}`);
}
