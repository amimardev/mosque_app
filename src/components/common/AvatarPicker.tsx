import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle2, User, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import api from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { ProfileImage } from './ProfileImage';
import { AvatarSourceDialog } from '@/components/modals/AvatarSourceDialog';
import { ImageCropperModal } from '@/components/modals/ImageCropperModal';

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
  onChange,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  // Dialog and Crop Modals
  const [isSourceDialogOpen, setIsSourceDialogOpen] = useState(false);
  const [rawImageForCrop, setRawImageForCrop] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const storageKey = `${type}-${id}`;
  const entityLabel = type === 'student' ? 'الطالب' : 'المعلم';

  // Clean up object URLs on unmount or new selection
  useEffect(() => {
    return () => {
      if (localPreview && localPreview.startsWith('blob:')) {
        URL.revokeObjectURL(localPreview);
      }
      if (rawImageForCrop && rawImageForCrop.startsWith('blob:')) {
        URL.revokeObjectURL(rawImageForCrop);
      }
    };
  }, [localPreview, rawImageForCrop]);

  // Step 1: User picks image from (File, Camera, Scanner)
  const handleSourceImageSelected = (imageSrc: string) => {
    setRawImageForCrop(imageSrc);
    setIsCropperOpen(true);
  };

  // Step 2: User finishes cropping -> upload cropped image blob
  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsCropperOpen(false);

    // 1. Immediately create local preview for instant UI feedback
    const previewUrl = URL.createObjectURL(croppedBlob);
    setLocalPreview(previewUrl);
    setUploadMessage('جاري حفظ وتثبيت الصورة...');

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('key', storageKey);
      formData.append('file', croppedBlob, `${storageKey}.jpg`);

      const res = await api.post('/api/storage/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Add cache buster timestamp to ensure all components immediately show the new photo
      const timestampedUrl = res.data.url;
      if (onChange) {
        onChange(timestampedUrl);
      }
      setUploadMessage('تم حفظ وتثبيت الصورة بنجاح');
    } catch (err: any) {
      console.error('Failed to upload profile image:', err);
      setUploadMessage('فشل رفع الصورة، يرجى المحاولة مرة أخرى');
    } finally {
      setIsUploading(false);
    }
  };

  const imageSrc = localPreview || value;

  return (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-right" dir="rtl">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <User className="w-4 h-4 text-emerald-600" />
          <span>الصورة الشخصية ({entityLabel})</span>
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
        <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-slate-200 ring-2 ring-emerald-500/40 shrink-0 shadow-xs">
          <ProfileImage
            src={imageSrc}
            alt="معاينة الصورة"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Upload / Source Controls */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={() => setIsSourceDialogOpen(true)}
              disabled={isUploading}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isUploading ? 'جاري الحفظ...' : imageSrc ? 'تغيير أو اقتصاص الصورة' : 'اختيار أو التقاط صورة'}</span>
            </Button>
          </div>

          <p className="text-[11px] text-slate-500">
            يمكنك الاختيار من الجهاز، أو التقاطها مباشرة بالكاميرا، أو سحبها من ماسح ضوئي A4 مع اقتصاص الوجه بدقة.
          </p>
        </div>
      </div>

      {/* Source Selection Modal (File, Camera, Scanner) */}
      <AvatarSourceDialog
        open={isSourceDialogOpen}
        onClose={() => setIsSourceDialogOpen(false)}
        onImageSelected={handleSourceImageSelected}
        title={`تحديد صورة ${entityLabel}`}
        entityName={entityLabel}
      />

      {/* Interactive ID Cropping Modal */}
      <ImageCropperModal
        open={isCropperOpen}
        imageSrc={rawImageForCrop}
        onClose={() => setIsCropperOpen(false)}
        onCropComplete={handleCropComplete}
        aspectRatio={3 / 4}
      />
    </div>
  );
};
