import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Phone, Lock, BookOpen, AlertCircle, ShieldCheck, User, Users } from 'lucide-react';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const { user, login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect immediately to dashboard
  useEffect(() => {
    if (user) {
      navigate({ to: '/dashboard' });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      setErrorMsg('الرجاء إدخال رقم الهاتف وكلمة المرور');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const success = await login(phone, password);
      if (success) {
        navigate({ to: '/dashboard' });
      } else {
        setErrorMsg('رقم الهاتف أو كلمة المرور غير صحيحة');
      }
    } catch (err) {
      setErrorMsg('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (quickPhone: string) => {
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const success = await login(quickPhone, 'password123');
      if (success) {
        navigate({ to: '/dashboard' });
      } else {
        setErrorMsg('تعذر الدخول بالحساب التجريبي. قد لا يكون الحساب موجوداً في قاعدة البيانات.');
      }
    } catch {
      setErrorMsg('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-4 font-sans" dir="rtl">
      <div className="w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden relative">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500" />

        {/* Top Header */}
        <div className="p-6 sm:p-8 text-center border-b border-slate-100 bg-slate-50/50">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-emerald-600/10 mb-3">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">مدرستنا القرآنية</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">نظام المتابعة، والتقويم اليومي للأداء والحصص</p>
        </div>

        {/* Login form */}
        <div className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                رقم الهاتف
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+964 770 000 0000"
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-left"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-left font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md cursor-pointer transition-colors"
            >
              {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-500 font-bold">الحسابات التجريبية والدخول السريع</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('+9647700000001')}
              disabled={isSubmitting || isLoading}
              className="w-full p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-2xl flex items-center justify-between text-xs font-bold transition-colors cursor-pointer text-right disabled:opacity-60"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-200/60 text-amber-800 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs">مدير المدرسة / المشرف</div>
                  <div className="text-[10px] text-amber-700 font-mono">+9647700000001</div>
                </div>
              </div>
              <span className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-lg shrink-0">مدير</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('+9647700000002')}
              disabled={isSubmitting || isLoading}
              className="w-full p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center justify-between text-xs font-bold transition-colors cursor-pointer text-right disabled:opacity-60"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-200/60 text-emerald-800 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs">الشيخ والمعلم</div>
                  <div className="text-[10px] text-emerald-700 font-mono">+9647700000002</div>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-lg shrink-0">معلم</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('+9647700000003')}
              disabled={isSubmitting || isLoading}
              className="w-full p-3 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-900 rounded-2xl flex items-center justify-between text-xs font-bold transition-colors cursor-pointer text-right disabled:opacity-60"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-200/60 text-teal-800 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs">ولي الأمر والمتابع</div>
                  <div className="text-[10px] text-teal-700 font-mono">+9647700000003</div>
                </div>
              </div>
              <span className="text-[10px] bg-teal-600 text-white px-2 py-0.5 rounded-lg shrink-0">ولي أمر</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
