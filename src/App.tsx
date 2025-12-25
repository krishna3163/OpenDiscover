import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { DiscoverPage } from './pages/DiscoverPage';
import { CategoryPage } from './pages/CategoryPage';
import { DevelopersPage } from './pages/DevelopersPage';
import { LoginPage } from './pages/LoginPage';
import { SubmitProjectPage } from './pages/SubmitProjectPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';

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
          </Routes>
        </main>

        <footer style={{ borderTop: '1px solid var(--border-color)', padding: '4rem 0', marginTop: 'auto', background: 'var(--bg-card)' }}>
          <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <div style={{ marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>LEGAL DISCLAIMER</p>
              <p>
                OpenDiscover does not host, distribute, or modify any software binaries.
                All projects are indexed links to official sources (GitHub, F-Droid, Hugging Face, etc.).
                We are a discovery metadata engine only.
              </p>
            </div>

            <p>© 2024 OpenDiscover. Connecting you to open innovation.</p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1rem' }}>
              <a href="#">About</a>
              <a href="#">Licenses Explained</a>
              <a href="#">Privacy Policy</a>
              <a href="#">DMCA / Copyright Report</a>
              <a href="#">GitHub Repo</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
