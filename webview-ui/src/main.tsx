import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import './index.css'
import App from './App.tsx'
import { mockData } from './mock-data.ts';
import { Poppers } from './dialogs/Poppers.tsx';
import { Global } from '@emotion/react';
import { globalStyles } from './theme/global-styles.ts';
import './handleVSCodeDoubleFocus';
import { showPopupMenu } from './dialogs/showPopupMenu.tsx';

declare function acquireVsCodeApi(): any;

if (typeof acquireVsCodeApi === 'function') {
  window.vscode = acquireVsCodeApi();
} else {
  console.error('acquireVsCodeApi is not available');
}

if (import.meta.env.MODE === 'development') {
  mockData().then(() => renderApp());
} else {
  renderApp();
}

function renderApp() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <DndProvider backend={HTML5Backend}>
        <Global styles={globalStyles} />
        <App />
        <Poppers />
      </DndProvider>
    </StrictMode>
  );
}

document.addEventListener('contextmenu', (e) => {
    showPopupMenu(e.clientX, e.clientY, []);
    e.preventDefault();
});