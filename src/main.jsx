import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const PRIVATE_PROJECT_PATH = '/private-projects/digital-payments-settlement-platform';
const PRIVATE_PROJECTS = [
  {
    id: 'digital-payments-settlement-platform',
    indexPath: '/private-projects/digital-payments-settlement-platform',
    casePath: '/private-projects/digital-payments-settlement-platform/case-study',
    category: 'PRIVATE CASE STUDY',
    title: 'Digital Payments & Settlement Platform',
    thumbnail: '/assets/digital-payments-thumbnail.png',
    alt: 'Digital Payments & Settlement Platform'
  },
  {
    id: 'secure-network-access-management-platform',
    indexPath: '/private-projects/secure-network-access-management-platform',
    casePath: '/private-projects/secure-network-access-management-platform/case-study',
    category: 'PRIVATE CASE STUDY',
    title: 'Secure Network & Access Management Platform',
    thumbnail: '/assets/private-projects-thumbnail.png',
    alt: 'Secure Network & Access Management Platform'
  }
];
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

function privateProjectById(projectId) {
  return PRIVATE_PROJECTS.find((project) => project.id === projectId) || PRIVATE_PROJECTS[0];
}

function privateProjectByCasePath(path) {
  return PRIVATE_PROJECTS.find((project) => project.casePath === path) || null;
}

