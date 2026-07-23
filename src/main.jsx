import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const PRIVATE_PROJECT_PATH = '/private-projects/digital-payments-settlement-platform';
const DIGITAL_PAYMENTS_VIDEO = '/assets/digital-payments-mockup.mp4';
const DIGITAL_PAYMENTS_VIDEO_FALLBACK = 'https://framerusercontent.com/assets/STpgrtJgdEXcsv1nWF8ULluFG2s.mp4';

const routes = new Map([
  ['/', '/framer/home.html'],
  ['/about', '/framer/about.html'],
  ['/projects', '/framer/projects.html'],
  ['/stack', '/framer/stack.html'],
  ['/contact', '/framer/home.html#contact'],
  ['/projects/3d-web-portfolio', '/framer/project-3d-web-portfolio.html'],
  ['/projects/north-website-design-ui-ux', '/framer/project-north-website-design-ui-ux.html'],
  ['/projects/vr-hospital-simulation', '/framer/project-vr-hospital-simulation.html']
]);

function currentFrame() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  return routes.get(path) || routes.get('/');
}

function currentPath() {
  return window.location.pathname.replace(/\/$/, '') || '/';
}

function isPrivateProjectPath() {
  const path = currentPath();
  return path === PRIVATE_PROJECT_PATH || path.startsWith('/private-projects/');
}

function alignHomeTalkText(frameDocument) {
  const introParagraph = [...frameDocument.querySelectorAll('p')].find((paragraph) => {
    return paragraph.textContent?.includes('Bridging design and technology');
  });
  const talkText = [...frameDocument.querySelectorAll('p')].find((paragraph) => {
    return paragraph.textContent?.includes("Let's Talk!");
  });
  const talkGraphic = talkText?.closest('svg');

  if (!introParagraph || !talkGraphic) {
    return false;
  }

  talkGraphic.style.setProperty('transform', 'none', 'important');
  talkGraphic.style.setProperty('max-width', '100%', 'important');
  talkGraphic.style.setProperty('overflow', 'visible', 'important');

  if (window.innerWidth < 810) {
    return true;
  }

  const introLeft = introParagraph.getBoundingClientRect().left;
  const talkLeft = talkText.getBoundingClientRect().left;
  const frameWidth = frameDocument.documentElement.clientWidth || window.innerWidth;
  const graphicRect = talkGraphic.getBoundingClientRect();
  const rawOffset = introLeft - talkLeft;
  const minOffset = 12 - graphicRect.left;
  const maxOffset = frameWidth - graphicRect.right - 12;
  const offset = Math.max(minOffset, Math.min(rawOffset, maxOffset));

  talkGraphic.style.setProperty('transform', `translateX(${offset}px)`, 'important');
  return true;
}

function ensureHomeProjectGrid(frameDocument) {
  const grid = [...frameDocument.querySelectorAll('.framer-15tq2a5')].find((candidate) => {
    const rect = candidate.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });

  if (!grid) {
    return;
  }

  const existingClones = [...grid.querySelectorAll('[data-local-home-project-card]')];
  if (window.innerWidth >= 1200) {
    existingClones.forEach((clone) => clone.remove());
    return;
  }

  if (grid.querySelectorAll('a.framer-q6VTF').length >= 4) {
    return;
  }

  const template = grid.querySelector('.ssr-variant') || grid.firstElementChild;
  if (!template) {
    return;
  }

  const cards = [
    {
      href: '/projects/vr-hospital-simulation',
      category: 'Unity Development',
      title: 'VR Hospital Simulation',
      image: 'https://framerusercontent.com/images/a61YmZc1rmi2yTzTckLHAPGNzs.png?width=3375&height=3375',
      srcset: 'https://framerusercontent.com/images/a61YmZc1rmi2yTzTckLHAPGNzs.png?scale-down-to=512&width=3375&height=3375 512w, https://framerusercontent.com/images/a61YmZc1rmi2yTzTckLHAPGNzs.png?scale-down-to=1024&width=3375&height=3375 1024w, https://framerusercontent.com/images/a61YmZc1rmi2yTzTckLHAPGNzs.png?scale-down-to=2048&width=3375&height=3375 2048w, https://framerusercontent.com/images/a61YmZc1rmi2yTzTckLHAPGNzs.png?width=3375&height=3375 3375w',
      alt: 'VR Hospital Simulation'
    },
    {
      href: '/private-projects/digital-payments-settlement-platform',
      category: 'PRIVATE CASE STUDIES',
      title: 'Show Other Projects',
      image: '/assets/private-projects-thumbnail.png',
      srcset: '/assets/private-projects-thumbnail.png',
      alt: 'Private Projects'
    }
  ];

  for (const card of cards) {
    if (grid.querySelector(`a[href="${card.href}"]`)) {
      continue;
    }

    const clone = template.cloneNode(true);
    clone.setAttribute('data-local-home-project-card', 'true');

    const anchor = clone.querySelector('a.framer-q6VTF');
    const category = clone.querySelector('.framer-1qv04uv p');
    const title = clone.querySelector('.framer-1hd1k8e h3');
    const image = clone.querySelector('img');

    anchor?.setAttribute('href', card.href);
    anchor?.setAttribute('target', '_top');

    if (category) {
      category.textContent = card.category;
    }

    if (title) {
      title.textContent = card.title;
    }

    if (image) {
      image.src = card.image;
      image.srcset = card.srcset;
      image.alt = card.alt;
    }

    grid.append(clone);
  }
}

