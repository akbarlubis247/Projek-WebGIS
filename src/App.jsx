import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LandingPageView from './components/LandingPageView';
import SuperAdminView from './components/SuperAdminView';
import DashboardView from './components/DashboardView';
import MapExplorerView from './components/MapExplorerView';
import FoodSecurityView from './components/FoodSecurityView';
import WelfareView from './components/WelfareView';
import CleanWaterView from './components/CleanWaterView';
import PriorityAreasView from './components/PriorityAreasView';
import IndicatorDataView from './components/IndicatorDataView';
import DataEntryView from './components/DataEntryView';
import FoodSafetyMgmtView from './components/FoodSafetyMgmtView';
import AboutView from './components/AboutView';
import LoginModal from './components/LoginModal';
import { INITIAL_ADMINS_LIST } from './data/bogorData';

export default function App() {
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
  );
}
