import { useEffect, useState } from 'react';
import { BellRing, Download, X } from 'lucide-react';
import { getOneSignal } from '@/lib/onesignal';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

function isIosDevice() {
  return typeof navigator !== 'undefined' && (
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

function isStandalone() {
  return typeof window !== 'undefined' && (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function ParentPushOnboarding({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [ios, setIos] = useState(false);
  const [standalone, setStandalone] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const appIdConfigured = Boolean(import.meta.env.VITE_ONESIGNAL_APP_ID);

  useEffect(() => {
    setIos(isIosDevice());
    setStandalone(isStandalone());
    if (!('Notification' in window)) setPermission('unsupported');
    else setPermission(Notification.permission);

    const onInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstallPrompt(null);
      setStandalone(true);
    };
    window.addEventListener('beforeinstallprompt', onInstallPrompt);
    window.addEventListener('appinstalled', onInstalled);

    let active = true;
    void (async () => {
      if (!appIdConfigured) {
        setOpen(true);
        return;
      }
      try {
        const OneSignal = await getOneSignal();
        if (!OneSignal || !active) return;
        await OneSignal.login(userId);
        const granted = OneSignal.Notifications.permission;
        setPermission(granted ? 'granted' : Notification.permission);
        // Ask parents to install the app or enable push whenever either step is
        // still incomplete; a fully configured installed app needs no prompt.
        setOpen(!granted || !isStandalone());
      } catch (error) {
        console.error('OneSignal initialization failed:', error);
        setOpen(true);
      }
    })();

    return () => {
      active = false;
      window.removeEventListener('beforeinstallprompt', onInstallPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, [appIdConfigured, userId]);

  const installApp = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') setMessage('بعد اكتمال التثبيت، افتح التطبيق من الشاشة الرئيسية لتفعيل التنبيهات.');
    setInstallPrompt(null);
  };

  const enableNotifications = async () => {
    if (permission === 'granted') {
      setOpen(false);
      return;
    }
    setBusy(true);
    setMessage('');
    try {
      const OneSignal = await getOneSignal();
      if (!OneSignal) {
        setMessage('إعداد OneSignal غير مكتمل. يلزم ضبط معرّف التطبيق في إعدادات النشر.');
        return;
      }
      await OneSignal.login(userId);
      const granted = await OneSignal.Notifications.requestPermission();
      setPermission(granted ? 'granted' : Notification.permission);
      if (granted) {
        setMessage('تم تفعيل تنبيهات الحضور لهذا الجهاز.');
        window.setTimeout(() => setOpen(false), 1200);
      } else {
        setMessage('لم يتم السماح بالتنبيهات. يمكنك تفعيلها لاحقاً من إعدادات المتصفح.');
      }
    } catch (error) {
      console.error('Unable to enable push notifications:', error);
      setMessage('تعذّر تفعيل التنبيهات. تحقق من إعداد OneSignal ثم أعد المحاولة.');
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;
  const requiresIosInstall = ios && !standalone;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4" dir="rtl">
      <section className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="push-onboarding-title">
        <button type="button" onClick={() => setOpen(false)} aria-label="إغلاق" className="absolute left-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100">
          <X className="h-4 w-4" />
        </button>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <BellRing className="h-6 w-6" />
        </div>
        <h2 id="push-onboarding-title" className="text-lg font-extrabold text-slate-900">تنبيهات حضور أبنائك</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">فعّل إشعارات الجهاز ليصلك تنبيه عند تسجيل غياب أو تأخر أحد أبنائك.</p>

        {requiresIosInstall && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            <p className="font-bold">للتنبيهات على iPhone أو iPad، أضف الموقع إلى الشاشة الرئيسية أولاً:</p>
            <ol className="mt-2 list-inside list-decimal">
              <li>اضغط زر المشاركة في المتصفح.</li>
              <li>اختر «إضافة إلى الشاشة الرئيسية» ثم افتح التطبيق من الأيقونة.</li>
              <li>ارجع إلى هنا واضغط تفعيل التنبيهات.</li>
            </ol>
          </div>
        )}
        {!standalone && !requiresIosInstall && (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            <p className="font-bold">يمكنك تثبيت البوابة كتطبيق على جهازك.</p>
            <p className="mt-1">استخدم زر التثبيت أو اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية» من قائمة المتصفح.</p>
          </div>
        )}

        {!appIdConfigured && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-xs leading-5 text-rose-800">يلزم ضبط VITE_ONESIGNAL_APP_ID في إعدادات Vercel وربط النطاق في لوحة OneSignal قبل تفعيل الاشتراك.</p>}
        {permission === 'denied' && <p className="mt-3 text-xs text-amber-700">سبق رفض الإذن. غيّر إذن التنبيهات من إعدادات المتصفح ثم أعد المحاولة.</p>}
        {message && <p className="mt-3 text-xs font-semibold text-emerald-700" role="status">{message}</p>}

        <div className="mt-5 flex flex-col gap-2">
          {installPrompt && !standalone && (
            <button type="button" onClick={() => void installApp()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
              <Download className="h-4 w-4" /> تثبيت التطبيق
            </button>
          )}
          <button type="button" disabled={!appIdConfigured || busy || requiresIosInstall || permission === 'unsupported'} onClick={() => void enableNotifications()} className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50">
            {busy ? 'جارٍ التفعيل…' : permission === 'granted' ? 'التنبيهات مفعّلة' : 'تفعيل تنبيهات الحضور'}
          </button>
          <button type="button" onClick={() => setOpen(false)} className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50">لاحقاً</button>
        </div>
      </section>
    </div>
  );
}
