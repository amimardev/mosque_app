import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { MissingScannerAgentNotice } from '@/components/common/MissingScannerAgentNotice';
import {
  Upload,
  Camera,
  ScanLine,
  RefreshCw,
  LoaderCircle,
  FileImage,
  AlertCircle,
  VideoOff,
} from 'lucide-react';

interface Scanner {
  id: string;
  name: string;
}

interface AvatarSourceDialogProps {
  open: boolean;
  onClose: () => void;
  onImageSelected: (imageSrc: string) => void;
  title?: string;
  entityName?: string;
}

function base64ToBlob(data: string, mimeType: string) {
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mimeType });
}

export const AvatarSourceDialog: React.FC<AvatarSourceDialogProps> = ({
  open,
  onClose,
  onImageSelected,
  title = 'تحديد الصورة الشخصية',
  entityName = 'الطالب أو المعلم',
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera' | 'scanner'>('upload');

  // ── Camera States ───────────────────────────────────────────────────────────
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>('');
  const [isCameraStarting, setIsCameraStarting] = useState(false);

  // Detect mobile device
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }, []);

  const mobileCameraInputRef = useRef<HTMLInputElement>(null);

  // ── Scanner Agent States ───────────────────────────────────────────────────
  const agentUrl = useMemo(
    () => (import.meta.env.VITE_SCANNER_AGENT_URL || 'http://127.0.0.1:8765').replace(/\/$/, ''),
    []
  );
  const [scannerPhase, setScannerPhase] = useState<
    'checking' | 'agent_missing' | 'no_scanners' | 'ready' | 'scanning'
  >('checking');
  const [scanners, setScanners] = useState<Scanner[]>([]);
  const [selectedScannerId, setSelectedScannerId] = useState<string>('');
  const [scannerError, setScannerError] = useState<string>('');

  // ── Stop Camera Stream Helper ───────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Stop camera when dialog closes or user leaves camera tab
  useEffect(() => {
    if (!open || activeTab !== 'camera') {
      stopCamera();
    }
  }, [open, activeTab, stopCamera]);

  // Clean up strictly on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Callback ref to reliably attach stream whenever video DOM element mounts
  const setVideoRef = useCallback((video: HTMLVideoElement | null) => {
    videoRef.current = video;
    if (video && streamRef.current) {
      video.srcObject = streamRef.current;
      video.onloadedmetadata = () => {
        void video.play().catch(() => {});
      };
      void video.play().catch(() => {});
    }
  }, []);

  // ── Camera Initializer ───────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setIsCameraStarting(true);
    setCameraError('');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('الكاميرا غير مدعومة على هذا المتصفح أو تتطلب اتصال HTTPS آمن.');
      }

      // Synchronously stop previous tracks if active
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: { ideal: 'user' },
          },
          audio: false,
        });
      } catch {
        // Fallback for webcams with strict or limited constraints
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;
      setCameraStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          void videoRef.current?.play().catch(() => {});
        };
        void videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('Camera access failed:', err);
      let msg = 'تعذر تشغيل الكاميرا. يرجى التحقق من إذن الوصول للكاميرا في إعدادات المتصفح.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'تم رفض الإذن بالوصول إلى الكاميرا. يرجى السماح بها من شريط العنوان في المتصفح.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'لم يتم العثور على أي كاميرا متصلة بالجهاز.';
      } else if (err.message) {
        msg = err.message;
      }
      setCameraError(msg);
    } finally {
      setIsCameraStarting(false);
    }
  }, []);

  // Start camera when entering the camera tab (desktop only)
  useEffect(() => {
    if (!isMobile && open && activeTab === 'camera' && !cameraStream && !cameraError) {
      void startCamera();
    }
  }, [isMobile, open, activeTab, cameraStream, cameraError, startCamera]);

  // Capture Snapshot from Camera
  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const vw = video.videoWidth || 640;
    const vh = video.videoHeight || 480;

    const canvas = document.createElement('canvas');
    canvas.width = vw;
    canvas.height = vh;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, vw, vh);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

    stopCamera();
    onClose();
    onImageSelected(dataUrl);
  };

  // ── Scanner Agent Checker & Trigger ─────────────────────────────────────────
  const initScannerAgent = useCallback(async () => {
    setScannerPhase('checking');
    setScannerError('');

    try {
      let healthRes: Response;
      try {
        healthRes = await fetch(`${agentUrl}/health`, { cache: 'no-store' });
      } catch {
        setScannerPhase('agent_missing');
        return;
      }

      if (!healthRes.ok) {
        setScannerPhase('agent_missing');
        return;
      }

      const scannersRes = await fetch(`${agentUrl}/scanners`, { cache: 'no-store' });
      if (!scannersRes.ok) {
        const body = await scannersRes.json().catch(() => ({}));
        throw new Error(body.detail || 'تعذر تحميل قائمة الماسحات');
      }

      const body = await scannersRes.json();
      const list: Scanner[] = body.scanners || [];
      setScanners(list);

      if (list.length === 0) {
        setScannerPhase('no_scanners');
      } else {
        setSelectedScannerId(list[0].id);
        setScannerPhase('ready');
      }
    } catch (err: any) {
      setScannerPhase('agent_missing');
      setScannerError(err.message || 'تعذر الاتصال ببرنامج الماسح');
    }
  }, [agentUrl]);

  useEffect(() => {
    if (open && activeTab === 'scanner') {
      void initScannerAgent();
    }
  }, [open, activeTab, initScannerAgent]);

  const handleStartScan = async () => {
    if (!selectedScannerId) return;
    setScannerPhase('scanning');
    setScannerError('');

    try {
      let response: Response;
      try {
        response = await fetch(`${agentUrl}/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scanner_id: selectedScannerId }),
        });
      } catch {
        const msg = 'انقطع الاتصال ببرنامج الماسح أثناء المسح.';
        setScannerError(msg);
        toast.add({ type: 'error', title: 'خطأ في الاتصال', description: msg });
        setScannerPhase('ready');
        return;
      }

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        const msg =
          response.status === 504
            ? 'انتهت مهلة الماسح. تحقق من جاهزية الجهاز وحاول مرة أخرى.'
            : result.detail || 'فشل مسح الوثيقة';
        setScannerError(msg);
        toast.add({
          type: response.status === 504 ? 'warning' : 'error',
          title: response.status === 504 ? 'فشل المسح' : 'خطأ',
          description: msg,
        });
        setScannerPhase('ready');
        return;
      }

      const blob = base64ToBlob(result.image_base64, result.mime_type || 'image/jpeg');
      const objectUrl = URL.createObjectURL(blob);

      onClose();
      onImageSelected(objectUrl);
    } catch {
      setScannerPhase('ready');
    }
  };

  // ── File System Picker ──────────────────────────────────────────────────────
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    onClose();
    onImageSelected(objectUrl);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg w-full p-5 sm:p-6 rounded-3xl bg-white shadow-2xl border border-slate-200 text-right"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            اختر الطريقة المناسبة لإدراج صورة {entityName}. ستتمكن من اقتصاص الصورة بعد الاختيار.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as typeof activeTab)}
          className="w-full pt-1"
        >
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="upload" className="gap-1.5">
              <Upload className="w-4 h-4" />
              <span>ملف من الجهاز</span>
            </TabsTrigger>
            <TabsTrigger
              value="camera"
              className="gap-1.5"
              onClick={() => {
                if (isMobile) {
                  mobileCameraInputRef.current?.click();
                }
              }}
            >
              <Camera className="w-4 h-4" />
              <span>الكاميرا</span>
            </TabsTrigger>
            <TabsTrigger value="scanner" className="gap-1.5">
              <ScanLine className="w-4 h-4" />
              <span>ماسح ضوئي A4</span>
            </TabsTrigger>
          </TabsList>

          {/* ── TAB 1: File Upload ── */}
          <TabsContent value="upload" className="space-y-4 pt-3">
            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40 rounded-2xl cursor-pointer transition-all text-center group">
              <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-emerald-100 text-slate-500 group-hover:text-emerald-700 flex items-center justify-center shadow-xs mb-3 transition-colors">
                <FileImage className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-900 mb-1">
                اضغط لاختيار صورة من جهازك
              </span>
              <span className="text-xs text-slate-400">
                يدعم صيغ JPG، PNG، WebP، أو HEIC
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </label>
          </TabsContent>

          {/* ── TAB 2: Camera (Native capture on mobile, live webcam on PC) ── */}
          <TabsContent value="camera" keepMounted className="space-y-3 pt-3">
            {isMobile ? (
              <div className="space-y-3">
                <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 rounded-2xl cursor-pointer transition-all text-center group">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-105 transition-transform">
                    <Camera className="w-7 h-7" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-900 mb-1">
                    اضغط لتشغيل كاميرا الهاتف والتقاط الصورة
                  </span>
                  <span className="text-xs text-slate-500">
                    سيتم فتح تطبيق الكاميرا على هاتفك مباشرة
                  </span>
                  <input
                    ref={mobileCameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </label>
                <Button
                  type="button"
                  onClick={() => mobileCameraInputRef.current?.click()}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs gap-2 shadow-xs cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>تشغيل الكاميرا الآن</span>
                </Button>
              </div>
            ) : cameraError ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3 text-right">
                <div className="flex items-start gap-2.5">
                  <VideoOff className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-800 font-semibold leading-relaxed">
                    {cameraError}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void startCamera()}
                  className="w-full text-xs font-bold gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  إعادة محاولة تشغيل الكاميرا
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Viewfinder */}
                <div className="relative w-full aspect-4/3 bg-slate-950 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                  <video
                    ref={setVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />

                  {isCameraStarting && (
                    <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center gap-2 text-white text-xs">
                      <LoaderCircle className="w-6 h-6 animate-spin text-emerald-400" />
                      <span>جارٍ تشغيل الكاميرا…</span>
                    </div>
                  )}
                </div>

                {/* Capture Button */}
                <Button
                  type="button"
                  onClick={handleCaptureSnapshot}
                  disabled={isCameraStarting || !cameraStream}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs gap-2 shadow-xs cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>التقاط الصورة الآن</span>
                </Button>
              </div>
            )}
          </TabsContent>

          {/* ── TAB 3: Scanner Agent ── */}
          <TabsContent value="scanner" className="space-y-4 pt-3">
            {scannerPhase === 'checking' && (
              <div className="flex flex-col items-center justify-center gap-2.5 p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                <LoaderCircle className="w-7 h-7 animate-spin text-emerald-600" />
                <p className="text-xs font-bold text-slate-800">جارٍ التحقق من برنامج الماسح الضوئي…</p>
                <p className="text-[11px] text-slate-400">فحص الاتصال بجهاز Windows المحلي</p>
              </div>
            )}

            {scannerPhase === 'agent_missing' && (
              <MissingScannerAgentNotice
                type="missing_agent"
                onRetry={initScannerAgent}
              />
            )}

            {scannerPhase === 'no_scanners' && (
              <MissingScannerAgentNotice
                type="no_scanners"
                onRetry={initScannerAgent}
              />
            )}

            {scannerPhase === 'ready' && (
              <div className="space-y-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                <div className="space-y-1.5 text-right">
                  <label htmlFor="scanner-device-select" className="text-xs font-bold text-slate-800">
                    الماسح الضوئي المتصل:
                  </label>
                  <Select
                    value={selectedScannerId}
                    onValueChange={(val) => setSelectedScannerId(val)}
                    dir="rtl"
                  >
                    <SelectTrigger id="scanner-device-select" className="w-full bg-white text-right text-xs">
                      <SelectValue placeholder="اختر ماسحاً ضوئياً" />
                    </SelectTrigger>
                    <SelectContent className="text-right">
                      {scanners.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  ضع الوثيقة أو ورقة الهوية في الماسح الضوئي ثم اضغط الزر أدناه لمسحها ونقلها إلى أداة الاقتصاص.
                </p>

                <Button
                  type="button"
                  onClick={handleStartScan}
                  disabled={!selectedScannerId}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs gap-2 shadow-xs cursor-pointer"
                >
                  <ScanLine className="w-4 h-4" />
                  <span>بدء المسح الضوئي للوثيقة</span>
                </Button>
              </div>
            )}

            {scannerPhase === 'scanning' && (
              <div className="flex flex-col items-center justify-center gap-3 p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                <LoaderCircle className="w-8 h-8 animate-spin text-emerald-600" />
                <p className="text-sm font-bold text-emerald-950">جارٍ مسح الوثيقة ضوئياً…</p>
                <p className="text-xs text-emerald-700">يرجى الانتظار حتى اكتمال سحب وقراءة الصفحة</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

