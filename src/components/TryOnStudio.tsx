import { Info, Sparkles, Sliders, RefreshCw, Eye, Star, Heart, Share2, HelpCircle, ShoppingBag, Check } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lipstick, AnalysisResult, BeautyProfile, TryOnFeedback } from '../types';
import { LIPSTICK_DATABASE, COMPAT_MAP } from '../data/lipsticks';

const PRESET_COORD_MAP: { [key: string]: { cx: number; cy: number; rx: number; ry: number } } = {
  fair: {
    cx: 0.495,
    cy: 0.395,
    rx: 0.065,
    ry: 0.020
  },
  wheatish: {
    cx: 0.505,
    cy: 0.455,
    rx: 0.082,
    ry: 0.025
  },
  demo: {
    cx: 0.535,
    cy: 0.589,
    rx: 0.110,
    ry: 0.040
  },
  fallback: {
    cx: 0.500,
    cy: 0.520,
    rx: 0.090,
    ry: 0.030
  }
};

interface TryOnStudioProps {
  activeSelfie: string | null;
  activeProfile: BeautyProfile | null;
  quickSelectColor: string | null;
  clearQuickSelectColor: () => void;
  onAddToCart: (lip: Lipstick) => void;
  onAddToFavorites: (lip: Lipstick) => void;
  isSavedInFavorites: (lipId: string) => boolean;
}

