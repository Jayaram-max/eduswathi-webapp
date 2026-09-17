import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { FirebaseProvider } from './context/FirebaseContext.tsx';
import { ConversationProvider } from '@elevenlabs/react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FirebaseProvider>
      <ConversationProvider>
        <App />
      </ConversationProvider>
    </FirebaseProvider>
  </StrictMode>,
);

// Register Progressive Web App Service Worker
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('PWA Service Worker registered:', reg.scope);
      })
      .catch((err) => {
        console.warn('PWA Service Worker registration failed:', err);
      });
  });
}


