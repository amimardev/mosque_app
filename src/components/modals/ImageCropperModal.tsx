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

  // Auto-zoom transform state (zoom & centering translation)
  const [transform, setTransform] = useState<{
    zoom: number;
    panX: number;
    panY: number;
    animate: boolean;
  }>({
    zoom: 1.0,
    panX: 0,
    panY: 0,
    animate: false,
  });

  // Calculate auto-zoom & centering pan to comfortably fit the crop area
  const computeAutoZoom = useCallback(
    (
      box: CropBox,
      dSize = displayedSize
    ): { zoom: number; panX: number; panY: number } => {
      if (!containerRef.current || !dSize) {
        return { zoom: 1.0, panX: 0, panY: 0 };
      }

      const container = containerRef.current;
      const contW = container.clientWidth;
      const contH = container.clientHeight;

      if (contW <= 0 || contH <= 0 || dSize.width <= 0 || dSize.height <= 0) {
        return { zoom: 1.0, panX: 0, panY: 0 };
      }

      const boxPxW = (box.width / 100) * dSize.width;
      const boxPxH = (box.height / 100) * dSize.height;

      if (boxPxW <= 0 || boxPxH <= 0) {
        return { zoom: 1.0, panX: 0, panY: 0 };
      }

      // Target viewport coverage (72% of viewport container for comfortable framing)
      const targetW = contW * 0.72;
      const targetH = contH * 0.72;

      const scaleX = targetW / boxPxW;
      const scaleY = targetH / boxPxH;
      const rawZoom = Math.min(scaleX, scaleY);

      // Clamp zoom between 1.0x (full view) and 6.0x (fine precision on small regions)
      const zoom = Math.max(1.0, Math.min(6.0, rawZoom));

      if (zoom <= 1.05) {
        return { zoom: 1.0, panX: 0, panY: 0 };
      }

      // Center of the crop box in unscaled image coordinates
      const boxCenterX = ((box.x + box.width / 2) / 100) * dSize.width;
      const boxCenterY = ((box.y + box.height / 2) / 100) * dSize.height;

      // Center of the unscaled image
      const imgCenterX = dSize.width / 2;
      const imgCenterY = dSize.height / 2;

      // Displacement from image center
      const deltaX = boxCenterX - imgCenterX;
      const deltaY = boxCenterY - imgCenterY;

      // Translate stage so crop box center matches container center
      const panX = -zoom * deltaX;
      const panY = -zoom * deltaY;

      return { zoom, panX, panY };
    },
    [displayedSize]
  );

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
    const imgAspect = nw / nh;

    let initW: number;
    let initH: number;

    if (imgAspect >= aspectRatio) {
      initH = 92;
      initW = Math.min(96, initH * (nh / nw) * aspectRatio);
    } else {
      initW = 92;
      initH = Math.min(96, (initW * (nw / nh)) / aspectRatio);
    }

    const initX = Math.max(0, (100 - initW) / 2);
    const initY = Math.max(0, (100 - initH) / 2);

    const initialBox = {
      x: initX,
      y: initY,
      width: initW,
      height: initH,
    };

    setCropBox(initialBox);

    // Initial zoom framing
    const initialTransform = computeAutoZoom(initialBox, { width: dw, height: dh });
    setTransform({ ...initialTransform, animate: false });
  };

  // Re-measure displayed image on window resize
  useEffect(() => {
    const updateSize = () => {
      if (imageRef.current) {
        const dw = imageRef.current.clientWidth;
        const dh = imageRef.current.clientHeight;
        setDisplayedSize({ width: dw, height: dh });
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

    // Disable animation immediately during interaction for instant 1:1 response
    setTransform((prev) => ({ ...prev, animate: false }));

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
    const currentZoom = transform.zoom || 1.0;

    // Compensate for active zoom scale so movement maps 1:1 underneath cursor/finger
    const deltaX = ((e.clientX - startX) / (displayedSize.width * currentZoom)) * 100;
    const deltaY = ((e.clientY - startY) / (displayedSize.height * currentZoom)) * 100;

    const percentAspectFactor = (displayedSize.height / displayedSize.width) * aspectRatio;

    let next = { ...startCrop };

    if (action === 'move') {
      next.x = Math.max(0, Math.min(100 - startCrop.width, startCrop.x + deltaX));
      next.y = Math.max(0, Math.min(100 - startCrop.height, startCrop.y + deltaY));
    } else if (action === 'se') {
      let newW = Math.max(10, Math.min(100 - startCrop.x, startCrop.width + deltaX));
      let newH = newW / percentAspectFactor;
      if (startCrop.y + newH > 100) {
        newH = 100 - startCrop.y;
        newW = newH * percentAspectFactor;
      }
      next.width = newW;
      next.height = newH;
    } else if (action === 'sw') {
      let newW = Math.max(10, Math.min(startCrop.x + startCrop.width, startCrop.width - deltaX));
      let newH = newW / percentAspectFactor;
      if (startCrop.y + newH > 100) {
        newH = 100 - startCrop.y;
        newW = newH * percentAspectFactor;
      }
      next.x = startCrop.x + (startCrop.width - newW);
      next.width = newW;
      next.height = newH;
    } else if (action === 'ne') {
      let newW = Math.max(10, Math.min(100 - startCrop.x, startCrop.width + deltaX));
      let newH = newW / percentAspectFactor;
      if (startCrop.y + startCrop.height - newH < 0) {
        newH = startCrop.y + startCrop.height;
        newW = newH * percentAspectFactor;
      }
      next.y = startCrop.y + (startCrop.height - newH);
      next.width = newW;
      next.height = newH;
    } else if (action === 'nw') {
      let newW = Math.max(10, Math.min(startCrop.x + startCrop.width, startCrop.width - deltaX));
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

      // Smoothly zoom in or de-zoom to fit the modified crop box
      const target = computeAutoZoom(cropBox);
      setTransform({
        ...target,
        animate: true,
      });
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
          className="relative w-full max-h-[60vh] min-h-[280px] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center select-none touch-none"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Floating Zoom Indicator & Control Pill */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-white/10 text-white text-xs select-none">
            <span className="font-mono text-[11px] text-emerald-400 font-bold">
              {Math.round(transform.zoom * 100)}%
            </span>
            <div className="w-px h-3.5 bg-white/20" />
            <button
              type="button"
              onClick={() => {
                if (transform.zoom > 1.05) {
                  setTransform({ zoom: 1.0, panX: 0, panY: 0, animate: true });
                } else {
                  const target = computeAutoZoom(cropBox);
                  setTransform({ ...target, animate: true });
                }
              }}
              className="hover:text-emerald-300 transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
              title={transform.zoom > 1.05 ? 'عرض الصورة كاملة (100%)' : 'تكبير تلقائي لمنطقة القص'}
            >
              {transform.zoom > 1.05 ? (
                <>
                  <ZoomOut className="w-3.5 h-3.5" />
                  <span>عرض كامل</span>
                </>
              ) : (
                <>
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>تكبير تلقائي</span>
                </>
              )}
            </button>
          </div>

          {/* Transforming Stage (Smoothly scales & centers on active crop area) */}
          <div
            className="relative flex items-center justify-center shrink-0 origin-center"
            style={{
              width: displayedSize ? displayedSize.width : 'auto',
              height: displayedSize ? displayedSize.height : 'auto',
              transform: `translate3d(${transform.panX}px, ${transform.panY}px, 0) scale(${transform.zoom})`,
              transition: transform.animate
                ? 'transform 380ms cubic-bezier(0.2, 0.8, 0.2, 1)'
                : 'none',
              willChange: 'transform',
            }}
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
                className="absolute inset-0 pointer-events-none"
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

                  {/* Corner Resize Handles with generous touch targets */}
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'nw')}
                    className="absolute -top-3 -left-3 w-6 h-6 bg-white border-2 border-emerald-600 rounded-full cursor-nwse-resize shadow-md hover:scale-110 active:scale-95 transition-transform"
                  />
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'ne')}
                    className="absolute -top-3 -right-3 w-6 h-6 bg-white border-2 border-emerald-600 rounded-full cursor-nesw-resize shadow-md hover:scale-110 active:scale-95 transition-transform"
                  />
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'sw')}
                    className="absolute -bottom-3 -left-3 w-6 h-6 bg-white border-2 border-emerald-600 rounded-full cursor-nesw-resize shadow-md hover:scale-110 active:scale-95 transition-transform"
                  />
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'se')}
                    className="absolute -bottom-3 -right-3 w-6 h-6 bg-white border-2 border-emerald-600 rounded-full cursor-nwse-resize shadow-md hover:scale-110 active:scale-95 transition-transform"
                  />
                </div>
              </div>
            )}
          </div>
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

