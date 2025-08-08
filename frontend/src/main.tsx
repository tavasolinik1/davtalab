import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import './i18n';
import App from './App';
import VolunteerSignup from './pages/VolunteerSignup';
import AdminDashboard from './pages/AdminDashboard';
import Analytics from './pages/Analytics';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/signup', element: <VolunteerSignup /> },
  { path: '/admin', element: <AdminDashboard /> },
  { path: '/analytics', element: <Analytics /> },
]);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);