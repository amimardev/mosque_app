import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Download, ExternalLink, LoaderCircle, RefreshCw, ScanLine, Upload, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from '../ui/toast';
import { extractStudentDocumentFn, createScannedStudentFn } from '../../server/functions/studentDocuments';
import { cropPhotoFromBlob } from '../../lib/warpQuad';

/** Stable download URL for latest installer released via GitHub Actions */
const SCANNER_AGENT_INSTALLER_URL =
  'https://github.com/amimardev/mosque_app/releases/latest/download/ScannerAgentSetup-Rust.exe';

/** Official download URL for NAPS2 scanning driver */
const NAPS2_DOWNLOAD_URL = 'https://www.naps2.com/download';

type Phase =
  | 'checking'        // checking connection & loading scanners
  | 'agent_missing'   // agent not installed or not running
  | 'no_scanners'     // agent running but no scanners detected
  | 'ready'           // scanner selected, ready to scan
  | 'scanning'        // currently scanning document
  | 'reviewing';      // document scanned, reviewing & editing data

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
  name: '',
  dateOfBirth: '',
  gender: 'male',
  level: 'middle',
  address: '',
  guardianPhone: '',
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
  const [scanners, setScanners] = useState<Scanner[]>([]);
  const [scannerId, setScannerId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [scanId, setScanId] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [profileImage, setProfileImage] = useState<{ mimeType: 'image/jpeg'; imageBase64: string } | null>(null);
  const [review, setReview] = useState<Review>(defaultReview);
  const [duplicateMatches, setDuplicateMatches] = useState<{ id: string; name: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [scannedBlob, setScannedBlob] = useState<Blob | null>(null);
  const [aiStatus, setAiStatus] = useState<'idle' | 'extracting' | 'success' | 'error'>('idle');
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    return () => {
      if (documentUrl) URL.revokeObjectURL(documentUrl);
    };
  }, [documentUrl]);

  // ── Auto-discover agent and load scanners seamlessly ───────────────────────
  const initScannerAgent = useCallback(async () => {
    setPhase('checking');
    setError('');
    setNotice('');

    try {
      // 1. Health check to test if local agent is running
      let healthRes: Response;
      try {
        healthRes = await fetch(`${agentUrl}/health`, { cache: 'no-store' });
      } catch {
        setPhase('agent_missing');
        toast.add({
          type: 'error',
          title: 'برنامج الماسح غير متصل',
          description: 'تأكد من تثبيت وتشغيل برنامج الماسح على جهاز Windows.',
        });
        return;
      }

      if (!healthRes.ok) {
        setPhase('agent_missing');
        return;
      }

      // 2. Fetch scanners list automatically
      const scannersRes = await fetch(`${agentUrl}/scanners`, {
        cache: 'no-store',
      });

      if (!scannersRes.ok) {
        const body = await scannersRes.json().catch(() => ({}));
        throw new Error(body.detail || 'تعذر تحميل قائمة الماسحات');
      }

      const body = await scannersRes.json();
      const list: Scanner[] = body.scanners || [];
      setScanners(list);

      if (list.length === 0) {
        setPhase('no_scanners');
      } else {
        setScannerId(list[0].id);
        setPhase('ready');
      }
    } catch (cause) {
      const isNet = cause instanceof TypeError;
      const msg = isNet
        ? 'انقطع الاتصال ببرنامج الماسح المحلي.'
        : cause instanceof Error
          ? cause.message
          : 'تعذر الاتصال بالماسح';
      setError(msg);
      toast.add({ type: 'error', title: 'خطأ في الاتصال', description: msg });
      setPhase('agent_missing');
    }
  }, [agentUrl]);

  useEffect(() => {
    if (open) {
      void initScannerAgent();
    }
  }, [open, initScannerAgent]);

  const close = () => {
    if (phase === 'scanning' || submitting) return;
    if (documentUrl) URL.revokeObjectURL(documentUrl);
    setDocumentUrl('');
    setScannedBlob(null);
    setScanners([]);
    setScannerId('');
    setScanId('');
    setProfileImage(null);
    setReview(defaultReview);
    setDuplicateMatches([]);
    setAiStatus('idle');
    setAiError('');
    setError('');
    setNotice('');
    onClose();
  };

  // ── Scan document ──────────────────────────────────────────────────────────
  const startScan = async () => {
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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ scanner_id: scannerId }),
        });
      } catch {
        const msg = 'انقطع الاتصال ببرنامج الماسح أثناء المسح.';
        setError(msg);
        toast.add({ type: 'error', title: 'خطأ في الاتصال', description: msg });
        setPhase('ready');
        return;
      }

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        const msg =
          response.status === 504
            ? 'انتهت مهلة الماسح. تحقق من جاهزية الجهاز وحاول مرة أخرى.'
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
      setScannedBlob(blob);
      setScanId(result.scan_id);
      setProfileImage(null);
      setReview(defaultReview);
      setPhase('reviewing');

      await extractDocumentData(blob);
    } catch {
      setPhase('ready');
    }
  };

  const extractDocumentData = async (blob: Blob) => {
    setAiStatus('extracting');
    setAiError('');
    setError('');
    setNotice('');

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
      // Crop student portrait photo directly in the browser using native Canvas API
      if (extracted.photo_box_1000) {
        try {
          const cropped = await cropPhotoFromBlob(blob, extracted.photo_box_1000);
          if (cropped) {
            setProfileImage(cropped);
          }
        } catch (cropErr) {
          console.warn('Failed to crop portrait photo in browser:', cropErr);
        }
      }
      if (extracted.warnings?.length) {
        setNotice(extracted.warnings.join(' '));
      }
      setAiStatus('success');
    } catch (cause) {
      const isNet = cause instanceof TypeError;
      const msg = isNet
        ? 'تعذر الاتصال بالخادم لتحليل الوثيقة. تحقق من اتصالك بالإنترنت.'
        : cause instanceof Error
          ? cause.message
          : 'تعذر تحليل الوثيقة تلقائياً';
      setAiError(msg);
      setAiStatus('error');
      toast.add({
        type: 'error',
        title: isNet ? 'خطأ في الاتصال بالخادم' : 'تعذر تحليل الوثيقة',
        description: msg,
      });
    }
  };

  // ── Manual photo upload ────────────────────────────────────────────────────
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
  const createStudent = async (allowDuplicate = false) => {
    if (!review.name.trim()) {
      setError('أدخل اسم الطالب قبل الحفظ');
      return;
    }
    setSubmitting(true);
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
      close();
    } catch (cause) {
      const isNet = cause instanceof TypeError;
      const msg = isNet
        ? 'تعذر الاتصال بالخادم لحفظ الطالب. تحقق من اتصالك بالإنترنت.'
        : cause instanceof Error
          ? cause.message
          : 'تعذر حفظ الطالب';
      setError(msg);
      toast.add({
        type: 'error',
        title: isNet ? 'خطأ في الاتصال بالخادم' : 'تعذر حفظ الطالب',
        description: msg,
      });
    } finally {
      setSubmitting(false);
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
            <p className="text-xs text-slate-500">
              امسح الوثيقة عبر الماسح الضوئي ثم راجع البيانات قبل الحفظ
            </p>
          </div>
          <button
            type="button"
            aria-label="إغلاق"
            onClick={close}
            disabled={phase === 'scanning' || submitting}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-4 overflow-y-auto p-5">
          {/* ── Checking agent & loading scanners ── */}
          {phase === 'checking' && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
              <LoaderCircle className="h-8 w-8 animate-spin text-emerald-600" />
              <p className="text-sm font-bold text-slate-800">جارٍ الاتصال بالماسح الضوئي…</p>
              <p className="text-xs text-slate-500">التحقق من برنامج الماسح على جهاز الكمبيوتر</p>
            </div>
          )}

          {/* ── Agent not installed / not running ── */}
          {phase === 'agent_missing' && (
            <div className="space-y-4 rounded-2xl border border-rose-200 bg-rose-50/60 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-rose-950">برنامج الماسح الضوئي غير متصل</h3>
                  <p className="text-xs leading-6 text-rose-800">
                    لمسح الوثائق مباشرة من المتصفح، يلزم تثبيت وتشغيل برنامج الماسح على جهاز Windows المتصل بالماسح الضوئي.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-rose-200/60">
                <a
                  href={SCANNER_AGENT_INSTALLER_URL}
                  download
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  تنزيل برنامج الماسح (Windows)
                </a>
                <a
                  href={NAPS2_DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 text-slate-500" />
                  تثبيت مشغل NAPS2
                </a>
                <Button
                  type="button"
                  variant="outline"
                  onClick={initScannerAgent}
                  className="border-slate-300 text-xs"
                >
                  <RefreshCw className="h-4 w-4" />
                  إعادة المحاولة
                </Button>
              </div>
            </div>
          )}

          {/* ── No scanners found ── */}
          {phase === 'no_scanners' && (
            <div className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-amber-950">لم يتم العثور على أي ماسح ضوئي</h3>
                  <p className="text-xs leading-6 text-amber-800">
                    برنامج الماسح يعمل بنجاح، لكن لم يتعرف النظام على ماسح ضوئي متصل. يرجى التأكد من توصيل كابل الماسح وتشغيله.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-amber-200/60">
                <Button
                  type="button"
                  onClick={initScannerAgent}
                  className="gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4 text-white" />
                  إعادة البحث عن الماسحات
                </Button>
              </div>
            </div>
          )}

          {/* ── Ready to scan ── */}
          {phase === 'ready' && (
            <div className="space-y-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <label htmlFor="scanner-select" className="text-xs font-bold text-slate-800">
                  اختر الماسح الضوئي:
                </label>
                <button
                  type="button"
                  onClick={initScannerAgent}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  تحديث القائمة
                </button>
              </div>

              <Select value={scannerId} onValueChange={(val) => setScannerId(val)} dir="rtl">
                <SelectTrigger
                  id="scanner-select"
                  className="w-full bg-white text-right border-slate-200 shadow-2xs text-slate-800 hover:border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                >
                  <SelectValue placeholder="اختر الماسح الضوئي" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {scanners.map((s) => (
                    <SelectItem key={s.id} value={s.id} className="text-right">
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                onClick={startScan}
                disabled={!scannerId}
                className="w-full py-3 text-sm gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <ScanLine className="h-5 w-5 text-white" />
                بدء مسح الوثيقة
              </Button>
            </div>
          )}

          {/* ── Scanning in progress ── */}
          {phase === 'scanning' && (
            <div className="flex flex-col items-center justify-center gap-3.5 rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center">
              <LoaderCircle className="h-10 w-10 animate-spin text-emerald-600" />
              <div className="space-y-1">
                <p className="text-base font-bold text-slate-900">جارٍ مسح الوثيقة عبر الماسح الضوئي…</p>
                <p className="text-xs text-slate-500">يرجى الانتظار حتى ينتهي الماسح من سحب وتصوير الوثيقة</p>
              </div>
            </div>
          )}

          {/* ── Reviewing scanned document ── */}
          {phase === 'reviewing' && documentUrl && (
            <>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-800">صورة الوثيقة الممسوحة</h3>
                <div className="max-h-[36vh] overflow-auto rounded-2xl border border-slate-200 bg-slate-100 p-2 text-center">
                  <img
                    src={documentUrl}
                    alt="الوثيقة الممسوحة"
                    className="mx-auto max-h-[32vh] max-w-full object-contain rounded-lg"
                  />
                </div>
              </div>

              {/* ── AI Loading State: show spinning circle with clear waiting explanation ── */}
              {aiStatus === 'extracting' && (
                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
                  <LoaderCircle className="h-10 w-10 animate-spin text-emerald-600" />
                  <div className="space-y-1.5">
                    <p className="text-sm font-bold text-slate-800">
                      جارٍ تحليل الوثيقة واستخراج بيانات الطالب بالذكاء الاصطناعي…
                    </p>
                    <p className="text-xs text-slate-500">
                      يرجى الانتظار، يجري التعرف على نصوص الوثيقة وتحديد الصورة الشخصية تلقائياً
                    </p>
                  </div>
                </div>
              )}

              {/* ── AI Error State: show error message directly instead of the form ── */}
              {aiStatus === 'error' && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center space-y-3.5">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-rose-950">فشل تحليل الوثيقة</h4>
                    <p className="text-xs text-rose-800 leading-relaxed max-w-md mx-auto">
                      {aiError || 'تعذر استخراج بيانات الطالب من الوثيقة تلقائياً.'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    {scannedBlob && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => void extractDocumentData(scannedBlob)}
                        className="text-xs gap-1.5"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        إعادة محاولة التحليل
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (documentUrl) URL.revokeObjectURL(documentUrl);
                        setDocumentUrl('');
                        setScannedBlob(null);
                        setScanId('');
                        setDuplicateMatches([]);
                        setReview(defaultReview);
                        setProfileImage(null);
                        setAiStatus('idle');
                        setAiError('');
                        setPhase('ready');
                      }}
                      className="text-xs gap-1.5"
                    >
                      إعادة المسح
                    </Button>
                    <button
                      type="button"
                      onClick={() => setAiStatus('success')}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline"
                    >
                      أو إدخال البيانات يدوياً
                    </button>
                  </div>
                </div>
              )}

              {/* ── Extracted Data Form: only shown when AI extraction succeeds ── */}
              {aiStatus === 'success' && (
                <div className="grid gap-5 border-t border-slate-100 pt-4 md:grid-cols-[180px_1fr]">
                  {/* Profile photo */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-800">الصورة الشخصية</h3>
                    {profileUrl ? (
                      <img
                        src={profileUrl}
                        alt="الصورة المستخرجة"
                        className="h-40 w-40 rounded-2xl border border-slate-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-40 w-40 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-3 text-center text-xs text-slate-500">
                        <span>لا توجد صورة شخصية</span>
                        <span className="text-[10px] text-slate-400 mt-1">يمكنك اختيار صورة يدوياً</span>
                      </div>
                    )}
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

                  {/* Editable review fields */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-800">
                      مراجعة وتعديل بيانات الطالب
                    </h3>
                    <label className="block space-y-1 text-xs font-semibold">
                      <span>اسم الطالب *</span>
                      <input
                        value={review.name}
                        onChange={(e) => update('name', e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                        placeholder="الاسم الكامل"
                      />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block space-y-1 text-xs font-semibold">
                        <span>تاريخ الميلاد</span>
                        <input
                          type="date"
                          value={review.dateOfBirth}
                          onChange={(e) => update('dateOfBirth', e.target.value)}
                          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                        />
                      </label>
                      <label className="block space-y-1 text-xs font-semibold">
                        <span>المستوى التعليمي</span>
                        <select
                          value={review.level}
                          onChange={(e) => update('level', e.target.value as Review['level'])}
                          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                        >
                          <option value="primary">ابتدائي</option>
                          <option value="middle">متوسط</option>
                          <option value="secondary">ثانوي</option>
                        </select>
                      </label>
                      <label className="block space-y-1 text-xs font-semibold">
                        <span>الجنس</span>
                        <select
                          value={review.gender}
                          onChange={(e) => update('gender', e.target.value as Review['gender'])}
                          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                        >
                          <option value="male">ذكر</option>
                          <option value="female">أنثى</option>
                        </select>
                      </label>
                      <label className="block space-y-1 text-xs font-semibold">
                        <span>هاتف ولي الأمر</span>
                        <input
                          type="tel"
                          dir="ltr"
                          value={review.guardianPhone}
                          onChange={(e) => update('guardianPhone', e.target.value)}
                          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-left text-sm"
                          placeholder="05XXXXXXXX"
                        />
                      </label>
                    </div>
                    <label className="block space-y-1 text-xs font-semibold">
                      <span>العنوان</span>
                      <textarea
                        value={review.address}
                        onChange={(e) => update('address', e.target.value)}
                        rows={2}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                      />
                    </label>

                    <div className="flex flex-wrap items-center gap-2.5 border-t border-slate-100 pt-3">
                      <Button
                        type="button"
                        onClick={() => void createStudent(false)}
                        disabled={submitting || !review.name.trim()}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs cursor-pointer"
                      >
                        {submitting ? <LoaderCircle className="h-4 w-4 animate-spin ml-2 text-white" /> : null}
                        حفظ وتأكيد الطالب
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (documentUrl) URL.revokeObjectURL(documentUrl);
                          setDocumentUrl('');
                          setScannedBlob(null);
                          setScanId('');
                          setDuplicateMatches([]);
                          setReview(defaultReview);
                          setProfileImage(null);
                          setAiStatus('idle');
                          setAiError('');
                          setPhase('ready');
                        }}
                        disabled={submitting}
                      >
                        إعادة المسح
                      </Button>
                    </div>
                    {scanId && <p className="text-[10px] text-slate-400">رقم المسح: {scanId}</p>}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Notices & general errors */}
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

          {/* Duplicate student warnings */}
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
                <Button type="button" variant="outline" onClick={() => setDuplicateMatches([])} disabled={submitting}>
                  إلغاء
                </Button>
                <Button
                  type="button"
                  onClick={() => void createStudent(true)}
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  {submitting ? <LoaderCircle className="h-4 w-4 animate-spin ml-2 text-white" /> : null}
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
