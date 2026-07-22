import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

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

function App() {
  return (
    <iframe
      key={window.location.pathname}
      className="framer-frame"
      title="Framed by Harsh clone"
      src={currentFrame()}
    />
  );
}

createRoot(document.getElementById('root')).render(<App />);
