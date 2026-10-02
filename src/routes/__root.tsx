import { useEffect, type ReactNode } from 'react';
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState,
} from '@tanstack/react-router';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from '../components/ui/toast';
import '../index.css';

function ScrollToTop() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const hash = useRouterState({ select: (state) => state.location.hash });

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    const timeout = window.setTimeout(() => {
      const element = document.getElementById(hash.slice(1));
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
    return () => window.clearTimeout(timeout);
  }, [pathname, hash]);

  return null;
}

function RootComponent() {
  return (
    <RootDocument>
      <AuthProvider>
        <ScrollToTop />
        <Toaster />
        <div className="min-h-screen text-slate-900 bg-slate-50 font-sans relative w-full overflow-x-hidden antialiased">
          <Outlet />
        </div>
      </AuthProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <head>
        <HeadContent />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased" style={{ fontFamily: "'Cairo', 'Amiri', sans-serif" }}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { title: 'بوابة المدرسة القرآنية - إدارة الطلاب والمعلمين والحلقات' },
      { name: 'description', content: 'نظام شامل لإدارة مدرسة تحفيظ القرآن الكريم وحلقات المسجد للطلاب والمعلمين ومتابعة حفظ السور والآيات والتقييمات الشهرية.' },
      { property: 'og:title', content: 'بوابة المدرسة القرآنية - إدارة الطلاب والمعلمين والحلقات' },
      { property: 'og:description', content: 'نظام شامل لإدارة مدرسة تحفيظ القرآن الكريم وحلقات المسجد للطلاب والمعلمين ومتابعة حفظ السور والآيات والتقييمات الشهرية.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'بوابة المدرسة القرآنية - إدارة الطلاب والمعلمين والحلقات' },
      { name: 'twitter:description', content: 'نظام شامل لإدارة مدرسة تحفيظ القرآن الكريم وحلقات المسجد للطلاب والمعلمين ومتابعة حفظ السور والآيات والتقييمات الشهرية.' },
    ],
    links: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap' },
    ],
  }),
  component: RootComponent,
});
