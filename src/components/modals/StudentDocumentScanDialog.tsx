import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Download, LoaderCircle, RefreshCw, ScanLine, Upload, X } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from '../ui/toast';
import { extractStudentDocumentFn, createScannedStudentFn } from '../../server/functions/studentDocuments';

/** Stable URL — always resolves to the latest released installer. */
const SCANNER_AGENT_INSTALLER_URL =
  'https://github.com/amimardev/mosque_app/releases/latest/download/ScannerAgentSetup-Rust.exe';

type Phase =
  | 'checking'        // auto health-check on open
  | 'agent_missing'   // connection refused → show install panel
  | 'needs_token'     // agent running, waiting for token input
  | 'loading_scanners'// fetching scanner list
  | 'ready'           // scanner selected, ready to scan
  | 'scanning'        // scan + extraction in progress
  | 'reviewing';      // scan done, user reviews extracted data

type Scanner = { id: string; name: string };
type Review = {
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  level: 'primary' | 'middle' | 'secondary';
  address: string;
  guardianPhone: string;
};

const defaultReview: Review = {
  name: '', dateOfBirth: '', gender: 'male', level: 'middle', address: '', guardianPhone: '',
};

function base64ToBlob(data: string, mimeType: string) {
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mimeType });
}

async function compressForServer(blob: Blob) {
  const bitmap = await createImageBitmap(blob);
  const scale = Math.min(1, 2000 / bitmap.width, 2800 / bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('تعذر تجهيز صورة الوثيقة');
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const compressed = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (value) => (value ? resolve(value) : reject(new Error('تعذر تجهيز صورة الوثيقة'))),
      'image/jpeg',
      0.75,
    );
  });
  const bytes = new Uint8Array(await compressed.arrayBuffer());
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return { mimeType: 'image/jpeg' as const, imageBase64: btoa(binary) };
}

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (parentDataNotLinked?: boolean) => void;
}

