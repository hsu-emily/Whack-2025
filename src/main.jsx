import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import './index.css';

// Hide default cursor - CustomCursor component will handle the custom cursor
const hideDefaultCursor = () => {
  const style = document.createElement('style');
  style.id = 'hide-default-cursor';
  style.textContent = `
    * {
      cursor: none !important;
    }
  `;
  document.head.appendChild(style);
};

// Apply cursor hiding when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', hideDefaultCursor);
} else {
  hideDefaultCursor();
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
