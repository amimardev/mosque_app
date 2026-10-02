import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Toaster } from '../components/ui/toast';

function ScrollToTop() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const hash = routerState.location.hash;

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  }, [pathname, hash]);

  return null;
}

function RootComponent() {
  return (
    <>
      <ScrollToTop />
      <Toaster />
      <div className="min-h-screen text-slate-900 bg-slate-50 font-sans relative w-full overflow-x-hidden antialiased">
        <Outlet />
      </div>
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
