import { createFileRoute, Outlet, useLocation, Link, useNavigate } from '@tanstack/react-router';
import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/apiClient';
import { 
  PanelLeft, RefreshCw, BookOpen, LayoutDashboard, 
  User, UserCheck, Clock, Award, ChevronLeft, ChevronRight, 
  ShieldCheck, X, UserX, Users, LogOut
} from 'lucide-react';
import { ScrollArea } from '../components/ui/scroll-area';
import { useAuth } from '../context/AuthContext';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from '../components/ui/sheet';

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
});

function DashboardLayout() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [counts, setCounts] = useState({
    students: 0,
    parents: 0,
    teachers: 0,
    groups: 0,
    ratings: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const location = useLocation();
  const currentPath = location.pathname;

  // Protect dashboard routes
  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: '/login' });
    }
  }, [user, isLoading]);

  // Redirect parents to their dedicated sessions page
  useEffect(() => {
    if (user && user.role === 'parent' && (currentPath === '/dashboard' || currentPath === '/dashboard/')) {
      navigate({ to: '/dashboard/sessions' });
    }
  }, [user, currentPath]);

  const fetchCounts = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const res = await api.get('/api/stats/counts');
      if (res.data && res.data.counts) {
        setCounts(res.data.counts);
      }
    } catch (err: any) {
      console.warn('Failed to fetch counts from /api/stats/counts:', err?.message || err);
      // Optional fallback if /counts fails
      try {
        const statsRes = await api.get('/api/stats');
        if (statsRes.data?.stats) {
          setCounts({
            students: statsRes.data.stats.totalStudents || 0,
            parents: 0,
            teachers: statsRes.data.stats.totalTeachers || 0,
            groups: statsRes.data.stats.totalGroups || 0,
            ratings: 0
          });
        }
      } catch (fallbackErr) {
        // Silently ignore 429 or network blips
      }
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchCounts();
    }
  }, [fetchCounts, user]);

  const rawNavItems = [
    { to: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, count: null, exact: true },
    { to: '/dashboard/students', label: 'قائمة الطلاب', icon: User, count: counts.students, exact: false },
    { to: '/dashboard/parents', label: 'أولياء الأمور', icon: Users, count: counts.parents, exact: false },
    { to: '/dashboard/teachers', label: 'المعلمون والمشايخ', icon: UserCheck, count: counts.teachers, exact: false },
    { to: '/dashboard/groups', label: 'الحلقات الدراسية', icon: Clock, count: counts.groups, exact: false },
    { to: '/dashboard/sessions', label: 'الحصص واللقاءات اليومية', icon: Clock, count: null, exact: false },
    { to: '/dashboard/ratings', label: 'التقييمات الشهرية', icon: Award, count: counts.ratings, exact: false },
  ];

  const navItems = rawNavItems.filter(item => {
    if (!user) return false;
    if (user.role === 'parent') {
      return item.to === '/dashboard/sessions';
    }
    if (user.role === 'teacher') {
      return item.to !== '/dashboard/parents' && item.to !== '/dashboard/teachers';
    }
    return true;
  });

  const isNavActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return currentPath === item.to || currentPath === `${item.to}/`;
    }
    return currentPath.startsWith(item.to);
  };

  const getPageTitle = () => {
    if (currentPath === '/dashboard' || currentPath === '/dashboard/') {
      return 'لوحة تحكم المدرسة القرآنية';
    }
    if (currentPath.startsWith('/dashboard/students/new')) {
      return 'تسجيل طالب جديد';
    }
    if (currentPath.includes('/students/') && currentPath.endsWith('/edit')) {
      return 'تعديل ملف الطالب';
    }
    if (currentPath.startsWith('/dashboard/students/')) {
      return 'ملف الطالب وتفاصيل الحفظ';
    }
    if (currentPath.startsWith('/dashboard/students')) {
      return 'دليل الطلاب';
    }
    if (currentPath.startsWith('/dashboard/parents')) {
      return 'أولياء الأمور وقنوات التواصل';
    }
    if (currentPath.startsWith('/dashboard/teachers/new')) {
      return 'إضافة معلم جديد';
    }
    if (currentPath.includes('/teachers/') && currentPath.endsWith('/edit')) {
      return 'تعديل ملف المعلم';
    }
    if (currentPath.startsWith('/dashboard/teachers/')) {
      return 'ملف المعلم والحلقات المسندة';
    }
    if (currentPath.startsWith('/dashboard/teachers')) {
      return 'المعلمون والمشايخ';
    }
    if (currentPath.startsWith('/dashboard/sessions')) {
      return 'جدول الحصص واللقاءات اليومية';
    }
    if (currentPath.startsWith('/dashboard/groups/new')) {
      return 'إنشاء حلقة دراسية جديدة';
    }
    if (currentPath.includes('/groups/') && currentPath.endsWith('/edit')) {
      return 'تعديل تفاصيل الحلقة';
    }
    if (currentPath.startsWith('/dashboard/groups/')) {
      return 'تفاصيل الحلقة والطلاب المسجلين';
    }
    if (currentPath.startsWith('/dashboard/groups')) {
      return 'حلقات تحفيظ القرآن';
    }
    if (currentPath.startsWith('/dashboard/ratings/new')) {
      return 'إجراء تقييم شهري جديد';
    }
    if (currentPath.startsWith('/dashboard/ratings')) {
      return 'جدول التقييمات الشهرية';
    }
    return 'بوابة المدرسة القرآنية';
  };

  const renderNavMenu = (isMobile = false) => (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 text-slate-800 select-none text-right">
      {/* Sidebar Logo Header - Perfectly center aligned and cleaned up */}
      <div className={`p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/80 flex items-center justify-between gap-3 ${
        !isMobile && isDesktopCollapsed ? 'justify-center' : ''
      }`}>
        <Link
          to="/dashboard"
          onClick={() => {
            if (isMobile) setIsMobileSheetOpen(false);
          }}
          className="flex items-center gap-3 min-w-0 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0 font-extrabold group-hover:bg-emerald-700 transition-colors">
            <BookOpen className="w-5 h-5" />
          </div>

          {(isMobile || !isDesktopCollapsed) && (
            <div className="min-w-0">
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight truncate font-sans">
                البوابة القرآنية
              </h1>
              <p className="text-[11px] text-slate-500 truncate">
                نظام إدارة حلقات تحفيظ القرآن الكريم
              </p>
            </div>
          )}
        </Link>

        {/* Highly visible, center-aligned Close Button on mobile sheet */}
        {isMobile && (
          <button
            type="button"
            onClick={() => setIsMobileSheetOpen(false)}
            className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors cursor-pointer shrink-0"
            aria-label="إغلاق القائمة"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {(isMobile || !isDesktopCollapsed) && (
          <div className="px-3 pb-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            قائمة التنقل الرئيسية
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isNavActive(item);
          const isCollapsed = !isMobile && isDesktopCollapsed;

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => {
                if (isMobile) setIsMobileSheetOpen(false);
              }}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center transition-all duration-200 group cursor-pointer ${
                isCollapsed
                  ? 'justify-center p-3 rounded-xl'
                  : 'justify-between px-3.5 py-3 rounded-2xl text-xs font-bold'
              } ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-700'
                }`} />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </div>

              {!isCollapsed && item.count !== null && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Footer Profile & Collapse Button */}
      <div className="p-3 border-t border-slate-200/80 bg-slate-50 space-y-2">
        {user && (isMobile || !isDesktopCollapsed) ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-emerald-600 shrink-0 bg-slate-100">
                <img
                  src={user.avatar || "https://api.dicebear.com/7.x/micah/svg"}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-900 truncate block">
                  {user.name}
                </span>
                <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  {user.role === 'admin' ? 'المشرف العام' : user.role === 'teacher' ? 'المعلم الفاضل' : 'ولي الأمر'}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        ) : user ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-emerald-600 bg-slate-100">
              <img
                src={user.avatar || "https://api.dicebear.com/7.x/micah/svg"}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={logout}
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : null}

        {!isMobile && (
          <button
            type="button"
            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            className="hidden lg:flex w-full items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors text-xs font-semibold gap-1.5 cursor-pointer"
            title={isDesktopCollapsed ? 'توسيع القائمة' : 'تصغير القائمة'}
          >
            {isDesktopCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>تصغير القائمة</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 flex font-sans antialiased" dir="rtl">
      {/* 1. Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 border-l border-slate-200/80 transition-all duration-300 ${
          isDesktopCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {renderNavMenu(false)}
      </aside>

      {/* 2. Mobile & Tablet shadcn Sheet Drawer */}
      <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
        <SheetContent side="right" className="p-0 w-72 sm:w-80 bg-white border-l border-slate-200 text-slate-900 [&>button]:hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>قائمة التنقل للمدرسة القرآنية</SheetTitle>
          </SheetHeader>
          {renderNavMenu(true)}
        </SheetContent>
      </Sheet>

      {/* 3. Main Content Area with shadcn ScrollArea */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="shrink-0 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs z-10">
          <div className="flex items-center gap-3">
            {/* Mobile & Tablet Drawer Trigger Button */}
            <button
              onClick={() => setIsMobileSheetOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 shadow-xs flex items-center gap-1.5 cursor-pointer"
              aria-label="فتح قائمة التنقل"
            >
              <PanelLeft className="w-5 h-5 text-emerald-700" />
              <span className="text-xs font-bold text-slate-800">القائمة</span>
            </button>

            {/* Breadcrumb / Page Title */}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
                  {getPageTitle()}
                </h2>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                إدارة المدرسة القرآنية وحلقات المسجد • العام الدراسي 2026/2027
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={fetchCounts}
              title="تحديث بيانات البوابة"
              className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200/60 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>
        </header>

        {/* Scrollable Main Viewport (shadcn ScrollArea) */}
        <ScrollArea className="flex-1 h-[calc(100vh-4rem)] w-full">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
