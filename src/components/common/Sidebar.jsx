import React from 'react';
import {
  LayoutDashboard,
  MapPinned,
  Utensils,
  HeartPulse,
  Droplets,
  AlertTriangle,
  TableProperties,
  FilePlus,
  ShieldCheck,
  UserCheck,
  Info,
  Layers,
  ChevronRight,
  LogOut,
  X,
  UserPlus,
  Home,
  ChevronLeft
} from 'lucide-react';

export const ADMIN_MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard SIG', icon: LayoutDashboard, category: 'Utama' },
  { id: 'map-explorer', label: 'Eksplorasi Peta', icon: MapPinned, category: 'Utama' },
  { id: 'food-security', label: 'Ketahanan Pangan', icon: Utensils, category: 'Detail Indikator' },
  { id: 'welfare', label: 'Kesejahteraan & Stunting', icon: HeartPulse, category: 'Detail Indikator' },
  { id: 'clean-water', label: 'Akses Air Bersih', icon: Droplets, category: 'Detail Indikator' },
  { id: 'priority-areas', label: 'Prioritas Wilayah', icon: AlertTriangle, category: 'Detail Indikator' },
  { id: 'indicator-data', label: 'Data Indikator (PDF/CSV)', icon: TableProperties, category: 'Manajemen Data' },
  { id: 'data-entry', label: 'Entri Data (Manual & CSV)', icon: FilePlus, category: 'Manajemen Data' },
  { id: 'food-safety', label: 'Keamanan Pangan', icon: ShieldCheck, category: 'Manajemen Data' },
  { id: 'about', label: 'Tentang NutriMap', icon: Info, category: 'Pengaturan' },
];

export const GUEST_MENU_ITEMS = [
  { id: 'landing', label: 'Halaman Utama', icon: Home, category: 'Publik' },
  { id: 'map-explorer', label: 'Peta Spasial', icon: MapPinned, category: 'Publik' },
  { id: 'indicator-data', label: 'Data Indikator Kota', icon: TableProperties, category: 'Publik' },
  { id: 'about', label: 'Tentang NutriMap', icon: Info, category: 'Publik' },
];

export const SUPERADMIN_MENU_ITEMS = [
  { id: 'superadmin-mgmt', label: 'Kelola Admin & Hak Akses', icon: UserPlus, category: 'Super Admin' },
];

export default function Sidebar({
  activePage,
  setActivePage,
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
  currentUser,
  onLogout,
  onLoginClick
}) {
  let menuItems = GUEST_MENU_ITEMS;
  let categories = ['Publik'];

  if (currentUser.role === 'superadmin') {
    menuItems = SUPERADMIN_MENU_ITEMS;
    categories = ['Super Admin'];
  } else if (currentUser.role === 'admin') {
    menuItems = ADMIN_MENU_ITEMS;
    categories = ['Utama', 'Detail Indikator', 'Manajemen Data', 'Pengaturan'];
  }

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar-container ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Brand Header */}
        <div className="brand-header">
          <div className="brand-logo">
            <Layers className="brand-icon" size={24} />
          </div>
          {!isCollapsed && (
            <div className="brand-title-wrap">
              <span className="brand-title">NutriMap Kota Bogor</span>
              <span className="brand-subtitle">SIG Ketahanan Pangan</span>
            </div>
          )}
          <button className="collapse-toggle-btn" onClick={onToggleCollapse} title={isCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}>
            <ChevronLeft size={18} className={isCollapsed ? 'rotate-180' : ''} />
          </button>
          <button className="mobile-close-btn" onClick={onClose} aria-label="Tutup menu">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="sidebar-nav-scroll">
          {categories.map((cat) => {
            const items = menuItems.filter((item) => item.category === cat);
            return (
              <div key={cat} className="nav-group">
                {!isCollapsed && <span className="nav-group-title">{cat}</span>}
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      className={`nav-item ${isActive ? 'active' : ''}`}
                      title={isCollapsed ? item.label : ''}
                      onClick={() => {
                        setActivePage(item.id);
                        if (onClose) onClose();
                      }}
                    >
                      <Icon size={18} className="nav-icon" />
                      {!isCollapsed && <span className="nav-label">{item.label}</span>}
                      {isActive && !isCollapsed && <ChevronRight size={16} className="active-arrow" />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer User Card & Logout */}
        <div className="sidebar-footer">
          <div className="user-profile-card">
            <div className="user-avatar">{currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'WG'}</div>
            {!isCollapsed && (
              <div className="user-info">
                <span className="user-name">{currentUser.name || 'Warga / Pengunjung'}</span>
                <span className="user-role">
                  {currentUser.role === 'superadmin'
                    ? 'Super Admin'
                    : currentUser.role === 'admin'
                    ? 'Staff Admin'
                    : 'Publik (Tamu)'}
                </span>
              </div>
            )}
            {currentUser.isLoggedIn ? (
              <button
                className="login-logout-btn text-danger"
                onClick={onLogout}
                title="Keluar (Logout)"
              >
                <LogOut size={18} />
              </button>
            ) : (
              <button
                className="login-logout-btn text-emerald"
                onClick={onLoginClick}
                title="Login Admin"
              >
                <UserCheck size={18} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
