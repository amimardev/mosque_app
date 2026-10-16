import React from 'react';
import { AlertCircle, Download, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SCANNER_AGENT_INSTALLER_URL =
  'https://github.com/amimardev/mosque_app/releases/latest/download/ScannerAgentSetup-Rust.exe';

export const NAPS2_DOWNLOAD_URL = 'https://www.naps2.com/download';

interface MissingScannerAgentNoticeProps {
  type?: 'missing_agent' | 'no_scanners';
  onRetry?: () => void;
  className?: string;
}

export const MissingScannerAgentNotice: React.FC<MissingScannerAgentNoticeProps> = ({
  type = 'missing_agent',
  onRetry,
  className = '',
}) => {
  if (type === 'no_scanners') {
    return (
      <div
        className={`space-y-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:p-6 text-right ${className}`}
        dir="rtl"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-amber-950">
              لم يتم العثور على أي ماسح ضوئي متصل
            </h3>
            <p className="text-xs leading-6 text-amber-800">
              برنامج الماسح يعمل بنجاح، لكن لم يتعرف النظام على ماسح ضوئي متصل. يرجى التأكد من توصيل كابل الماسح وتشغيله.
            </p>
          </div>
        </div>

        {onRetry && (
          <div className="pt-2 border-t border-amber-200/60">
            <Button
              type="button"
              onClick={onRetry}
              className="gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              إعادة البحث عن الماسحات
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`space-y-4 rounded-2xl border border-rose-200 bg-rose-50/70 p-5 sm:p-6 text-right ${className}`}
      dir="rtl"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-bold text-rose-950">
            برنامج الماسح الضوئي غير متصل
          </h3>
          <p className="text-xs leading-6 text-rose-800">
            لمسح الوثائق والصور مباشرة من المتصفح، يلزم تثبيت وتشغيل برنامج الماسح على جهاز Windows المتصل بالماسح الضوئي.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-rose-200/60">
        <a
          href={SCANNER_AGENT_INSTALLER_URL}
          download
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          تنزيل برنامج الماسح (Windows)
        </a>
        <a
          href={NAPS2_DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
        >
          <ExternalLink className="h-4 w-4 text-slate-500" />
          تثبيت مشغل NAPS2
        </a>
        {onRetry && (
          <Button
            type="button"
            variant="outline"
            onClick={onRetry}
            className="border-slate-300 text-xs gap-1.5"
          >
            <RefreshCw className="h-4 w-4" />
            إعادة المحاولة
          </Button>
        )}
      </div>
    </div>
  );
};

