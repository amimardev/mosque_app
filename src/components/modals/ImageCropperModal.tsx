import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, X, RotateCw, ZoomIn, ZoomOut, Crop } from 'lucide-react';

interface CropBox {
  x: number; // percentage (0 to 100)
  y: number; // percentage (0 to 100)
  width: number; // percentage (0 to 100)
  height: number; // percentage (0 to 100)
}

interface ImageCropperModalProps {
  open: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob) => void;
  /** Fixed width-to-height ratio (e.g. 3/4 = 0.75 for standard portrait ID photo) */
  aspectRatio?: number;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  open,
  imageSrc,
  onClose,
  onCropComplete,
  aspectRatio = 3 / 4,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [displayedSize, setDisplayedSize] = useState<{ width: number; height: number } | null>(null);
  const [cropBox, setCropBox] = useState<CropBox>({ x: 10, y: 10, width: 80, height: 80 });
  const [isProcessing, setIsProcessing] = useState(false);

  // Interaction tracking state
  const dragRef = useRef<{
    action: 'move' | 'nw' | 'ne' | 'se' | 'sw' | null;
    startX: number;
    startY: number;
    startCrop: CropBox;
  }>({
    action: null,
    startX: 0,
    startY: 0,
    startCrop: { x: 0, y: 0, width: 0, height: 0 },
  });

  // Calculate default crop box whenever a new image loads
  const handleImageLoaded = () => {
    if (!imageRef.current) return;
    const img = imageRef.current;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    setNaturalSize({ width: nw, height: nh });

    const dw = img.clientWidth;
    const dh = img.clientHeight;
    setDisplayedSize({ width: dw, height: dh });

    // Auto-fit default algorithm:
    // Determine the image's inherent aspect ratio
    const imgAspect = nw / nh;

    let initW: number;
    let initH: number;

    if (imgAspect >= aspectRatio) {
      // Image is wider than crop aspect ratio:
      // Default to making the height take the full length (or 92% of it for margin)
      initH = 92;
      // In pixel space: width_px = height_px * aspectRatio
      // In percentage space: (initW / 100 * dw) = (initH / 100 * dh) * aspectRatio
      // Therefore: initW = initH * (dh / dw) * aspectRatio
      initW = Math.min(96, initH * (nh / nw) * aspectRatio);
    } else {
      // Image is taller than crop aspect ratio (e.g. A4 document):
      // Default to making the width take the full length (or 92% of it for margin)
      initW = 92;
      initH = Math.min(96, initW * (nw / nh) / aspectRatio);
    }

    const initX = Math.max(0, (100 - initW) / 2);
    const initY = Math.max(0, (100 - initH) / 2);

    setCropBox({
      x: initX,
      y: initY,
      width: initW,
      height: initH,
    });
  };

  // Re-measure displayed image on window resize
  useEffect(() => {
    const updateSize = () => {
      if (imageRef.current) {
        setDisplayedSize({
          width: imageRef.current.clientWidth,
          height: imageRef.current.clientHeight,
        });
      }
    };
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Pointer drag/resize logic
  const handlePointerDown = (
    e: React.PointerEvent,
    action: 'move' | 'nw' | 'ne' | 'se' | 'sw'
  ) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    dragRef.current = {
      action,
      startX: e.clientX,
      startY: e.clientY,
      startCrop: { ...cropBox },
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.action || !displayedSize) return;

    const { action, startX, startY, startCrop } = dragRef.current;
    const deltaX = ((e.clientX - startX) / displayedSize.width) * 100;
    const deltaY = ((e.clientY - startY) / displayedSize.height) * 100;

    // Convert aspect ratio into percentage ratio:
    // (width% * displayedWidth) / (height% * displayedHeight) = aspectRatio
    // width% = height% * (displayedHeight / displayedWidth) * aspectRatio
    const percentAspectFactor = (displayedSize.height / displayedSize.width) * aspectRatio;

    let next = { ...startCrop };

    if (action === 'move') {
      next.x = Math.max(0, Math.min(100 - startCrop.width, startCrop.x + deltaX));
      next.y = Math.max(0, Math.min(100 - startCrop.height, startCrop.y + deltaY));
    } else if (action === 'se') {
      // Dragging south-east corner: deltaX controls sizing
      let newW = Math.max(15, Math.min(100 - startCrop.x, startCrop.width + deltaX));
      let newH = newW / percentAspectFactor;
      if (startCrop.y + newH > 100) {
        newH = 100 - startCrop.y;
        newW = newH * percentAspectFactor;
      }
      next.width = newW;
      next.height = newH;
    } else if (action === 'sw') {
      let newW = Math.max(15, Math.min(startCrop.x + startCrop.width, startCrop.width - deltaX));
      let newH = newW / percentAspectFactor;
      if (startCrop.y + newH > 100) {
        newH = 100 - startCrop.y;
        newW = newH * percentAspectFactor;
      }
      next.x = startCrop.x + (startCrop.width - newW);
      next.width = newW;
      next.height = newH;
    } else if (action === 'ne') {
      let newW = Math.max(15, Math.min(100 - startCrop.x, startCrop.width + deltaX));
      let newH = newW / percentAspectFactor;
      if (startCrop.y + startCrop.height - newH < 0) {
        newH = startCrop.y + startCrop.height;
        newW = newH * percentAspectFactor;
      }
      next.y = startCrop.y + (startCrop.height - newH);
      next.width = newW;
      next.height = newH;
    } else if (action === 'nw') {
      let newW = Math.max(15, Math.min(startCrop.x + startCrop.width, startCrop.width - deltaX));
      let newH = newW / percentAspectFactor;
      if (startCrop.y + startCrop.height - newH < 0) {
        newH = startCrop.y + startCrop.height;
        newW = newH * percentAspectFactor;
      }
      next.x = startCrop.x + (startCrop.width - newW);
      next.y = startCrop.y + (startCrop.height - newH);
      next.width = newW;
      next.height = newH;
    }

    setCropBox(next);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragRef.current.action) {
      dragRef.current.action = null;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
    }
  };

  // Perform final crop via HTML5 Canvas
  const handleConfirmCrop = async () => {
    if (!imageRef.current || !naturalSize) return;

    try {
      setIsProcessing(true);
      const img = imageRef.current;

      const pxX = Math.round((cropBox.x / 100) * naturalSize.width);
      const pxY = Math.round((cropBox.y / 100) * naturalSize.height);
      const pxW = Math.round((cropBox.width / 100) * naturalSize.width);
      const pxH = Math.round((cropBox.height / 100) * naturalSize.height);

      // Target size for avatar output: 600 x 800 (or proportional high-res)
      const targetWidth = Math.min(800, pxW);
      const targetHeight = Math.round(targetWidth / aspectRatio);

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('فشل إنشاء سياق الرسم للقص');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        img,
        pxX,
        pxY,
        pxW,
        pxH,
        0,
        0,
        targetWidth,
        targetHeight
      );

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.92);
      });

      if (!blob) throw new Error('فشل استخراج الصورة المقصوصة');
      onCropComplete(blob);
    } catch (err) {
      console.error('Cropping error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!open || !imageSrc) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-2xl w-full p-4 sm:p-6 rounded-3xl bg-white shadow-2xl border border-slate-200"
        dir="rtl"
        showCloseButton={!isProcessing}
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle>تحديد وقص الصورة الشخصية</DialogTitle>
              <DialogDescription>
                حرّك إطار القص أو غيّر حجمه لتحديد موضع الصورة المطلوبة بدقة (بنسبة 3:4 القياسية).
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Cropping Canvas/Container */}
        <div
          ref={containerRef}
          className="relative w-full max-h-[60vh] min-h-[260px] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center select-none touch-none"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Main Raw Image */}
          <img
            ref={imageRef}
            src={imageSrc}
            alt="الصورة المراد قصها"
            onLoad={handleImageLoaded}
            crossOrigin="anonymous"
            className="max-w-full max-h-[60vh] object-contain block mx-auto pointer-events-none"
          />

          {/* Interactive Overlay & Crop Frame (Rendered only when image sizes are resolved) */}
          {displayedSize && (
            <div
              className="absolute pointer-events-none"
              style={{
                width: displayedSize.width,
                height: displayedSize.height,
              }}
            >
              {/* Darkened backdrop with SVG cutout */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ width: displayedSize.width, height: displayedSize.height }}
              >
                <defs>
                  <mask id="crop-mask">
                    <rect width="100%" height="100%" fill="white" />
                    <rect
                      x={`${cropBox.x}%`}
                      y={`${cropBox.y}%`}
                      width={`${cropBox.width}%`}
                      height={`${cropBox.height}%`}
                      rx="8"
                      fill="black"
                    />
                  </mask>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill="rgba(0, 0, 0, 0.65)"
                  mask="url(#crop-mask)"
                />
              </svg>

              {/* The Draggable / Resizable Crop Box */}
              <div
                onPointerDown={(e) => handlePointerDown(e, 'move')}
                className="absolute border-2 border-emerald-400 rounded-lg shadow-lg cursor-move pointer-events-auto transition-shadow"
                style={{
                  left: `${cropBox.x}%`,
                  top: `${cropBox.y}%`,
                  width: `${cropBox.width}%`,
                  height: `${cropBox.height}%`,
                }}
              >
                {/* Rule of thirds grid lines */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                  <div className="border-r border-b border-emerald-300/60" />
                  <div className="border-r border-b border-emerald-300/60" />
                  <div className="border-b border-emerald-300/60" />
                  <div className="border-r border-b border-emerald-300/60" />
                  <div className="border-r border-b border-emerald-300/60" />
                  <div className="border-b border-emerald-300/60" />
                  <div className="border-r border-emerald-300/60" />
                  <div className="border-r border-emerald-300/60" />
                  <div />
                </div>

                {/* Corner Resize Handles */}
                <div
                  onPointerDown={(e) => handlePointerDown(e, 'nw')}
                  className="absolute -top-2.5 -left-2.5 w-5 h-5 bg-white border-2 border-emerald-600 rounded-full cursor-nwse-resize shadow-md"
                />
                <div
                  onPointerDown={(e) => handlePointerDown(e, 'ne')}
                  className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-white border-2 border-emerald-600 rounded-full cursor-nesw-resize shadow-md"
                />
                <div
                  onPointerDown={(e) => handlePointerDown(e, 'sw')}
                  className="absolute -bottom-2.5 -left-2.5 w-5 h-5 bg-white border-2 border-emerald-600 rounded-full cursor-nesw-resize shadow-md"
                />
                <div
                  onPointerDown={(e) => handlePointerDown(e, 'se')}
                  className="absolute -bottom-2.5 -right-2.5 w-5 h-5 bg-white border-2 border-emerald-600 rounded-full cursor-nwse-resize shadow-md"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold"
          >
            <X className="w-4 h-4" />
            إلغاء
          </Button>

          <Button
            type="button"
            onClick={handleConfirmCrop}
            disabled={isProcessing}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-xs"
          >
            <Check className="w-4 h-4" />
            {isProcessing ? 'جاري القص...' : 'اعتماد وقص الصورة'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