export function StudentDocumentScanDialog({ open, onClose, onCreated }: Props) {
  const agentUrl = useMemo(
    () => (import.meta.env.VITE_SCANNER_AGENT_URL || 'http://127.0.0.1:8765').replace(/\/$/, ''),
    [],
  );

  const [phase, setPhase] = useState<Phase>('checking');
  const [token, setToken] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [scanners, setScanners] = useState<Scanner[]>([]);
  const [scannerId, setScannerId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [scanId, setScanId] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [profileImage, setProfileImage] = useState<{ mimeType: 'image/jpeg'; imageBase64: string } | null>(null);
  const [review, setReview] = useState<Review>(defaultReview);
  const [duplicateMatches, setDuplicateMatches] = useState<{ id: string; name: string }[]>([]);

  const busy = phase === 'checking' || phase === 'loading_scanners' || phase === 'scanning';

  useEffect(() => {
    return () => { if (documentUrl) URL.revokeObjectURL(documentUrl); };
  }, [documentUrl]);

  // ── Auto health-check on every open ───────────────────────────────────────
  const checkHealth = useCallback(async () => {
    setPhase('checking');
    setError('');
    try {
      const health = await fetch(`${agentUrl}/health`, { cache: 'no-store' });
      if (!health.ok) {
        setError('الخدمة تعمل لكن ردّت بخطأ. أعد تشغيلها وحاول مجدداً.');
        setPhase('needs_token');
        return;
      }
      const status = await health.json();
      if (!status.token_configured) {
        setError('رمز الخدمة غير مضبوط. افتح ملف .env في مجلد التثبيت وأضف SCANNER_AGENT_TOKEN.');
        setPhase('needs_token');
        return;
      }
      setPhase('needs_token');
    } catch {
      // connection refused → agent not installed / not running
      setPhase('agent_missing');
      toast.add({
        type: 'error',
        title: 'خدمة الماسح غير متوفرة',
        description: 'تعذر الاتصال بخدمة الماسح المحلية. تأكد من تثبيتها وتشغيلها.',
      });
    }
  }, [agentUrl]);

  useEffect(() => {
    if (open) {
      void checkHealth();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const resetToStart = () => {
    if (documentUrl) URL.revokeObjectURL(documentUrl);
    setDocumentUrl('');
    setToken('');
    setTokenError('');
    setScanners([]);
    setScannerId('');
    setScanId('');
    setProfileImage(null);
    setReview(defaultReview);
    setDuplicateMatches([]);
    setError('');
    setNotice('');
  };

  const close = (force = false) => {
    if (busy && !force) return;
    resetToStart();
    onClose();
  };

  // ── Load scanners (called after valid token entered) ──────────────────────
  const loadScanners = async () => {
    if (token.length < 32) {
      setTokenError('الرمز يجب أن يكون 32 حرفاً على الأقل');
      return;
    }
    setTokenError('');
    setPhase('loading_scanners');
    setError('');
    try {
      let response: Response;
      try {
        response = await fetch(`${agentUrl}/scanners`, {
          headers: { 'X-Scanner-Agent-Token': token },
          cache: 'no-store',
        });
      } catch {
        const msg = 'انقطع الاتصال بالخدمة أثناء تحميل الماسحات.';
        setError(msg);
        toast.add({ type: 'error', title: 'خطأ في الشبكة', description: msg });
        setPhase('needs_token');
        return;
      }
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        const msg = response.status === 401
          ? 'الرمز غير صحيح. أدخل الرمز المضبوط في ملف .env.'
          : body.detail || 'تعذر تحميل قائمة الماسحات';
        setError(msg);
        toast.add({ type: 'error', title: 'تعذر تحميل الماسحات', description: msg });
        setPhase('needs_token');
        return;
      }
      const list: Scanner[] = body.scanners || [];
      setScanners(list);
      setScannerId(list[0]?.id || '');
      if (list.length === 0) {
        setNotice('لم يُعثر على ماسح ضوئي متصل. تأكد من توصيل الجهاز وإعداده كجهاز WIA.');
      }
      setPhase('ready');
    } catch {
      setPhase('needs_token');
    }
  };

  // ── Scan ──────────────────────────────────────────────────────────────────
  const scan = async () => {
    if (!scannerId) return;
    setPhase('scanning');
    setError('');
    setNotice('');
    setDuplicateMatches([]);
    try {
      let response: Response;
      try {
        response = await fetch(`${agentUrl}/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Scanner-Agent-Token': token },
          body: JSON.stringify({ scanner_id: scannerId }),
        });
      } catch {
        const msg = 'انقطع الاتصال بالخدمة أثناء المسح. تحقق من إذن الشبكة المحلية في Chrome.';
        setError(msg);
        toast.add({ type: 'error', title: 'خطأ في الشبكة', description: msg });
        setPhase('ready');
        return;
      }
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        const msg = response.status === 504
          ? 'انتهت مهلة الماسح. تحقق من توصيل الجهاز وحاول مرة أخرى.'
          : result.detail || 'فشل مسح الوثيقة';
        setError(msg);
        toast.add({
          type: response.status === 504 ? 'warning' : 'error',
          title: response.status === 504 ? 'انتهت مهلة المسح' : 'فشل المسح',
          description: msg,
        });
        setPhase('ready');
        return;
      }
      const blob = base64ToBlob(result.image_base64, result.mime_type);
      if (documentUrl) URL.revokeObjectURL(documentUrl);
      setDocumentUrl(URL.createObjectURL(blob));
      setScanId(result.scan_id);
      setProfileImage(null);
      setReview(defaultReview);
      setPhase('reviewing');
      // Extract in background — don't block the review UI
      try {
        const compressed = await compressForServer(blob);
        const extracted = await extractStudentDocumentFn({ data: compressed });
        setReview({
          name: extracted.student.name || '',
          dateOfBirth: extracted.student.dateOfBirth || '',
          gender: extracted.student.gender || 'male',
          level: extracted.student.level || 'middle',
          address: extracted.student.address || '',
          guardianPhone: extracted.student.guardianPhone || '',
        });
        setProfileImage(extracted.profileImage);
        setNotice(extracted.warnings.join(' '));
      } catch (cause) {
        const isNet = cause instanceof TypeError;
        toast.add({
          type: 'error',
          title: isNet ? 'خطأ في الاتصال بالخادم' : 'تعذر تحليل الوثيقة',
          description: isNet
            ? 'تعذر الاتصال بالخادم لتحليل الوثيقة. تحقق من اتصالك بالإنترنت.'
            : cause instanceof Error ? cause.message : 'تعذر تحليل الوثيقة',
        });
        setError('تعذر استخراج البيانات تلقائياً. يمكنك إدخالها يدوياً.');
      }
    } catch {
      setPhase('ready');
    }
  };

  // ── Photo picker ──────────────────────────────────────────────────────────
  const selectPhoto = async (file?: File) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('اختر صورة بصيغة JPEG أو PNG أو WebP');
      return;
    }
    try {
      const jpeg = await compressForServer(file);
      setProfileImage({ mimeType: 'image/jpeg', imageBase64: jpeg.imageBase64 });
      setError('');
    } catch {
      setError('تعذر قراءة الصورة المختارة؛ جرّب ملفاً آخر.');
    }
  };

  // ── Create student ────────────────────────────────────────────────────────
  const create = async (allowDuplicate = false) => {
    if (!review.name.trim()) { setError('أدخل اسم الطالب قبل الحفظ'); return; }
    setError('');
    try {
      const result = await createScannedStudentFn({
        data: {
          student: {
            name: review.name.trim(),
            dateOfBirth: review.dateOfBirth || null,
            gender: review.gender,
            level: review.level,
            address: review.address || null,
            guardianPhone: review.guardianPhone || null,
          },
          profileImage,
          allowDuplicate,
        },
      });
      if (result.status === 'duplicate') {
        setDuplicateMatches(result.matches);
        return;
      }
      onCreated(result.parentDataNotLinked);
      close(true);
    } catch (cause) {
      const isNet = cause instanceof TypeError;
      const msg = isNet
        ? 'تعذر الاتصال بالخادم لحفظ الطالب. تحقق من اتصالك بالإنترنت.'
        : cause instanceof Error ? cause.message : 'تعذر حفظ الطالب';
      setError(msg);
      toast.add({
        type: 'error',
        title: isNet ? 'خطأ في الاتصال بالخادم' : 'تعذر حفظ الطالب',
        description: msg,
      });
    }
  };

  const update = <K extends keyof Review>(key: K, value: Review[K]) =>
    setReview((current) => ({ ...current, [key]: value }));
  const profileUrl = profileImage
    ? `data:${profileImage.mimeType};base64,${profileImage.imageBase64}`
    : '';

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 sm:p-6" dir="rtl">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="scan-dialog-title"
        className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 id="scan-dialog-title" className="text-lg font-extrabold text-slate-900">
              إنشاء طالب من وثيقة
            </h2>
            <p className="text-xs text-slate-500">امسح الوثيقة ثم راجع البيانات قبل الحفظ</p>
          </div>
          <button
            type="button"
            aria-label="إغلاق"
            onClick={() => close()}
            disabled={busy}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-4 overflow-y-auto p-5">

          {/* ── Checking health ── */}
          {phase === 'checking' && (
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              <LoaderCircle className="h-5 w-5 animate-spin text-slate-400" />
              جارٍ التحقق من خدمة الماسح…
            </div>
          )}

          {/* ── Agent not installed / not running ── */}
          {phase === 'agent_missing' && (
            <div className="space-y-4 rounded-2xl border border-rose-200 bg-rose-50 p-5">
              <div className="space-y-1">
                <p className="text-sm font-bold text-rose-900">خدمة الماسح غير مثبتة أو لا تعمل</p>
                <p className="text-xs leading-6 text-rose-700">
                  يلزم تثبيت خدمة الماسح المحلية على جهاز Windows المتصل بالماسح الضوئي.
                  بعد التثبيت، افتح{' '}
                  <span className="rounded bg-rose-100 px-1 font-mono">
                    %LOCALAPPDATA%\ScannerAgent\.env
                  </span>{' '}
                  وأدخل رمز الخدمة وعنوان الموقع، ثم أعد تشغيل الخدمة.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={SCANNER_AGENT_INSTALLER_URL}
                  download
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-700 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-rose-800"
                >
                  <Download className="h-4 w-4" />
                  تنزيل المثبّت (Windows)
                </a>
                <Button type="button" variant="outline" onClick={checkHealth}>
                  <RefreshCw className="h-4 w-4" />
                  إعادة المحاولة
                </Button>
              </div>
            </div>
          )}

          {/* ── Token input (agent is running, needs auth) ── */}
          {phase === 'needs_token' && (
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div>
                <p className="text-sm font-bold text-slate-800">أدخل رمز خدمة الماسح</p>
                <p className="text-xs leading-6 text-slate-500">
                  الرمز هو قيمة{' '}
                  <span className="font-mono">SCANNER_AGENT_TOKEN</span>{' '}
                  في ملف{' '}
                  <span className="font-mono">%LOCALAPPDATA%\ScannerAgent\.env</span>.
                </p>
              </div>
              <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
                <span>رمز الخدمة</span>
                <input
                  type="password"
                  autoComplete="off"
                  autoFocus
                  value={token}
                  onChange={(e) => { setToken(e.target.value); setTokenError(''); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') void loadScanners(); }}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                {tokenError && <span className="text-rose-600">{tokenError}</span>}
              </label>
              <Button
                type="button"
                onClick={loadScanners}
                disabled={token.length < 32}
                className="w-full"
              >
                تحميل قائمة الماسحات
              </Button>
            </div>
          )}

          {/* ── Loading scanners ── */}
          {phase === 'loading_scanners' && (
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              <LoaderCircle className="h-5 w-5 animate-spin text-slate-400" />
              جارٍ تحميل قائمة الماسحات…
            </div>
          )}

          {/* ── Ready: scanner select + scan button ── */}
          {phase === 'ready' && (
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              {scanners.length === 0 ? (
                <p className="text-sm text-slate-600">
                  لم يُعثر على ماسح ضوئي متصل. تأكد من توصيل الجهاز وإعداده كجهاز WIA ثم أعد المحاولة.
                </p>
              ) : (
                <>
                  <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
                    <span>اختر الماسح الضوئي</span>
                    <select
                      value={scannerId}
                      onChange={(e) => setScannerId(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
                    >
                      {scanners.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </label>
                  <Button
                    type="button"
                    onClick={scan}
                    disabled={!scannerId}
                    className="w-full"
                  >
                    <ScanLine className="h-4 w-4" />
                    مسح الوثيقة
                  </Button>
                </>
              )}
              <button
                type="button"
                onClick={() => { setScanners([]); setScannerId(''); void loadScanners(); }}
                className="text-xs text-slate-400 hover:text-slate-600 underline"
              >
                إعادة تحميل الماسحات
              </button>
            </div>
          )}

          {/* ── Scanning in progress ── */}
          {phase === 'scanning' && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
              <LoaderCircle className="h-8 w-8 animate-spin text-emerald-600" />
              <p className="text-sm font-semibold text-slate-700">جارٍ مسح الوثيقة وتحليلها…</p>
              <p className="text-xs text-slate-400">قد يستغرق ذلك حتى دقيقة واحدة</p>
            </div>
          )}

          {/* ── Review scanned document ── */}
          {phase === 'reviewing' && documentUrl && (
            <>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-800">الوثيقة الممسوحة</h3>
                <div className="max-h-[38vh] overflow-auto rounded-2xl border border-slate-200 bg-slate-100 p-2 text-center">
                  <img src={documentUrl} alt="الوثيقة الممسوحة" className="mx-auto max-h-[34vh] max-w-full object-contain" />
                </div>
              </div>

              <div className="grid gap-5 border-t border-slate-100 pt-4 md:grid-cols-[180px_1fr]">
                {/* Profile photo */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-800">الصورة الشخصية</h3>
                  {profileUrl
                    ? <img src={profileUrl} alt="الصورة الشخصية المستخرجة" className="h-40 w-40 rounded-2xl border border-slate-200 object-cover" />
                    : <div className="flex h-40 w-40 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center text-xs text-slate-500">لا توجد صورة<br />اختر صورة يدوياً</div>
                  }
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                    <Upload className="h-4 w-4" />
                    اختيار صورة
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(e) => void selectPhoto(e.target.files?.[0])}
                    />
                  </label>
                </div>

                {/* Editable fields */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-800">راجع المعلومات المستخرجة وعدّلها عند الحاجة</h3>
                  <label className="block space-y-1 text-xs font-semibold">
                    <span>اسم الطالب *</span>
                    <input value={review.name} onChange={(e) => update('name', e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2.5" />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block space-y-1 text-xs font-semibold">
                      <span>تاريخ الميلاد</span>
                      <input type="date" value={review.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2.5" />
                    </label>
                    <label className="block space-y-1 text-xs font-semibold">
                      <span>المستوى</span>
                      <select value={review.level} onChange={(e) => update('level', e.target.value as Review['level'])} className="w-full rounded-xl border border-slate-300 px-3 py-2.5">
                        <option value="primary">ابتدائي</option>
                        <option value="middle">متوسط</option>
                        <option value="secondary">ثانوي</option>
                      </select>
                    </label>
                    <label className="block space-y-1 text-xs font-semibold">
                      <span>الجنس</span>
                      <select value={review.gender} onChange={(e) => update('gender', e.target.value as Review['gender'])} className="w-full rounded-xl border border-slate-300 px-3 py-2.5">
                        <option value="male">ذكر</option>
                        <option value="female">أنثى</option>
                      </select>
                    </label>
                    <label className="block space-y-1 text-xs font-semibold">
                      <span>هاتف ولي الأمر</span>
                      <input type="tel" dir="ltr" value={review.guardianPhone} onChange={(e) => update('guardianPhone', e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-left" />
                    </label>
                  </div>
                  <label className="block space-y-1 text-xs font-semibold">
                    <span>العنوان</span>
                    <textarea value={review.address} onChange={(e) => update('address', e.target.value)} rows={2} className="w-full rounded-xl border border-slate-300 px-3 py-2.5" />
                  </label>
                  <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                    <Button type="button" onClick={() => void create(false)} disabled={!review.name.trim()}>
                      موافق وحفظ الطالب
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => { setDocumentUrl(''); setScanId(''); setDuplicateMatches([]); setReview(defaultReview); setProfileImage(null); setPhase('ready'); }}
                    >
                      إعادة المسح
                    </Button>
                  </div>
                  {scanId && <p className="text-[10px] text-slate-400">رقم المسح: {scanId}</p>}
                </div>
              </div>
            </>
          )}

          {/* Notices, errors, duplicates */}
          {notice && (
            <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              {notice}
            </div>
          )}
          {error && (
            <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-5 text-rose-800">
              {error}
            </div>
          )}
          {duplicateMatches.length > 0 && (
            <div role="alertdialog" aria-label="طالب بنفس الاسم موجود" className="space-y-3 rounded-2xl border border-amber-300 bg-amber-50 p-4">
              <h3 className="font-bold text-amber-950">يوجد طالب مسجل بالاسم نفسه</h3>
              <ul className="list-inside list-disc text-xs text-amber-900">
                {duplicateMatches.map((student) => (
                  <li key={student.id}>{student.name} — {student.id}</li>
                ))}
              </ul>
              <p className="text-xs leading-5 text-amber-900">
                تحقق من الوثيقة. يمكنك إلغاء العملية أو المتابعة وإضافة طالب آخر بالاسم نفسه.
              </p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setDuplicateMatches([])}>
                  إلغاء
                </Button>
                <Button type="button" onClick={() => void create(true)}>
                  إنشاء على أي حال
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
