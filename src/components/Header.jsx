import React from 'react';
import { Menu, ChevronRight, UserCheck, LogOut, PanelLeftOpen, PanelLeftClose, ShieldCheck, User } from 'lucide-react';
import { ADMIN_MENU_ITEMS, GUEST_MENU_ITEMS, SUPERADMIN_MENU_ITEMS } from './Sidebar';

export default function Header({
  activePage,
  onToggleSidebar,
  isCollapsed,
  onToggleCollapse,
  currentUser,
  onLogout,
  onLoginClick
}) {
  const allItems = [...ADMIN_MENU_ITEMS, ...GUEST_MENU_ITEMS, ...SUPERADMIN_MENU_ITEMS];
  const currentMenuItem = allItems.find((m) => m.id === activePage) || allItems[0];

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="sidebar-toggle-icon-btn"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>

        <button className="menu-toggle-btn" onClick={onToggleSidebar} aria-label="Buka Menu Mobile">
          <Menu size={22} />
        </button>


      </div>

      <div className="header-right">
        {/* User Account / Login or Logout Button */}
        <div className="user-action-wrap">
          {currentUser.isLoggedIn ? (
            <div className="header-user-badge">
              <div className="header-avatar">
                {currentUser.name ? currentUser.name[0].toUpperCase() : 'A'}
              </div>
              <div className="header-user-meta">
                <span className="h-name">{currentUser.name}</span>
                <span className="h-status font-mono">
                  {currentUser.role === 'superadmin' ? 'Super Admin' : 'Staff Admin'}
                </span>
              </div>

              <button
                className="header-logout-btn"
                onClick={onLogout}
                title="Keluar (Logout)"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button className="primary-btn-sm" onClick={onLoginClick}>
              <UserCheck size={16} /> Login Admin / SuperAdmin
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