function isPrivateCaseStudyPath(path = currentPath()) {
  return Boolean(privateProjectByCasePath(path));
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
      image: '/assets/digital-payments-thumbnail.png',
      srcset: '/assets/digital-payments-thumbnail.png',
      alt: 'Digital Payments & Settlement Platform'
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

function updateFramedByHarshProjectLabel(frameDocument) {
  const framedCards = [...frameDocument.querySelectorAll('a.framer-q6VTF')].filter((card) => {
    const href = card.getAttribute('href') || '';
    return href.includes('3d-web-portfolio');
  });

  for (const card of framedCards) {
    const category = card.querySelector('.framer-1qv04uv p');
    if (category) {
      category.textContent = '3D Web Experience';
    }
  }
}

function updatePrivateProjectThumbnail(frameDocument) {
  const privateCards = [...frameDocument.querySelectorAll('a.framer-q6VTF')].filter((card) => {
    const href = card.getAttribute('href') || '';
    const privatePath = card.getAttribute('data-private-case-path') || '';
    return PRIVATE_PROJECTS.some((project) => {
      return href.includes(project.indexPath)
        || href.includes(project.casePath)
        || privatePath === project.casePath
        || card.getAttribute('data-private-project-id') === project.id;
    });
  });

  for (const card of privateCards) {
    const href = card.getAttribute('href') || '';
    const privatePath = card.getAttribute('data-private-case-path') || '';
    const project = PRIVATE_PROJECTS.find((candidate) => {
      return href.includes(candidate.indexPath)
        || href.includes(candidate.casePath)
        || privatePath === candidate.casePath
        || card.getAttribute('data-private-project-id') === candidate.id;
    }) || PRIVATE_PROJECTS[0];
    const image = card.querySelector('img');
    if (!image) {
      continue;
    }

    image.src = project.thumbnail;
    image.srcset = project.thumbnail;
    image.alt = project.alt;
  }
}

function ensurePrivateIndexBackButton(frameDocument) {
  if (frameDocument.querySelector('.local-private-back-button')) {
    return;
  }

  const section = [...frameDocument.querySelectorAll('[data-framer-name="Projects Section"], section')].find((candidate) => {
    return candidate.textContent?.includes('Private Projects') || candidate.querySelector('a.framer-q6VTF');
  });

  const host = section?.parentElement;
  if (!section || !host) {
    return;
  }

  const button = frameDocument.createElement('a');
  button.className = 'local-private-back-button';
  button.href = '/projects';
  button.target = '_top';
  button.innerHTML = '<span aria-hidden="true">&larr;</span><span>Back to all projects</span>';
  host.insertBefore(button, section);
}

function tunePrivateProjectsIndex(frameDocument, openPrivateCaseStudy) {
  frameDocument.documentElement.classList.add('local-private-index-page');

  const headings = [...frameDocument.querySelectorAll('h1, h2, p, div.framer-text')];
  const pageTitle = headings.find((element) => /My Remarkable Projects/i.test(element.textContent || ''));

  if (pageTitle) {
    pageTitle.textContent = 'Private Projects';
  }

  const projectCards = [...frameDocument.querySelectorAll('a.framer-q6VTF')];

  projectCards.forEach((card, index) => {
    const wrapper = card.closest('.ssr-variant') || card.parentElement;
    const project = PRIVATE_PROJECTS[index];

    if (!project) {
      wrapper?.style.setProperty('display', 'none', 'important');
      return;
    }

    wrapper?.style.removeProperty('display');
    wrapper?.style.removeProperty('visibility');

    card.setAttribute('href', `#${project.id}`);
    card.setAttribute('data-private-project-id', project.id);
    card.setAttribute('data-private-case-path', project.casePath);

    const category = card.querySelector('.framer-1qv04uv p');
    const title = card.querySelector('.framer-1hd1k8e h3');

    if (category) {
      category.textContent = project.category;
    }

    if (title) {
      title.textContent = project.title;
    }

    updatePrivateProjectThumbnail(frameDocument);

    if (!card.dataset.privateClickBound) {
      card.dataset.privateClickBound = 'true';
      card.addEventListener('click', (event) => {
        const selectedProject = privateProjectById(card.getAttribute('data-private-project-id'));
        event.preventDefault();
        event.stopImmediatePropagation();
        openPrivateCaseStudy(selectedProject.id);
      }, true);
    }
  });
}

function updateProjectCard(frameDocument, card, project, variant = 'grid') {
  card.setAttribute('href', `#${project.id}`);
  card.setAttribute('data-private-project-id', project.id);
  card.setAttribute('data-private-case-path', project.casePath);

  const category = card.querySelector(variant === 'suggestion' ? '.framer-11p7syy p' : '.framer-1qv04uv p');
  const title = card.querySelector(variant === 'suggestion' ? '.framer-1yjn5x6 h3' : '.framer-1hd1k8e h3');
  const image = card.querySelector('img');

  if (category) {
    category.textContent = project.category;
  }

  if (title) {
    title.textContent = project.title;
  }

  if (image) {
    image.src = project.thumbnail;
    image.srcset = project.thumbnail;
    image.alt = project.alt;
  }

  updatePrivateProjectThumbnail(frameDocument);
}

function tunePrivateCaseSuggestions(frameDocument, currentProjectId, openPrivateCaseStudy) {
  if (!currentProjectId || !openPrivateCaseStudy) {
    return;
  }

  const section = frameDocument.querySelector('[data-framer-name="Projects Section"]');
  if (!section) {
    return;
  }

  section.classList.remove('digital-payments-source-hidden');
  section.style.removeProperty('display');
  section.style.removeProperty('visibility');

  const suggestions = PRIVATE_PROJECTS.filter((project) => project.id !== currentProjectId).slice(0, 2);
  const cards = [...section.querySelectorAll('a.framer-UGeb1, a.framer-q6VTF')];

  cards.forEach((card, index) => {
    const wrapper = card.closest('.ssr-variant') || card.parentElement;
    const project = suggestions[index];

    if (!project) {
      wrapper?.style.setProperty('display', 'none', 'important');
      return;
    }

    wrapper?.style.removeProperty('display');
    wrapper?.style.removeProperty('visibility');
    updateProjectCard(frameDocument, card, project, 'suggestion');

    if (!card.dataset.privateSuggestionClickBound) {
      card.dataset.privateSuggestionClickBound = 'true';
      card.addEventListener('click', (event) => {
        const selectedProject = privateProjectById(card.getAttribute('data-private-project-id'));
        event.preventDefault();
        event.stopImmediatePropagation();
        openPrivateCaseStudy(selectedProject.id);
      }, true);
    }
  });
}

function tuneFramerFrame(
  frame,
  shouldFixPrivateLayout,
  shouldScrollToContact,
  shouldAlignHomeTalk,
  shouldExpandHomeProjects,
  shouldTunePrivateIndex,
  openPrivateCaseStudy,
  currentPrivateProjectId
) {
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

      .local-private-back-button {
        align-items: center;
        align-self: flex-start;
        background: rgba(5, 5, 5, 0);
        border: 1px solid var(--token-bbb54a95-9e73-4c8c-ac1e-b3ba6454c678, rgb(230, 230, 230));
        border-radius: 12px;
        color: var(--token-bbb54a95-9e73-4c8c-ac1e-b3ba6454c678, rgb(230, 230, 230));
        display: inline-flex;
        font-family: Inter, "Inter Placeholder", sans-serif;
        font-size: 14px;
        font-weight: 400;
        gap: 8px;
        height: 44px;
        justify-content: center;
        line-height: 1;
        margin: 0 0 24px;
        padding: 12px 18px;
        position: relative;
        text-decoration: none;
        white-space: nowrap;
        width: max-content;
        z-index: 5;
      }

      .local-private-back-button:hover {
        background: var(--token-fca815f1-c168-4500-ab2f-4b352d862cd9, rgb(26, 26, 26));
      }

      .local-private-index-page .framer-124fobe a.framer-q6VTF .framer-1pby2nn {
        height: auto !important;
        overflow: visible !important;
        width: 100% !important;
      }

      .local-private-index-page .framer-124fobe a.framer-q6VTF .framer-1jhy1kf-container {
        display: block !important;
        flex: 0 0 auto !important;
        height: 24px !important;
        max-height: 24px !important;
        opacity: 1 !important;
        overflow: hidden !important;
        pointer-events: none !important;
        position: relative !important;
        right: auto !important;
        top: auto !important;
        transform: none !important;
        width: min(120px, 100%) !important;
        z-index: 0 !important;
      }

      .local-private-index-page .framer-124fobe a.framer-q6VTF .framer-1jhy1kf-container section {
        height: 24px !important;
        max-height: 24px !important;
        overflow: hidden !important;
        padding: 0 !important;
      }

      .local-private-index-page .framer-124fobe a.framer-q6VTF .framer-1hd1k8e {
        position: relative !important;
        z-index: 1 !important;
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

        .framer-124fobe a.framer-q6VTF .framer-1jhy1kf-container,
        .framer-15tq2a5 a.framer-q6VTF .framer-1jhy1kf-container {
          display: block !important;
          flex: 0 0 auto !important;
          height: 16px !important;
          max-height: 16px !important;
          opacity: 1 !important;
          overflow: hidden !important;
          pointer-events: none !important;
          position: relative !important;
          right: auto !important;
          top: auto !important;
          transform: none !important;
          width: 100% !important;
          z-index: 0 !important;
        }

        .framer-124fobe a.framer-q6VTF .framer-1jhy1kf-container section,
        .framer-15tq2a5 a.framer-q6VTF .framer-1jhy1kf-container section {
          height: 16px !important;
          max-height: 16px !important;
          overflow: hidden !important;
          padding: 0 !important;
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
          max-width: 100% !important;
          min-width: 0 !important;
          flex: 0 1 auto !important;
          height: auto !important;
          min-height: 76px !important;
          gap: 6px !important;
          overflow: visible !important;
        }

        .framer-124fobe a.framer-q6VTF .framer-1qv04uv,
        .framer-124fobe a.framer-q6VTF .framer-1hd1k8e,
        .framer-15tq2a5 a.framer-q6VTF .framer-1qv04uv,
        .framer-15tq2a5 a.framer-q6VTF .framer-1hd1k8e {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          flex: 0 1 auto !important;
          height: auto !important;
          min-height: 0 !important;
          overflow: visible !important;
        }

        .framer-124fobe a.framer-q6VTF .framer-1qv04uv *,
        .framer-124fobe a.framer-q6VTF .framer-1hd1k8e *,
        .framer-15tq2a5 a.framer-q6VTF .framer-1qv04uv *,
        .framer-15tq2a5 a.framer-q6VTF .framer-1hd1k8e * {
          max-width: 100% !important;
          overflow: visible !important;
          text-overflow: clip !important;
          white-space: normal !important;
          overflow-wrap: anywhere !important;
        }

        .framer-124fobe a.framer-q6VTF .framer-1qv04uv p,
        .framer-15tq2a5 a.framer-q6VTF .framer-1qv04uv p {
          font-size: 12px !important;
          line-height: 1.4em !important;
          white-space: normal !important;
        }

        .framer-124fobe a.framer-q6VTF .framer-1hd1k8e h3,
        .framer-15tq2a5 a.framer-q6VTF .framer-1hd1k8e h3 {
          display: block !important;
          width: 100% !important;
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

    const bottomMediaBlock = frameDocument.querySelector('[data-framer-name="Heading + Paragraph"] > .framer-1kf03ng');

    bottomMediaBlock?.style.setProperty('display', 'none', 'important');

    if (!frameDocument.getElementById('digital-payments-video-style')) {
      const style = frameDocument.createElement('style');
      style.id = 'digital-payments-video-style';
      style.textContent = `
        [data-framer-name="Heading + Paragraph"] h1,
        [data-framer-name="Heading + Paragraph"] h2,
        [data-framer-name="Heading + Paragraph"] .framer-text {
          max-width: 100% !important;
          overflow-wrap: anywhere !important;
        }

        html,
        body {
          max-width: 100% !important;
          overflow-x: hidden !important;
        }

        [data-framer-name="Heading + Paragraph"],
        [data-framer-name="Heading + Paragraph"] > * {
          max-width: 100% !important;
          min-width: 0 !important;
        }

        [data-framer-name="Heading + Paragraph"] h1 {
          width: 100% !important;
          max-width: calc(100vw - 48px) !important;
          font-size: clamp(30px, 4.2vw, 56px) !important;
          line-height: 1.05em !important;
          letter-spacing: 0 !important;
        }

        [data-framer-name="Heading + Paragraph"] h1.framer-text {
          max-width: calc(100vw - 48px) !important;
        }

        @media (max-width: 1199.98px) {
          [data-framer-name="Heading + Paragraph"] h1 {
            font-size: clamp(28px, 5.5vw, 44px) !important;
          }
        }

        @media (max-width: 809.98px) {
          [data-framer-name="Heading + Paragraph"] h1 {
            font-size: clamp(24px, 8vw, 32px) !important;
            line-height: 1.08em !important;
          }
        }

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

    tunePrivateCaseSuggestions(frameDocument, currentPrivateProjectId, openPrivateCaseStudy);
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

  if (shouldTunePrivateIndex && openPrivateCaseStudy) {
    tunePrivateProjectsIndex(frameDocument, openPrivateCaseStudy);
    ensurePrivateIndexBackButton(frameDocument);
  }

  updateFramedByHarshProjectLabel(frameDocument);
  updatePrivateProjectThumbnail(frameDocument);

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

function tuneFramerFrameWhenReady(
  frame,
  shouldFixPrivateLayout,
  shouldScrollToContact,
  shouldAlignHomeTalk,
  shouldExpandHomeProjects = false,
  shouldTunePrivateIndex = false,
  openPrivateCaseStudy = null,
  currentPrivateProjectId = null
) {
  let attempts = 0;

  function tune() {
    attempts += 1;
    tuneFramerFrame(
      frame,
      shouldFixPrivateLayout,
      shouldScrollToContact,
      shouldAlignHomeTalk,
      shouldExpandHomeProjects,
      shouldTunePrivateIndex,
      openPrivateCaseStudy,
      currentPrivateProjectId
    );

    if (attempts < 30) {
      window.setTimeout(tune, 500);
    }
  }

  window.setTimeout(tune, 1500);
}

function App() {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [hasPrivateAccess, setHasPrivateAccess] = React.useState(false);
  const [privateHtml, setPrivateHtml] = React.useState('');
  const [isUnlocking, setIsUnlocking] = React.useState(false);
  const path = currentPath();
  const privateProjectPage = isPrivateProjectPath();
  const privateCaseProject = privateProjectByCasePath(path);
  const privateCaseStudyPage = isPrivateCaseStudyPath(path);
  const privateProjectLocked = privateProjectPage && !hasPrivateAccess;
  const contactPage = path === '/contact';
  const homePage = path === '/' || contactPage;

  async function requestPrivateCaseStudyHtml(projectId = PRIVATE_PROJECTS[0].id) {
    const result = await fetch('/api/private-project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, project: projectId })
    });

    if (!result.ok) {
      throw new Error('Incorrect password');
    }

    return result.text();
  }

  async function fetchPrivateCaseStudy(projectId = PRIVATE_PROJECTS[0].id) {
    setPrivateHtml(await requestPrivateCaseStudyHtml(projectId));
  }

  async function openPrivateCaseStudy(projectId = PRIVATE_PROJECTS[0].id) {
    const project = privateProjectById(projectId);
    setIsUnlocking(true);
    setError('');

    try {
      await fetchPrivateCaseStudy(project.id);
      setHasPrivateAccess(true);
      window.history.pushState({}, '', project.casePath);
    } catch {
      setError('Unable to open project. Please enter the password again.');
      setHasPrivateAccess(false);
      setPrivateHtml('');
    } finally {
      setIsUnlocking(false);
    }
  }

  async function unlockPrivateProject(event) {
    event.preventDefault();
    setIsUnlocking(true);
    setError('');

    try {
      if (privateCaseStudyPage) {
        await fetchPrivateCaseStudy(privateCaseProject?.id || PRIVATE_PROJECTS[0].id);
      } else {
        await requestPrivateCaseStudyHtml();
        setPrivateHtml('');
      }

      setHasPrivateAccess(true);
      setError('');
    } catch (unlockError) {
      setError(unlockError.message === 'Incorrect password' ? 'Incorrect password' : 'Unable to unlock project. Please try again.');
    } finally {
      setIsUnlocking(false);
    }
  }

  return (
    <>
      {privateProjectPage && hasPrivateAccess && privateCaseStudyPage && privateHtml ? (
        <iframe
          key={`${window.location.pathname}-private`}
          className="framer-frame"
          title="Framed by Harsh private project"
          srcDoc={privateHtml}
          onLoad={(event) => tuneFramerFrameWhenReady(event.currentTarget, true, false, false, false, false, openPrivateCaseStudy, privateCaseProject?.id)}
        />
      ) : privateProjectPage && hasPrivateAccess ? (
        <iframe
          key={`${window.location.pathname}-private-index`}
          className="framer-frame"
          title="Framed by Harsh private projects"
          src="/framer/projects.html"
          onLoad={(event) => tuneFramerFrameWhenReady(event.currentTarget, false, false, false, false, true, openPrivateCaseStudy)}
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
