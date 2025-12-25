import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { DiscoverPage } from './pages/DiscoverPage';
import { CategoryPage } from './pages/CategoryPage';
import { DevelopersPage } from './pages/DevelopersPage';
import { LoginPage } from './pages/LoginPage';
import { SubmitProjectPage } from './pages/SubmitProjectPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';

import { Footer } from './components/Footer';
import { ProfilePage } from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<DiscoverPage />} />
            <Route
              path="/ai-models"
              element={
                <CategoryPage
                  title="AI & Machine Learning"
                  description="Explore open-weights models, inference engines, and AI playgrounds."
                  filterCategory="AI / ML Models"
                />
              }
            />
            <Route
              path="/open-source-apps"
              element={
                <CategoryPage
                  title="Open Source Applications"
                  description="Curated collection of the best open source apps for privacy, productivity, and creativity."
                  filterCategory="Open Source Apps"
                />
              }
            />
            <Route
              path="/privacy"
              element={
                <CategoryPage
                  title="Privacy & Security Tools"
                  description="Protect your digital rights with these essential privacy-first tools."
                  filterCategory="Privacy & Security"
                />
              }
            />
            <Route
              path="/productivity"
              element={
                <CategoryPage
                  title="Productivity"
                  description="Boost your efficiency with open source tools."
                  filterCategory="Productivity"
                />
              }
            />
            <Route
              path="/dev-tools"
              element={
                <CategoryPage
                  title="Developer Tools"
                  description="Essential tools for coding, debugging, and building."
                  filterCategory="Dev Tools"
                />
              }
            />
            <Route
              path="/mobile-apps"
              element={
                <CategoryPage
                  title="Mobile Apps"
                  description="Open source Android apps, including Shizuku-optimized tools."
                  filterCategory="Mobile Apps"
                />
              }
            />
            <Route path="/developers" element={<DevelopersPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/submit" element={<SubmitProjectPage />} />
            <Route path="/project/:id" element={<ProjectDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
