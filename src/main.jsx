import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const PRIVATE_PROJECT_PATH = '/private-projects/digital-payments-settlement-platform';
const PRIVATE_PROJECT_PASSWORD = 'accinternal';
const PRIVATE_PROJECT_ACCESS_KEY = 'framed-private-project-access';
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
  ['/projects/vr-hospital-simulation', '/framer/project-vr-hospital-simulation.html'],
  ['/private-projects/digital-payments-settlement-platform', '/framer/private-digital-payments-settlement-platform.html'],
  ['/private-projects/:rcBJkjNnk', '/framer/private-digital-payments-settlement-platform.html']
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

  const introLeft = introParagraph.getBoundingClientRect().left;
  const talkLeft = talkText.getBoundingClientRect().left;
  const offset = introLeft - talkLeft;

  talkGraphic.style.setProperty('transform', `translateX(${offset}px)`, 'important');
  return true;
}

function tuneFramerFrame(frame, shouldFixPrivateLayout, shouldScrollToContact, shouldAlignHomeTalk) {
  const frameDocument = frame.contentDocument;

  if (!frameDocument) {
    return;
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
}

function tuneFramerFrameWhenReady(frame, shouldFixPrivateLayout, shouldScrollToContact, shouldAlignHomeTalk) {
  let attempts = 0;

  function tune() {
    attempts += 1;
    tuneFramerFrame(frame, shouldFixPrivateLayout, shouldScrollToContact, shouldAlignHomeTalk);

    if (attempts < 30) {
      window.setTimeout(tune, 500);
    }
  }

  window.setTimeout(tune, 1500);
}

function App() {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [hasPrivateAccess, setHasPrivateAccess] = React.useState(() => {
    return window.localStorage.getItem(PRIVATE_PROJECT_ACCESS_KEY) === 'granted';
  });
  const path = currentPath();
  const privateProjectLocked = isPrivateProjectPath() && !hasPrivateAccess;
  const privateProjectPage = isPrivateProjectPath();
  const contactPage = path === '/contact';
  const homePage = path === '/' || contactPage;

  function unlockPrivateProject(event) {
    event.preventDefault();

    if (password === PRIVATE_PROJECT_PASSWORD) {
      window.localStorage.setItem(PRIVATE_PROJECT_ACCESS_KEY, 'granted');
      setHasPrivateAccess(true);
      setError('');
      return;
    }

    setError('Incorrect password');
  }

  return (
    <>
      <iframe
        key={window.location.pathname}
        className={`framer-frame${privateProjectLocked ? ' framer-frame--locked' : ''}`}
        title="Framed by Harsh clone"
        src={currentFrame()}
        onLoad={(event) => tuneFramerFrameWhenReady(event.currentTarget, privateProjectPage, contactPage, homePage)}
      />

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
              Unlock Project
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