export default function TryOnStudio({
  activeSelfie,
  activeProfile,
  quickSelectColor,
  clearQuickSelectColor,
  onAddToCart,
  onAddToFavorites,
  isSavedInFavorites
}: TryOnStudioProps) {
  // Use user scanned photo, or pre-configured premium default portrait
  const defaultModelUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
  const displayImageSrc = activeSelfie || defaultModelUrl;

  const [selectedLipstick, setSelectedLipstick] = useState<Lipstick>(LIPSTICK_DATABASE[0]);
  const [intensity, setIntensity] = useState<number>(0.8);
  const [finishToggle, setFinishToggle] = useState<'Matte' | 'Glossy' | 'Satin' | 'Velvet'>('Matte');
  const [beforeAfterSlider, setBeforeAfterSlider] = useState<number>(50);
  const [isSliding, setIsSliding] = useState<boolean>(false);
  const [showMetrics, setShowMetrics] = useState<boolean>(true);

  // Dynamic Lip Calibration state
  const [lipCx, setLipCx] = useState<number>(0.535);
  const [lipCy, setLipCy] = useState<number>(0.589);
  const [lipRx, setLipRx] = useState<number>(0.110);
  const [lipRy, setLipRy] = useState<number>(0.040);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync brand metadata when lipstick changes
  useEffect(() => {
    if (selectedLipstick) {
      setFinishToggle(selectedLipstick.finish);
    }
  }, [selectedLipstick]);

  // Synchronize precise lip coordinates based on the active image layout automatically 
  useEffect(() => {
    let presetKey = 'fallback';
    if (displayImageSrc.includes('photo-1517841905240-472988babdf9')) {
      presetKey = 'fair';
    } else if (displayImageSrc.includes('photo-1494790108377-be9c29b29330')) {
      presetKey = 'wheatish';
    } else if (displayImageSrc.includes('photo-1534528741775-53994a69daeb')) {
      presetKey = 'demo';
    }

    const coords = PRESET_COORD_MAP[presetKey];
    setLipCx(coords.cx);
    setLipCy(coords.cy);
    setLipRx(coords.rx);
    setLipRy(coords.ry);
  }, [displayImageSrc]);

  // Handle Quick selection from Landing page list
  useEffect(() => {
    if (quickSelectColor) {
      const foundMatch = LIPSTICK_DATABASE.find(
        (lip) => lip.color.toLowerCase() === quickSelectColor.toLowerCase()
      );
      if (foundMatch) {
        setSelectedLipstick(foundMatch);
      }
      clearQuickSelectColor();
    }
  }, [quickSelectColor, clearQuickSelectColor]);

  // Compute dynamic match score and diagnostic feedback based on user undertone DNA
  const calculateSuitability = (lip: Lipstick, profile: BeautyProfile | null): TryOnFeedback => {
    const defaultUndertone = profile?.undertone || 'neutral';
    const compatPercent = COMPAT_MAP[defaultUndertone]?.[lip.shadeFamily] || 85;
    
    let label: TryOnFeedback['label'] = 'Harmonious Match';
    let explanation = '';

    if (compatPercent >= 93) {
      label = defaultUndertone === 'warm' && lip.shadeFamily === 'Coral' ? 'Best Nude Shade' : 'Perfect Match';
      explanation = `Beautiful match! The glowing warmth of ${lip.brand} matches perfectly with your natural ${defaultUndertone} undertone skin frame. Suitable for outstanding day-to-day comfort.`;
    } else if (compatPercent >= 85) {
      label = lip.shadeFamily === 'Red' ? 'Party Look' : 'Harmonious Match';
      explanation = `Highly compatible. This beautiful ${lip.shadeFamily.toLowerCase()} shade offers high saturation that brightens up light contrast features flawlessly.`;
    } else if (compatPercent <= 60) {
      label = defaultUndertone === 'cool' ? 'Too Warm for Your Undertone' : 'Too Cool for Your Undertone';
      explanation = `Can look slightly clashing. This pigment carries distinct cold tones which might fight against your golden complexion. Use at 40% intensity with a neutral lip balm overlay.`;
    } else {
      label = 'Not Recommended';
      explanation = 'A shade family that can slightly pale out your natural glow. Consider choosing closer peach or berry tones for standard highlights.';
    }

    return {
      suitabilityScore: compatPercent,
      label,
      explanation,
      confidence: Math.round(compatPercent * 0.98 + 1)
    };
  };

  const currentSuitability = calculateSuitability(selectedLipstick, activeProfile);

  // Draw Lip Makeup Overlay Loop onto Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = displayImageSrc;
    img.referrerPolicy = 'no-referrer';

    img.onload = () => {
      canvas.width = img.naturalWidth || 600;
      canvas.height = img.naturalHeight || 800;
      
      const w = canvas.width;
      const h = canvas.height;

      // Draw Base Original Image
      ctx.drawImage(img, 0, 0, w, h);

      // Create a clipping section or sub-path representing Lip geometry scaled appropriately to the image length
      const cx = w * lipCx;
      const cy = h * lipCy;
      const rx = w * lipRx;  // lips horizontal radius
      const ry = h * lipRy;  // lips vertical radius

      // Calculate slider cutoff limit
      const cutoffX = w * (beforeAfterSlider / 100);

      // Save normal context state
      ctx.save();

      // Only apply lipstick overlay on the right half of the slider boundary
      ctx.beginPath();
      ctx.rect(cutoffX, 0, w - cutoffX, h);
      ctx.clip();

      // Setup Lip Color mask drawing
      ctx.beginPath();
      // Upper lip curve representation
      ctx.moveTo(cx - rx, cy);
      ctx.quadraticCurveTo(cx - rx * 0.5, cy - ry * 0.9, cx - rx * 0.2, cy - ry * 0.4);
      ctx.quadraticCurveTo(cx, cy - ry * 0.1, cx + rx * 0.2, cy - ry * 0.4);
      ctx.quadraticCurveTo(cx + rx * 0.5, cy - ry * 0.9, cx + rx, cy);
      // Lower lip curve representation
      ctx.quadraticCurveTo(cx + rx * 0.5, cy + ry * 1.3, cx, cy + ry * 1.1);
      ctx.quadraticCurveTo(cx - rx * 0.5, cy + ry * 1.3, cx - rx, cy);
      ctx.closePath();

      // Layer 1: Lipstick color matching Multiply for high-fidelity skin folds blending
      ctx.globalAlpha = intensity;
      ctx.fillStyle = selectedLipstick.color;
      
      // Prevent hard edges on the lipstick overlay with dynamic edge feathering
      const blurPx = Math.max(1, Math.min(4, w * 0.003));
      ctx.filter = `blur(${blurPx}px)`;
      ctx.globalCompositeOperation = 'multiply';
      ctx.fill();

      // Reset composite operation and filter to keep additional highlights/shine crisp
      ctx.globalCompositeOperation = 'source-over';
      ctx.filter = 'none';

      // Layer 2: Texture finish modifiers
      if (finishToggle === 'Glossy') {
        // High specular glossy water shine lines
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.45 * intensity})`;
        ctx.lineWidth = w * 0.007;
        ctx.lineCap = 'round';
        ctx.beginPath();
        // Shiny reflection on bottom lip
        ctx.arc(cx, cy + ry * 0.5, rx * 0.4, 0, Math.PI * 0.5);
        ctx.stroke();

        // Shimmer highlights
        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 * intensity})`;
        ctx.beginPath();
        ctx.arc(cx - rx * 0.4, cy + ry * 0.4, w * 0.005, 0, Math.PI * 2);
        ctx.arc(cx + rx * 0.35, cy + ry * 0.5, w * 0.003, 0, Math.PI * 2);
        ctx.fill();
      } else if (finishToggle === 'Satin') {
        // Soft focus white satin line
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * intensity})`;
        ctx.lineWidth = w * 0.015;
        ctx.shadowBlur = w * 0.01;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.moveTo(cx - rx * 0.5, cy + ry * 0.4);
        ctx.lineTo(cx + rx * 0.5, cy + ry * 0.4);
        ctx.stroke();
      } else if (finishToggle === 'Velvet') {
        // Rich high-density velvet shadowing around edges
        ctx.globalAlpha = 0.25 * intensity;
        ctx.fillStyle = '#000000';
        ctx.globalCompositeOperation = 'multiply';
        ctx.beginPath();
        // Inner depth smudge line
        ctx.moveTo(cx - rx * 0.8, cy);
        ctx.lineTo(cx + rx * 0.8, cy);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.lineWidth = w * 0.008;
        ctx.stroke();
        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';
      }

      ctx.restore();

      // If actively calibrating under manual adjustments, draw a lovely sub-pixel guide line
      if (isCalibrating) {
        ctx.save();
        ctx.strokeStyle = '#F3A412'; // Glowing custom gold guide
        ctx.lineWidth = Math.max(3, w * 0.006);
        ctx.setLineDash([8, 5]);

        ctx.beginPath();
        // Upper lip curve representation
        ctx.moveTo(cx - rx, cy);
        ctx.quadraticCurveTo(cx - rx * 0.5, cy - ry * 0.9, cx - rx * 0.2, cy - ry * 0.4);
        ctx.quadraticCurveTo(cx, cy - ry * 0.1, cx + rx * 0.2, cy - ry * 0.4);
        ctx.quadraticCurveTo(cx + rx * 0.5, cy - ry * 0.9, cx + rx, cy);
        // Lower lip curve representation
        ctx.quadraticCurveTo(cx + rx * 0.5, cy + ry * 1.3, cx, cy + ry * 1.1);
        ctx.quadraticCurveTo(cx - rx * 0.5, cy + ry * 1.3, cx - rx, cy);
        ctx.closePath();
        ctx.stroke();

        // Draw center alignment reticle crosshair
        ctx.strokeStyle = '#F3A412';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(cx - 20, cy);
        ctx.lineTo(cx + 20, cy);
        ctx.moveTo(cx, cy - 20);
        ctx.lineTo(cx, cy + 20);
        ctx.stroke();

        ctx.restore();
      }
    };
  }, [displayImageSrc, selectedLipstick, intensity, finishToggle, beforeAfterSlider, lipCx, lipCy, lipRx, lipRy, isCalibrating]);

  const handleSliderMove = (e: React.MouseEvent | React.TouchEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    
    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    const relativeX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
    setBeforeAfterSlider(percentage);
  };

  const handleShare = () => {
    alert(`Try-on configuration saved in memory! Copy this beauty setup:\n💄 Color: ${selectedLipstick.color}\n💼 Brand: ${selectedLipstick.brand} ${selectedLipstick.name}\n🌟 Harmony: ${currentSuitability.suitabilityScore}%`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 w-full pb-16">
      
      {/* SECTION BANNER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs text-[#E25B45] uppercase tracking-widest font-mono font-semibold">Virtual Try-On Suite</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1A1515] mt-1">Live Beauty Mirror</h2>
          <p className="text-xs sm:text-sm text-[#5E4D4A] font-light mt-1.5 max-w-xl">
            Mix-and-match premium brands instantly. Modify lipstick gloss, satin highlights, intense velvet textures, and check your suitability metrics calculated specifically for your face scan.
          </p>
        </div>
        
        {activeSelfie ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-xs text-emerald-800 flex items-center space-x-1.5 self-start md:self-auto font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Biometric Selfie Loaded Successfully</span>
          </div>
        ) : (
          <div className="bg-[#FAF0EE] border border-[#E5D5D1] rounded-full px-4 py-1.5 text-xs text-[#A37B75] flex items-center space-x-1.5 self-start md:self-auto font-medium">
            <Info className="w-4 h-4 text-[#9C3A3C]" />
            <span>Using Aesthetic Demo Portrait. <strong>Scan selfie or upload on scanner tab</strong></span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: ACTIVE INTERACTIVE SPLIT CANVAS */}
        <div className="lg:col-span-6 flex flex-col items-center">
          
          <div 
            ref={containerRef}
            className="relative w-full aspect-[3/4] max-w-[450px] bg-[#EAE1DF] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white cursor-ew-resize select-none"
            onMouseMove={isSliding ? handleSliderMove : undefined}
            onTouchMove={isSliding ? handleSliderMove : undefined}
            onMouseDown={() => setIsSliding(true)}
            onTouchStart={() => setIsSliding(true)}
            onMouseUp={() => setIsSliding(false)}
            onTouchEnd={() => setIsSliding(false)}
            onMouseLeave={() => setIsSliding(false)}
            id="tryon-canvas-container"
          >
            {/* Base high-res rendering Canvas */}
            <canvas ref={canvasRef} className="w-full h-full object-cover" />

            {/* Simulated Before/After HUD label helpers Overlay */}
            <div className="absolute top-4 left-4 pointer-events-none bg-black/40 text-white font-mono text-[9px] tracking-widest uppercase px-2 py-1 rounded-sm backdrop-blur-3xs">
              Natural Face
            </div>

            <div className="absolute top-4 right-4 pointer-events-none bg-[#9C3A3C] text-white font-mono text-[9px] tracking-widest uppercase px-2 py-1 rounded-sm shadow-sm">
              Try-On Applied
            </div>

            {/* Slider Divider bar line */}
            <div 
              className="absolute inset-y-0 w-0.5 bg-white pointer-events-none"
              style={{ left: `${beforeAfterSlider}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white border-2 border-[#9C3A3C] shadow-lg flex items-center justify-between px-1.5 text-[#9C3A3C]">
                <span className="text-[10px] font-bold">‹</span>
                <span className="text-[10px] font-bold">›</span>
              </div>
            </div>

            {/* Live suitability float overlay */}
            <div className="absolute bottom-5 left-5 right-5 glass-panel p-3.5 rounded-2xl border border-white/40 flex items-center justify-between">
              <div>
                <h4 className="text-[10px] text-[#806B66] uppercase tracking-widest font-mono leading-none">Diagnostic index</h4>
                <p className="text-sm font-bold text-[#1A1515] mt-1">{selectedLipstick.brand} - {selectedLipstick.shadeFamily}</p>
              </div>

              <div className="text-right">
                <span className="bg-[#9C3A3C] text-white text-xs font-bold font-serif px-2.5 py-1 rounded-full shadow-xs leading-none">
                  {currentSuitability.suitabilityScore}% Harmony
                </span>
                <span className="block text-[8px] mt-1 text-[#8A6E68] font-mono uppercase tracking-widest font-medium">Confidence: {currentSuitability.confidence}%</span>
              </div>
            </div>

          </div>

          <p className="text-xs text-[#8A6E68] font-medium tracking-tight mt-4">Drag left/right to inspect look changes</p>

        </div>

        {/* RIGHT COLUMN: CONTROLS & LIPSTICK PALETTES */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* CONTROL MODULES */}
          <div className="bg-white p-6 rounded-3xl border border-[#F0E6E3] shadow-xs space-y-6">
            
            {/* A. TEXTURE/FINISH PICKER */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-[#1A1515] uppercase tracking-wider">Lip finish modifier</span>
                <span className="text-[10px] font-mono text-[#8A6E68] uppercase font-semibold">Real-time light refraction</span>
              </div>

              <div className="grid grid-cols-4 gap-2 bg-[#FAF6F5] p-1.5 rounded-2xl">
                {['Matte', 'Glossy', 'Satin', 'Velvet'].map((f) => (
                  <button
                    key={f}
                    id={`finish-btn-${f}`}
                    onClick={() => setFinishToggle(f as any)}
                    className={`py-2 rounded-xl text-xs font-semibold uppercase text-center transition-all cursor-pointer ${
                      finishToggle === f 
                        ? 'bg-[#1A1515] text-white shadow-xs' 
                        : 'text-[#5C4A47] hover:bg-white/60'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* B. SHADE OPACITY INTENSITY */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#1A1515] uppercase tracking-wider">Formula density / saturation</span>
                <span className="text-xs font-mono font-bold text-[#9C3A3C]">{Math.round(intensity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={intensity}
                onChange={(e) => setIntensity(parseFloat(e.target.value))}
                className="w-full accent-[#9C3A3C] h-1.5 bg-[#FAF0EE] rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between items-center text-[9px] text-[#A38A85] font-mono uppercase mt-1">
                <span>Sheer Tint</span>
                <span>Rich Velvet Pigmented</span>
              </div>
            </div>

            {/* C. MANUAL LIP REALIGNMENT */}
            <div className="border-t border-[#FAF0EE] pt-4">
              <button
                id="toggle-calibration-btn"
                onClick={() => setIsCalibrating(!isCalibrating)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold leading-none cursor-pointer flex items-center justify-between transition-colors ${
                  isCalibrating 
                    ? 'bg-[#9C3A3C] text-white shadow-xs' 
                    : 'bg-[#FAF6F5] hover:bg-[#F2EAE7] text-[#1A1515] border border-[#EBE1DF]'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4" />
                  <span>Manual Lip Position Calibration</span>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-white/20">
                  {isCalibrating ? 'Active' : 'Configure'}
                </span>
              </button>

              <AnimatePresence>
                {isCalibrating && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-4 space-y-4"
                  >
                    <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl text-[11px] text-[#805015] leading-relaxed">
                      💡 <strong>Align lipstick to lips:</strong> Adjust sliders to shift the makeup perfectly. A gold-dotted calibration helper shows in real time on the face canvas.
                    </div>

                    {/* Vertical Position */}
                    <div>
                      <div className="flex justify-between text-[11px] font-medium text-[#1A1515] mb-1">
                        <span>Vertical Position (Height)</span>
                        <span className="font-mono text-gray-400">{Math.round(lipCy * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.20"
                        max="0.80"
                        step="0.002"
                        value={lipCy}
                        onChange={(e) => setLipCy(parseFloat(e.target.value))}
                        className="w-full accent-[#9C3A3C] h-1"
                      />
                    </div>

                    {/* Horizontal Position */}
                    <div>
                      <div className="flex justify-between text-[11px] font-medium text-[#1A1515] mb-1">
                        <span>Horizontal Position (Left/Right)</span>
                        <span className="font-mono text-gray-400">{Math.round(lipCx * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.35"
                        max="0.65"
                        step="0.002"
                        value={lipCx}
                        onChange={(e) => setLipCx(parseFloat(e.target.value))}
                        className="w-full accent-[#9C3A3C] h-1"
                      />
                    </div>

                    {/* Lip Width */}
                    <div>
                      <div className="flex justify-between text-[11px] font-medium text-[#1A1515] mb-1">
                        <span>Lip Width (Scale X)</span>
                        <span className="font-mono text-[#9C3A3C]">{Math.round(lipRx * 1000)}px</span>
                      </div>
                      <input
                        type="range"
                        min="0.04"
                        max="0.20"
                        step="0.002"
                        value={lipRx}
                        onChange={(e) => setLipRx(parseFloat(e.target.value))}
                        className="w-full accent-[#9C3A3C] h-1"
                      />
                    </div>

                    {/* Lip Height */}
                    <div>
                      <div className="flex justify-between text-[11px] font-medium text-[#1A1515] mb-1">
                        <span>Lip Height (Scale Y)</span>
                        <span className="font-mono text-[#9C3A3C]">{Math.round(lipRy * 1000)}px</span>
                      </div>
                      <input
                        type="range"
                        min="0.01"
                        max="0.08"
                        step="0.001"
                        value={lipRy}
                        onChange={(e) => setLipRy(parseFloat(e.target.value))}
                        className="w-full accent-[#9C3A3C] h-1"
                      />
                    </div>

                    {/* Quick Reset */}
                    <button
                      id="reset-calibration-btn"
                      onClick={() => {
                        let presetKey = 'fallback';
                        if (displayImageSrc.includes('photo-1517841905240-472988babdf9')) {
                          presetKey = 'fair';
                        } else if (displayImageSrc.includes('photo-1494790108377-be9c29b29330')) {
                          presetKey = 'wheatish';
                        } else if (displayImageSrc.includes('photo-1534528741775-53994a69daeb')) {
                          presetKey = 'demo';
                        }
                        const coords = PRESET_COORD_MAP[presetKey];
                        setLipCx(coords.cx);
                        setLipCy(coords.cy);
                        setLipRx(coords.rx);
                        setLipRy(coords.ry);
                      }}
                      className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-[#5C4A47] text-[10px] font-bold rounded-lg transition-colors cursor-pointer uppercase flex items-center justify-center space-x-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset to Preset Defaults</span>
                    </button>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* PALETTE LIST - LUXURY SELECTORS */}
          <div className="bg-white p-6 rounded-3xl border border-[#F0E6E3] shadow-xs space-y-4">
            
            <div className="flex justify-between items-center border-b border-[#F5EAE7] pb-3">
              <span className="text-xs font-bold text-[#1A1515] uppercase tracking-wider">Premium shade selector</span>
              <span className="text-xs font-mono font-medium text-[#c42023] hover:underline cursor-pointer">All Filters</span>
            </div>

            <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto pr-1">
              {LIPSTICK_DATABASE.map((lip) => {
                const isSelected = selectedLipstick.id === lip.id;
                return (
                  <button
                    key={lip.id}
                    id={`palette-lip-${lip.id}`}
                    onClick={() => setSelectedLipstick(lip)}
                    className={`relative p-2 rounded-2xl border-2 transition-all flex flex-col items-center cursor-pointer ${
                      isSelected 
                        ? 'border-[#9C3A3C] shadow-3xs scale-98 bg-[#FAF6F5]' 
                        : 'border-[#F5EAE7] hover:border-[#D5C2BE] hover:scale-102'
                    }`}
                  >
                    {/* Color Swatch Circle */}
                    <div 
                      className="w-10 h-10 rounded-full border border-white shadow-xs relative"
                      style={{ backgroundColor: lip.color }}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 bg-white/20 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white drop-shadow-sm font-bold" />
                        </div>
                      )}
                    </div>
                    {/* Lip Name Label */}
                    <span className="text-[10px] font-bold text-[#1A1515] block text-center line-clamp-1 mt-1.5 leading-none w-full">{lip.brand}</span>
                    <span className="text-[9px] text-[#806B66] block text-center truncate leading-none mt-0.5 w-full">{lip.name.split('-')[1] || lip.name}</span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* DYNAMIC METRIC FEEDBACK ACCORDION */}
          {showMetrics && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1A1515] text-white p-6 rounded-3xl shadow-xl space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Sparkles className="w-24 h-24 text-white" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#E5D5D1] uppercase tracking-widest font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Real-time Beauty Index</span>
                </span>
                
                <span className="bg-amber-400 text-black text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-sm">
                  {currentSuitability.label}
                </span>
              </div>

              <div>
                <span className="text-xs text-[#A38A85] block font-mono">Selected Shade</span>
                <h3 className="text-lg font-bold tracking-tight">{selectedLipstick.brand} — {selectedLipstick.name}</h3>
              </div>

              <p className="text-xs text-[#E5D5D1] leading-relaxed font-light">
                {currentSuitability.explanation}
              </p>

              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/8">
                <div>
                  <span className="text-[10px] text-gray-400 block font-mono">FACIAL HARMONY</span>
                  <span className="text-sm font-semibold text-white mt-1 block">{currentSuitability.suitabilityScore}% Match</span>
                </div>
                
                <div>
                  <span className="text-[10px] text-gray-400 block font-mono">SKIN COMPATIBILITY</span>
                  <span className="text-sm font-semibold text-white mt-1 block uppercase">{activeProfile?.undertone || 'neutral'} Match</span>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 block font-mono">FINISH HARMONY</span>
                  <span className="text-sm font-semibold text-white mt-1 block">{selectedLipstick.finish} Premium</span>
                </div>
              </div>

              {/* ACTION LINKS: FAV, CART, SHARE */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/8">
                <button
                  id={`tryon-favorite-btn-${selectedLipstick.id}`}
                  onClick={() => onAddToFavorites(selectedLipstick)}
                  className={`px-4 py-2.5 rounded-full text-xs font-semibold flex items-center justify-center space-x-1 shrink-0 cursor-pointer ${
                    isSavedInFavorites(selectedLipstick.id)
                      ? 'bg-[#E25B45] text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isSavedInFavorites(selectedLipstick.id) ? 'fill-current' : ''}`} />
                  <span>{isSavedInFavorites(selectedLipstick.id) ? 'Favorited' : 'Add to Vanity'}</span>
                </button>

                <button
                  id={`tryon-cart-btn-${selectedLipstick.id}`}
                  onClick={() => onAddToCart(selectedLipstick)}
                  className="w-full py-2.5 bg-[#E25B45] hover:bg-[#9C3A3C] transition-colors text-white rounded-full text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Shopping Bag</span>
                </button>

                <button
                  id="tryon-share-btn"
                  onClick={handleShare}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-semibold cursor-pointer shrink-0"
                  title="Share Try-on Output"
                >
                  <Share2 className="w-4 h-4 text-white" />
                </button>
              </div>

            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
}