function tuneFramerFrame(frame, shouldFixPrivateLayout, shouldScrollToContact, shouldAlignHomeTalk, shouldExpandHomeProjects) {
  const frameDocument = frame.contentDocument;

  if (!frameDocument) {
    return;
  }

  if (!frameDocument.getElementById('local-global-framer-fixes')) {
    const style = frameDocument.createElement('style');
    style.id = 'local-global-framer-fixes';
    style.textContent = `
      #__framer-badge-container,
      [id*="framer-badge"],
      [class*="framer-badge"],
      [data-framer-badge],
      a[href*="framer.com"][style*="fixed"] {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }

      section,
      main,
      [data-framer-root] {
        overflow-x: clip;
      }

      @media (max-width: 1199.98px) {
        .framer-124fobe,
        .framer-15tq2a5 {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 16px !important;
          width: 100% !important;
          align-items: start !important;
        }

        .framer-124fobe > .ssr-variant,
        .framer-15tq2a5 > .ssr-variant {
          display: contents !important;
        }

        .framer-124fobe .framer-i0od4x-container,
        .framer-124fobe .framer-1owmt0m-container,
        .framer-15tq2a5 .framer-q65kcb-container,
        .framer-124fobe a.framer-q6VTF,
        .framer-15tq2a5 a.framer-q6VTF {
          width: 100% !important;
          height: auto !important;
          min-height: 0 !important;
        }

        .framer-124fobe a.framer-q6VTF,
        .framer-15tq2a5 a.framer-q6VTF {
          display: flex !important;
          flex-direction: column !important;
          gap: 14px !important;
        }

        .framer-124fobe a.framer-q6VTF .framer-14ikcuq,
        .framer-15tq2a5 a.framer-q6VTF .framer-14ikcuq,
        .framer-124fobe a.framer-q6VTF .framer-15kyor3,
        .framer-15tq2a5 a.framer-q6VTF .framer-15kyor3 {
          width: 100% !important;
          height: auto !important;
          aspect-ratio: 4 / 3 !important;
        }

        .framer-124fobe a.framer-q6VTF .framer-1pby2nn,
        .framer-15tq2a5 a.framer-q6VTF .framer-1pby2nn {
          width: 100% !important;
          height: auto !important;
          min-height: 62px !important;
          gap: 6px !important;
          overflow: visible !important;
        }

        .framer-124fobe a.framer-q6VTF .framer-1qv04uv,
        .framer-124fobe a.framer-q6VTF .framer-1hd1k8e,
        .framer-15tq2a5 a.framer-q6VTF .framer-1qv04uv,
        .framer-15tq2a5 a.framer-q6VTF .framer-1hd1k8e {
          width: 100% !important;
          height: auto !important;
          overflow: visible !important;
        }

        .framer-124fobe a.framer-q6VTF .framer-1qv04uv p,
        .framer-15tq2a5 a.framer-q6VTF .framer-1qv04uv p {
          font-size: 12px !important;
          line-height: 1.4em !important;
          white-space: normal !important;
        }

        .framer-124fobe a.framer-q6VTF .framer-1hd1k8e h3,
        .framer-15tq2a5 a.framer-q6VTF .framer-1hd1k8e h3 {
          font-size: 14px !important;
          line-height: 1.25em !important;
          white-space: normal !important;
        }
      }
    `;
    frameDocument.head.append(style);
  }

  if (shouldFixPrivateLayout) {
    const root = frameDocument.querySelector('[data-framer-root]');
    const layout = frameDocument.querySelector('.framer-wdnrd6');
    const main = frameDocument.querySelector('main');

    root?.style.setProperty('width', '100%', 'important');
    root?.style.setProperty('max-width', 'none', 'important');
    layout?.style.setProperty('width', '100%', 'important');
    layout?.style.setProperty('max-width', 'none', 'important');
    main?.style.setProperty('width', 'auto', 'important');
    main?.style.setProperty('max-width', 'none', 'important');
    main?.style.setProperty('flex', '1 1 auto', 'important');

    const otherProjectsSection = frameDocument.querySelector('[data-framer-name="Projects Section"]');
    const bottomMediaBlock = frameDocument.querySelector('[data-framer-name="Heading + Paragraph"] > .framer-1kf03ng');

    otherProjectsSection?.style.setProperty('display', 'none', 'important');
    bottomMediaBlock?.style.setProperty('display', 'none', 'important');

    if (!frameDocument.getElementById('digital-payments-video-style')) {
      const style = frameDocument.createElement('style');
      style.id = 'digital-payments-video-style';
      style.textContent = `
        .digital-payments-video-card {
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 12px;
          overflow: hidden;
          background: #1a1a1a;
          position: relative;
        }

        .digital-payments-video-card video {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }
      `;
      frameDocument.head.append(style);
    }

    if (!frameDocument.querySelector('.digital-payments-video-card')) {
      const article = frameDocument.querySelector('[data-framer-name="Heading + Paragraph"]');
      const heading = article?.firstElementChild;

      if (article && heading) {
        const card = frameDocument.createElement('div');
        card.className = 'digital-payments-video-card';

        const video = frameDocument.createElement('video');
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'metadata';
        video.setAttribute('aria-label', 'Digital payments project mockup');

        const localSource = frameDocument.createElement('source');
        localSource.src = DIGITAL_PAYMENTS_VIDEO;
        localSource.type = 'video/mp4';

        const fallbackSource = frameDocument.createElement('source');
        fallbackSource.src = DIGITAL_PAYMENTS_VIDEO_FALLBACK;
        fallbackSource.type = 'video/mp4';

        video.append(localSource, fallbackSource);
        card.append(video);
        heading.insertAdjacentElement('afterend', card);
      }
    }
  }

  if (shouldScrollToContact) {
    window.requestAnimationFrame(() => {
      const contactSection = [...frameDocument.querySelectorAll('section')].find((section) => {
        return section.textContent?.includes("Let's Talk!");
      });

      contactSection?.scrollIntoView({ block: 'start' });
    });
  }

  if (shouldAlignHomeTalk) {
    alignHomeTalkText(frameDocument);
  }

  if (shouldExpandHomeProjects) {
    ensureHomeProjectGrid(frameDocument);
  }

  const talkSections = [...frameDocument.querySelectorAll('section, a, div')].filter((element) => {
    return /Let's (Talk|Connect)!/i.test(element.textContent || '');
  });

  for (const element of talkSections) {
    element.style.setProperty('overflow', 'visible', 'important');
    element.style.setProperty('max-width', '100%', 'important');
  }

  for (const svg of frameDocument.querySelectorAll('svg')) {
    if (/Let's (Talk|Connect)!/i.test(svg.textContent || '')) {
      svg.style.setProperty('max-width', '100%', 'important');
      svg.style.setProperty('overflow', 'visible', 'important');
    }
  }
}

