import React, { useEffect } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { 
  LayoutDashboard, User, UserCheck, Award, 
  BookOpen, Clock, X, ChevronLeft, ChevronRight, 
  ShieldCheck 
} from 'lucide-react';

interface AppSidebarProps {
  counts: {
    students: number;
    teachers: number;
    groups: number;
    ratings: number;
  };
  // Mobile/Tablet Sheet state
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  // Desktop collapsed state
  isDesktopCollapsed?: boolean;
  onToggleDesktopCollapse?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  counts,
  isMobileOpen,
  onCloseMobile,
  isDesktopCollapsed = false,
  onToggleDesktopCollapse
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { to: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, count: null, exact: true },
    { to: '/dashboard/students', label: 'الطلاب', icon: User, count: counts.students, exact: false },
    { to: '/dashboard/teachers', label: 'المعلمون والمشايخ', icon: UserCheck, count: counts.teachers, exact: false },
    { to: '/dashboard/groups', label: 'الحلقات الدراسية', icon: Clock, count: counts.groups, exact: false },
    { to: '/dashboard/ratings', label: 'التقييمات الشهرية', icon: Award, count: counts.ratings, exact: false },
  ];

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const isNavActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return currentPath === item.to || currentPath === `${item.to}/`;
    }
    return currentPath.startsWith(item.to);
  };

  const renderSidebarContent = (isMobileSheet = false) => (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 border-r border-slate-800 select-none">
      {/* 1. Inside Header: App Logo, Title, and Subtitle (Solid Opaque Colors) */}
      <div className={`p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between ${
        !isMobileSheet && isDesktopCollapsed ? 'justify-center' : ''
      }`}>
        <Link
          to="/dashboard"
          onClick={() => {
            if (isMobileSheet) onCloseMobile();
          }}
          className="flex items-center gap-3 min-w-0 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0 font-extrabold group-hover:bg-emerald-500 transition-colors">
            <BookOpen className="w-5 h-5" />
          </div>

          {(isMobileSheet || !isDesktopCollapsed) && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-extrabold text-white tracking-tight truncate font-sans">
                  Madrasa Portal
                </h1>
                <span className="px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-300 border border-emerald-700 text-[9px] font-bold uppercase tracking-wider">
                  Quran
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Mosque & Tahfeez System
              </p>
            </div>
          )}
        </Link>

        {/* Mobile/Tablet Close Button */}
        {isMobileSheet && (
          <button
            onClick={onCloseMobile}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            aria-label="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 2. Navigation Links (Sub-URL Links with Solid Opaque Selection) */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
        {(isMobileSheet || !isDesktopCollapsed) && (
          <div className="px-3 pb-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Main Navigation
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isNavActive(item);
          const isCollapsed = !isMobileSheet && isDesktopCollapsed;

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => {
                if (isMobileSheet) onCloseMobile();
              }}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center transition-all duration-200 group cursor-pointer ${
                isCollapsed
                  ? 'justify-center p-3 rounded-xl'
                  : 'justify-between px-3.5 py-3 rounded-2xl text-xs font-bold'
              } ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md font-bold'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                }`} />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </div>

              {!isCollapsed && item.count !== null && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-emerald-800 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* 3. Footer Inside Menu: Admin User Profile & Collapse Toggle */}
      <div className="p-3 border-t border-slate-800 bg-slate-900 space-y-2">
        {isMobileSheet || !isDesktopCollapsed ? (
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800">
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-emerald-500 shrink-0 bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
                alt="Director"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-white truncate block">
                Madrasa Director
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3 h-3" />
                Administrator
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center p-1">
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-emerald-500 bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
                alt="Director"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Desktop Collapse Toggle Button */}
        {!isMobileSheet && onToggleDesktopCollapse && (
          <button
            onClick={onToggleDesktopCollapse}
            className="hidden lg:flex w-full items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-950 transition-colors text-xs font-semibold gap-1.5 cursor-pointer"
            title={isDesktopCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isDesktopCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. DESKTOP SIDEBAR (Permanent left panel on PC ≥ 1024px) */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 fixed top-0 left-0 bottom-0 z-30 transition-all duration-300 ease-in-out ${
          isDesktopCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* 2. TABLET & MOBILE SLIDE-OVER SHEET (Smooth Drawer < 1024px) */}
      <div 
        className={`lg:hidden fixed inset-0 z-50 transition-[visibility] duration-300 ${
          isMobileOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
        }`}
        aria-hidden={!isMobileOpen}
      >
        {/* Backdrop Overlay with Solid Opaque Tint */}
        <div
          onClick={onCloseMobile}
          className={`fixed inset-0 bg-slate-950/80 transition-opacity duration-300 ease-in-out ${
            isMobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        {/* Slide-over Drawer */}
        <div
          className={`relative w-72 sm:w-80 max-w-[85vw] h-full shadow-2xl z-50 transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {renderSidebarContent(true)}
        </div>
      </div>
    </>
  );
};
