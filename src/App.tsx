import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { AnimatedBackground } from './components/AnimatedBackground';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { PageTransition } from './components/PageTransition';
import { RouteFallback } from './components/RouteFallback';
import { DocumentTitle, ScrollToTop } from './components/ScrollToTop';
import { AuthProvider } from './context/AuthProvider';
import { FavoritesProvider } from './context/FavoritesProvider';
import { ToastProvider } from './context/ToastProvider';
import { CATEGORY_ROUTES } from './lib/routes';
import { DiscoverPage } from './pages/DiscoverPage';

// The landing page stays in the main chunk; everything else is code-split so
// first paint does not pay for the chat, forum and detail views.
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const CommunityCategoryPage = lazy(() => import('./pages/CommunityCategoryPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const DevelopersPage = lazy(() => import('./pages/DevelopersPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const SubmitProjectPage = lazy(() => import('./pages/SubmitProjectPage'));

/** Route table: one entry per category keeps App.tsx from repeating itself. */
const categoryRoutes = CATEGORY_ROUTES.map((route) => (
  <Route
    key={route.path}
    path={route.path}
    element={
      <PageTransition>
        <CategoryPage
          title={route.title}
          description={route.description}
          filterCategory={route.category}
          icon={route.icon}
        />
      </PageTransition>
    }
  />
));

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <DiscoverPage />
            </PageTransition>
          }
        />
        {categoryRoutes}
        <Route
          path="/community"
          element={
            <PageTransition>
              <CommunityPage />
            </PageTransition>
          }
        />
        <Route
          path="/community/:categoryId"
          element={
            <PageTransition>
              <CommunityCategoryPage />
            </PageTransition>
          }
        />
        <Route
          path="/chat/:username"
          element={
            <PageTransition>
              <ChatPage />
            </PageTransition>
          }
        />
        <Route
          path="/developers"
          element={
            <PageTransition>
              <DevelopersPage />
            </PageTransition>
          }
        />
        <Route
          path="/favorites"
          element={
            <PageTransition>
              <FavoritesPage />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <LoginPage />
            </PageTransition>
          }
        />
        <Route
          path="/submit"
          element={
            <PageTransition>
              <SubmitProjectPage />
            </PageTransition>
          }
        />
        <Route
          path="/project/:id"
          element={
            <PageTransition>
              <ProjectDetailPage />
            </PageTransition>
          }
        />
        <Route
          path="/profile"
          element={
            <PageTransition>
              <ProfilePage />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFoundPage />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => (
  <ToastProvider>
    <AuthProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <ScrollToTop />
          <DocumentTitle />
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>

          <div className="app-shell">
            <AnimatedBackground />
            <Header />
            <main id="main-content" className="app-main">
              <ErrorBoundary>
                <Suspense fallback={<RouteFallback />}>
                  <AnimatedRoutes />
                </Suspense>
              </ErrorBoundary>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </FavoritesProvider>
    </AuthProvider>
  </ToastProvider>
);

export default App;
