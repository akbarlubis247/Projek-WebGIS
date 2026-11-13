import React, { useEffect, useState } from 'react';
// Common / Shared Layout Components
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import LoginModal from './components/common/LoginModal';
import IntroOverlay from './components/common/IntroOverlay';

// User / Public Views
import LandingPageView from './components/user/LandingPageView';
import MapExplorerView from './components/user/MapExplorerView';
import FoodSecurityView from './components/user/FoodSecurityView';
import WelfareView from './components/user/WelfareView';
import CleanWaterView from './components/user/CleanWaterView';
import PriorityAreasView from './components/user/PriorityAreasView';
import IndicatorDataView from './components/user/IndicatorDataView';
import AboutView from './components/user/AboutView';

// Admin Operational Views
import DashboardView from './components/admin/DashboardView';
import DataEntryView from './components/admin/DataEntryView';
import FoodSafetyMgmtView from './components/admin/FoodSafetyMgmtView';
import PublicContentEditorView from './components/admin/PublicContentEditorView';

// Super Admin Management Views
import SuperAdminView from './components/superadmin/SuperAdminView';
import { clearStoredToken, fetchMeApi, getStoredToken } from './services/api';

export default function App() {
  // Intro Screen State (Disabled by default in production for instant clean loading)
  const [showIntro, setShowIntro] = useState(false);

  // Roles: 'guest' (Public Warga) | 'admin' (Staff Admin SIG) | 'superadmin' (Super Admin Management)
  const [currentUser, setCurrentUser] = useState({
    name: 'Warga / Pengunjung',
    role: 'guest',
    email: '',
    agency: '',
    isLoggedIn: false
  });

  const [activePage, setActivePage] = useState('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return undefined;

    const controller = new AbortController();
    fetchMeApi({ signal: controller.signal })
      .then((res) => {
        if (res?.user) {
          setCurrentUser({
            id: res.user.id,
            name: res.user.name || (res.user.role === 'superadmin' ? 'Super Admin' : 'Admin Instansi'),
            role: res.user.role,
            email: res.user.email,
            agency: res.user.agency || 'Pemerintah Kota Bogor',
            last_login_at: res.user.last_login_at || null,
            isLoggedIn: true,
          });
          setActivePage((prev) => (prev === 'landing' ? 'dashboard' : prev));
        }
      })
      .catch(() => {
        clearStoredToken();
      });

    return () => controller.abort();
  }, []);

  // Handle Logout
  const handleLogout = () => {
    clearStoredToken();
    setCurrentUser({
      name: 'Warga / Pengunjung',
      role: 'guest',
      email: '',
      agency: '',
      isLoggedIn: false
    });
    setActivePage('landing');
  };

  // Handle Login Success
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    if (userData.role === 'superadmin' || userData.role === 'admin') {
      setActivePage('dashboard');
    } else {
      setActivePage('landing');
    }
  };

  // Render view content based on active page
  const renderView = () => {
    const isAuthenticated = currentUser.isLoggedIn && (currentUser.role === 'admin' || currentUser.role === 'superadmin');

    switch (activePage) {
      case 'landing':
        return (
          <LandingPageView
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onSelectKecamatan={setSelectedKecamatan}
            currentUser={currentUser}
            onNavigate={setActivePage}
          />
        );
      case 'dashboard':
        if (!isAuthenticated) {
          return (
            <LandingPageView
              onOpenLogin={() => setIsLoginModalOpen(true)}
              onSelectKecamatan={setSelectedKecamatan}
              currentUser={currentUser}
              onNavigate={setActivePage}
            />
          );
        }
        return (
          <DashboardView
            currentUser={currentUser}
            onNavigate={setActivePage}
            onSelectKecamatan={setSelectedKecamatan}
          />
        );
      case 'superadmin-mgmt':
        if (currentUser.role === 'superadmin') {
          return (
            <SuperAdminView
              currentUser={currentUser}
              onNavigate={setActivePage}
              onLogout={handleLogout}
            />
          );
        }
        return (
          <div className="view-container animate-fade-in" style={{ padding: 32 }}>
            <div className="dash-card" style={{ padding: 28, borderLeft: '4px solid #dc2626' }}>
              <h2 style={{ marginTop: 0, color: '#991b1b' }}>Akses Terbatas (Khusus Super Admin)</h2>
              <p style={{ color: '#475569' }}>
                Halaman Manajemen Akun &amp; Audit Log hanya dapat diakses oleh pengguna dengan role <strong>superadmin</strong>.
              </p>
              <button
                type="button"
                className="primary-btn-sm"
                onClick={() => setActivePage(isAuthenticated ? 'dashboard' : 'landing')}
              >
                Kembali ke {isAuthenticated ? 'Dashboard' : 'Beranda'}
              </button>
            </div>
          </div>
        );
      case 'map-explorer':
        return (
          <MapExplorerView
            onNavigate={setActivePage}
          />
        );
      case 'food-security':
        return <FoodSecurityView />;
      case 'welfare':
        return <WelfareView />;
      case 'clean-water':
        return <CleanWaterView />;
      case 'priority-areas':
        return (
          <PriorityAreasView
            currentUser={currentUser}
            onSelectKecamatan={setSelectedKecamatan}
            onNavigate={setActivePage}
          />
        );
      case 'indicator-data':
        return <IndicatorDataView />;
      case 'data-entry':
        return isAuthenticated ? <DataEntryView currentUser={currentUser} /> : <LandingPageView onOpenLogin={() => setIsLoginModalOpen(true)} onSelectKecamatan={setSelectedKecamatan} />;
      case 'food-safety':
        return isAuthenticated ? <FoodSafetyMgmtView /> : <LandingPageView onOpenLogin={() => setIsLoginModalOpen(true)} onSelectKecamatan={setSelectedKecamatan} />;
      case 'content-mgmt':
        return isAuthenticated ? <PublicContentEditorView onNavigate={setActivePage} /> : <LandingPageView onOpenLogin={() => setIsLoginModalOpen(true)} onSelectKecamatan={setSelectedKecamatan} />;
      case 'about':
        return <AboutView />;
      default:
        return (
          <LandingPageView
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onSelectKecamatan={setSelectedKecamatan}
          />
        );
    }
  };

  // Check if Public Guest Mode
  const isGuest = currentUser.role === 'guest';

  return (
    <>
      {/* 1. OVERLAY INTERACTIVE INTRO SCREEN */}
      {showIntro && (
        <IntroOverlay onFinish={() => setShowIntro(false)} />
      )}

      {/* 2. MAIN WEBSITE CONTAINER (Reveals smoothly after intro) */}
      <div id="main-website">
        <div className={`app-layout ${isGuest ? 'public-layout-mode' : ''} ${isCollapsed ? 'sidebar-is-collapsed' : ''}`}>
          {/* If Public Guest Mode -> Render Top Navbar only (NO SIDEBAR) */}
          {isGuest ? (
            <div className="public-wrapper">
              <Navbar
                activePage={activePage}
                setActivePage={setActivePage}
                onOpenLogin={() => setIsLoginModalOpen(true)}
              />
              <main className="public-main-content">
                {renderView()}
              </main>
            </div>
          ) : (
            /* Logged In (Admin / Superadmin) -> Render Sidebar + Header Layout */
            <>
              <Sidebar
                activePage={activePage}
                setActivePage={setActivePage}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                currentUser={currentUser}
                onLogout={handleLogout}
                onLoginClick={() => setIsLoginModalOpen(true)}
              />

              <div className="main-wrapper">
                <Header
                  activePage={activePage}
                  onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                  isCollapsed={isCollapsed}
                  onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onLoginClick={() => setIsLoginModalOpen(true)}
                />

                <main className="main-content">
                  {renderView()}
                </main>
              </div>
            </>
          )}

          {/* Authentication Modal */}
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
            adminsList={adminsList}
          />
        </div>
      </div>
    </>
  );
}
