import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const PRIVATE_PROJECT_PATH = '/private-projects/digital-payments-settlement-platform';
const PRIVATE_PROJECT_PASSWORD = 'accinternal';
const PRIVATE_PROJECT_ACCESS_KEY = 'framed-private-project-access';

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

function App() {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [hasPrivateAccess, setHasPrivateAccess] = React.useState(() => {
    return window.localStorage.getItem(PRIVATE_PROJECT_ACCESS_KEY) === 'granted';
  });
  const privateProjectLocked = isPrivateProjectPath() && !hasPrivateAccess;

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