function tuneFramerFrameWhenReady(frame, shouldFixPrivateLayout, shouldScrollToContact, shouldAlignHomeTalk, shouldExpandHomeProjects = false) {
  let attempts = 0;

  function tune() {
    attempts += 1;
    tuneFramerFrame(frame, shouldFixPrivateLayout, shouldScrollToContact, shouldAlignHomeTalk, shouldExpandHomeProjects);

    if (attempts < 30) {
      window.setTimeout(tune, 500);
    }
  }

  window.setTimeout(tune, 1500);
}

function App() {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [privateHtml, setPrivateHtml] = React.useState('');
  const [isUnlocking, setIsUnlocking] = React.useState(false);
  const path = currentPath();
  const privateProjectPage = isPrivateProjectPath();
  const privateProjectLocked = privateProjectPage && !privateHtml;
  const contactPage = path === '/contact';
  const homePage = path === '/' || contactPage;

  async function unlockPrivateProject(event) {
    event.preventDefault();
    setIsUnlocking(true);
    setError('');

    try {
      const result = await fetch('/api/private-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (!result.ok) {
        setError('Incorrect password');
        return;
      }

      setPrivateHtml(await result.text());
      setError('');
    } catch {
      setError('Unable to unlock project. Please try again.');
    } finally {
      setIsUnlocking(false);
    }
  }

  return (
    <>
      {privateProjectPage && privateHtml ? (
        <iframe
          key={`${window.location.pathname}-private`}
          className="framer-frame"
          title="Framed by Harsh private project"
          srcDoc={privateHtml}
          onLoad={(event) => tuneFramerFrameWhenReady(event.currentTarget, true, false, false)}
        />
      ) : (
        <iframe
          key={window.location.pathname}
          className={`framer-frame${privateProjectLocked ? ' framer-frame--locked' : ''}`}
          title="Framed by Harsh clone"
          src={privateProjectPage ? '/framer/projects.html' : currentFrame()}
          onLoad={(event) => tuneFramerFrameWhenReady(event.currentTarget, false, contactPage, homePage, path === '/')}
        />
      )}

      {privateProjectLocked ? (
        <div className="private-gate" role="dialog" aria-modal="true" aria-labelledby="private-gate-title">
          <form className="private-gate__panel" onSubmit={unlockPrivateProject}>
            <div className="private-gate__status">
              <span className="private-gate__dot" aria-hidden="true" />
              Private Case Studies
            </div>
            <h1 id="private-gate-title">Password required</h1>
            <p>Enter the access password to view this project.</p>
            <label className="private-gate__label" htmlFor="private-project-password">
              Password
            </label>
            <input
              id="private-project-password"
              className="private-gate__input"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError('');
              }}
              autoComplete="current-password"
              autoFocus
            />
            {error ? <p className="private-gate__error">{error}</p> : null}
            <button className="private-gate__button" type="submit">
              {isUnlocking ? 'Unlocking...' : 'Unlock Project'}
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
