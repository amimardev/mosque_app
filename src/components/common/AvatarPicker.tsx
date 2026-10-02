import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle2, User, Loader2 } from 'lucide-react';
import api from '@/lib/apiClient';

interface AvatarPickerProps {
  id?: string;
  type?: 'student' | 'teacher';
  value?: string;
  onChange?: (url: string) => void;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  id = 'new',
  type = 'student',
  value,
  onChange
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const storageKey = `${type}-${id}`;

  // Clean up object URL on unmount or new selection
  useEffect(() => {
    return () => {
      if (localPreview && localPreview.startsWith('blob:')) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Immediately create local preview for instant UI feedback
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setUploadMessage('جاري رفع الصورة وتثبيتها...');

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('key', storageKey);
      formData.append('file', file);

      const res = await api.post('/api/storage/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Add cache buster timestamp to ensure all components immediately show the new photo
      const timestampedUrl = res.data.url;
      if (onChange) {
        onChange(timestampedUrl);
      }
      setUploadMessage('تم رفع وتثبيت الصورة بنجاح');
    } catch (err: any) {
      console.error('Failed to upload profile image:', err);
      setUploadMessage('فشل رفع الصورة، يرجى المحاولة مرة أخرى');
    } finally {
      setIsUploading(false);
    }
  };

  const fallbackAvatar = `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(storageKey)}`;
  const imageSrc = localPreview || value || fallbackAvatar;

  return (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-right" dir="rtl">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <User className="w-4 h-4 text-emerald-600" />
          <span>الصورة الشخصية ({type === 'student' ? 'الطالب' : 'المعلم'})</span>
        </label>
        
        {isUploading ? (
          <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            جاري الرفع...
          </span>
        ) : uploadMessage ? (
          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {uploadMessage}
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-4">
        {/* Avatar Image Preview */}
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 ring-2 ring-emerald-500/40 shrink-0 shadow-xs">
          <img
            src={imageSrc}
            alt="معاينة الصورة"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackAvatar;
            }}
          />
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <label className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? 'جاري الرفع...' : 'اختيار صورة من الجهاز'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          <p className="text-[11px] text-slate-500">
            تظهر المعاينة فوراً وتُحفظ الصورة مباشرة في ملف {type === 'student' ? 'الطالب' : 'المعلم'}
          </p>
        </div>
      </div>
    </div>
  );
};
