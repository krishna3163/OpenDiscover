import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { DiscoverPage } from './pages/DiscoverPage';
import { CategoryPage } from './pages/CategoryPage';
import { DevelopersPage } from './pages/DevelopersPage';
import { CommunityPage } from './pages/CommunityPage';
import { CommunityCategoryPage } from './pages/CommunityCategoryPage';
import { LoginPage } from './pages/LoginPage';
import { SubmitProjectPage } from './pages/SubmitProjectPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';

import { Footer } from './components/Footer';
import { ProfilePage } from './pages/ProfilePage';
import { AnimatedBackground } from './components/AnimatedBackground';
import { PageTransition } from './components/PageTransition';

// Wrapper for Routes to enable animation
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><DiscoverPage /></PageTransition>} />
        <Route
          path="/ai-models"
          element={
            <PageTransition>
              <CategoryPage
                title="AI & Machine Learning"
                description="Explore open-weights models, inference engines, and AI playgrounds."
                filterCategory="AI / ML Models"
              />
            </PageTransition>
          }
        />
        <Route
          path="/open-source-apps"
          element={
            <PageTransition>
              <CategoryPage
                title="Open Source Applications"
                description="Curated collection of the best open source apps for privacy, productivity, and creativity."
                filterCategory="Open Source Apps"
              />
            </PageTransition>
          }
        />
        <Route
          path="/privacy"
          element={
            <PageTransition>
              <CategoryPage
                title="Privacy & Security Tools"
                description="Protect your digital rights with these essential privacy-first tools."
                filterCategory="Privacy & Security"
              />
            </PageTransition>
          }
        />
        <Route
          path="/productivity"
          element={
            <PageTransition>
              <CategoryPage
                title="Productivity"
                description="Boost your efficiency with open source tools."
                filterCategory="Productivity"
              />
            </PageTransition>
          }
        />
        <Route
          path="/dev-tools"
          element={
            <PageTransition>
              <CategoryPage
                title="Developer Tools"
                description="Essential tools for coding, debugging, and building."
                filterCategory="Dev Tools"
              />
            </PageTransition>
          }
        />
        <Route
          path="/mobile-apps"
          element={
            <PageTransition>
              <CategoryPage
                title="Mobile Apps"
                description="Open source Android apps, including Shizuku-optimized tools."
                filterCategory="Mobile Apps"
              />
            </PageTransition>
          }
        />
        <Route path="/community" element={<PageTransition><CommunityPage /></PageTransition>} />
        <Route path="/community/:categoryId" element={<PageTransition><CommunityCategoryPage /></PageTransition>} />
        <Route path="/developers" element={<PageTransition><DevelopersPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/submit" element={<PageTransition><SubmitProjectPage /></PageTransition>} />
        <Route path="/project/:id" element={<PageTransition><ProjectDetailPage /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <AnimatedBackground />
          <Header />
          <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
