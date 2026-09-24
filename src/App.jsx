import React, { useState } from 'react';
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

// Super Admin Management Views
import SuperAdminView from './components/superadmin/SuperAdminView';
import { INITIAL_ADMINS_LIST } from './data/bogorData';

export default function App() {
  // Intro Screen State
  const [showIntro, setShowIntro] = useState(true);

  // Roles: 'guest' (Public Warga) | 'admin' (Staff Admin SIG) | 'superadmin' (Super Admin Management)
  const [currentUser, setCurrentUser] = useState({
    name: 'Warga / Pengunjung',
    role: 'guest',
    email: '',
    isLoggedIn: false
  });

  const [adminsList, setAdminsList] = useState(INITIAL_ADMINS_LIST);
  const [activePage, setActivePage] = useState('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser({
      name: 'Warga / Pengunjung',
      role: 'guest',
      email: '',
      isLoggedIn: false
    });
    setActivePage('landing');
  };

  // Handle Login Success
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    if (userData.role === 'superadmin') {
      setActivePage('superadmin-mgmt');
    } else if (userData.role === 'admin') {
      setActivePage('dashboard');
    } else {
      setActivePage('landing');
    }
  };

  // Render view content based on active page
  const renderView = () => {
    // 1. SUPERADMIN VIEW
    if (currentUser.role === 'superadmin') {
      return (
        <SuperAdminView
          admins={adminsList}
          setAdmins={setAdminsList}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      );
    }

    // 2. OPERATIONAL & PUBLIC VIEWS
    switch (activePage) {
      case 'landing':
        return (
          <LandingPageView
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onSelectKecamatan={setSelectedKecamatan}
          />
        );
      case 'dashboard':
        return (
          <DashboardView
            onNavigate={setActivePage}
            onSelectKecamatan={setSelectedKecamatan}
          />
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
            onSelectKecamatan={setSelectedKecamatan}
            onNavigate={setActivePage}
          />
        );
      case 'indicator-data':
        return <IndicatorDataView />;
      case 'data-entry':
        return <DataEntryView />;
      case 'food-safety':
        return <FoodSafetyMgmtView />;
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
