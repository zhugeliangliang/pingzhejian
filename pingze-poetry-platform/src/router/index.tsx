import { createBrowserRouter, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from '../components/Layout';
import HomePage from '../pages/HomePage';
import CreatePage from '../pages/CreatePage';
import WorksPage from '../pages/WorksPage';
import TemplatesPage from '../pages/TemplatesPage';
import AboutPage from '../pages/AboutPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <ScrollToTop />
        <Layout />
      </>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'create', element: <CreatePage /> },
      { path: 'works', element: <WorksPage /> },
      { path: 'templates', element: <TemplatesPage /> },
      { path: 'about', element: <AboutPage /> },
    ],
  },
]);
