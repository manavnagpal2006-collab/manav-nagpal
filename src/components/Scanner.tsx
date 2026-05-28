import { Camera, Upload, RefreshCw, Layers, Smile, Sparkles, Check, AlertCircle, Play } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AnalysisResult, BeautyProfile } from '../types';

interface ScannerProps {
  onScanCompleted: (result: AnalysisResult, profile: BeautyProfile, imageSrc: string) => void;
  savedImage: string | null;
  savedResult: AnalysisResult | null;
}

const SAMPLE_PHOTO_PRESETS = [
  {
    id: 'fair',
    name: 'Alabaster Fair',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    type: 'fair',
    undertone: 'Cool'
  },
  {
    id: 'wheatish',
    name: 'Warm Dusky',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    type: 'wheatish',
    undertone: 'Warm'
  },
  {
    id: 'neutral',
    name: 'Golden Olive',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    type: 'neutral',
    undertone: 'Neutral'
  }
];

export default function Scanner({ onScanCompleted, savedImage, savedResult }: ScannerProps) {
  const [mode, setMode] = useState<'upload' | 'webcam' | 'preset'>('preset');
  const [selectedPreset, setSelectedPreset] = useState(SAMPLE_PHOTO_PRESETS[1]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(SAMPLE_PHOTO_PRESETS[1].url);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState('Initializing Locator Matrix...');
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsWebcamActive(true);
      }
    } catch (err) {
      console.error('Camera Access Failed:', err);
      setCameraError('Could not gain camera frame permissions. Please upload a selfie or select one of our pre-calibrated luxury skin models.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
  };

  const captureWebcamFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset: typeof SAMPLE_PHOTO_PRESETS[0]) => {
    setSelectedPreset(preset);
    setImagePreview(preset.url);
  };

  const executeBeautyDiagnostic = async () => {
    let capturedImage = imagePreview;

    if (mode === 'webcam') {
      const frame = captureWebcamFrame();
      if (frame) {
        capturedImage = frame;
        setImagePreview(frame);
        stopCamera();
      } else if (!imagePreview) {
        setCameraError('Unable to snap photo structure. Make sure your webcam is active.');
        return;
      }
    }

    setIsScanning(true);
    setScanProgress(0);

    // Dynamic scanning status labels
    const statuses = [
      'Locating Lip Border Meshes...',
      'Isolating Facial Skin Coordinates...',
      'Correcting Lighting Lux Index...',
      'Synthesizing Saturated Pigment Histograms...',
      'Routing to Gemini Shade Engine...'
    ];

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + 4;
        if (next >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        if (next > currentStep * 20) {
          setLoadingText(statuses[currentStep % statuses.length]);
          currentStep++;
        }
        return next;
      });
    }, 120);

    try {
      const isSamplePreset = mode === 'preset';
      const response = await fetch('/api/scanner/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: capturedImage,
          isSample: isSamplePreset,
          sampleType: isSamplePreset ? selectedPreset.id : undefined
        })
      });

      const jsonResult = await response.json();
      clearInterval(progressInterval);
      setScanProgress(100);

      if (jsonResult.success) {
        const analysis: AnalysisResult = jsonResult.data;
        const profile: BeautyProfile = {
          skinTone: analysis.skinTone,
          undertone: analysis.undertone as 'warm' | 'cool' | 'neutral',
          lipShape: analysis.lipShape,
          contrast: analysis.contrast as 'high' | 'medium' | 'low',
          makeupStyle: 'Classic Sophistication',
          favOccasion: 'Anytime Wear'
        };
        
        // Wait a tiny bit for UI satisfaction
        setTimeout(() => {
          onScanCompleted(analysis, profile, capturedImage);
          setIsScanning(false);
        }, 500);
      } else {
        throw new Error(jsonResult.error || 'Server rejected lip analysis.');
      }
    } catch (err) {
      clearInterval(progressInterval);
      setIsScanning(false);
      console.error(err);
      alert('Diagnostic offline or temporary backend error. Please try again in a few seconds!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 w-full pb-10">
      
      {/* HEADER BLOC */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center space-x-1.5 bg-[#9C3A3C]/10 text-[#9C3A3C] px-3.5 py-1 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#E25B45]" />
          <span>Biometric Skin Mapping v2.0</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1A1515]">AI Lipstick Shade Scanner</h2>
        <p className="text-sm md:text-base text-[#5E4D4A] max-w-lg mx-auto font-light">
          Unlock your personal cosmetic blueprint. Let our neural engine analyze your skin tone and identify exactly which collections will elevate your presence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: SOURCE SELECTION & RENDER CANVAS */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-[#F0E6E3] shadow-xs">
            <h3 className="text-sm font-semibold text-[#8A6E68] uppercase tracking-wider mb-4">Selfie Input Mode</h3>
            
            <div className="grid grid-cols-3 gap-2 bg-[#FAF6F5] p-1.5 rounded-2xl mb-6">
              {[
                { id: 'preset', label: 'Models', icon: Smile },
                { id: 'webcam', label: 'Live Cam', icon: Camera },
                { id: 'upload', label: 'Upload', icon: Upload }
              ].map((btn) => (
                <button
                  key={btn.id}
                  id={`scanner-mode-${btn.id}`}
                  onClick={() => {
                    setMode(btn.id as any);
                    if (btn.id === 'webcam') {
                      startCamera();
                      setImagePreview('');
                    } else {
                      stopCamera();
                      if (btn.id === 'preset') {
                        setImagePreview(selectedPreset.url);
                      } else {
                        setImagePreview('');
                      }
                    }
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                    mode === btn.id 
                      ? 'bg-[#1A1515] text-white shadow-xs' 
                      : 'text-[#5C4A47] hover:bg-white/60'
                  }`}
                >
                  <btn.icon className="w-3.5 h-3.5" />
                  <span>{btn.label}</span>
                </button>
              ))}
            </div>

            {/* IF PRESET MODE */}
            {mode === 'preset' && (
              <div className="space-y-4 mb-4">
                <p className="text-xs text-[#8A6E68]">Choose one of our premium pre-calibrated skin presets to test the AI recommendation scanner instantly:</p>
                <div className="grid grid-cols-3 gap-2">
                  {SAMPLE_PHOTO_PRESETS.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        selectedPreset.id === preset.id 
                          ? 'border-[#9C3A3C] ring-2 ring-[#9C3A3C]/20 scale-[0.98]' 
                          : 'border-[#F0E6E3] opacity-75 hover:opacity-100 hover:scale-[1.02]'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1.5 text-center">
                        <span className="text-[9px] font-semibold text-white block truncate leading-none">{preset.name}</span>
                        <span className="text-[8px] text-gray-300 block font-mono mt-0.5">{preset.undertone}</span>
                      </div>
                      {selectedPreset.id === preset.id && (
                        <div className="absolute top-1 right-1 bg-[#9C3A3C] text-white p-0.5 rounded-full">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* IF WEBCAM MODE */}
            {mode === 'webcam' && (
              <div className="space-y-4 mb-4">
                {cameraError ? (
                  <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-red-700 flex items-start space-x-2.5 text-xs leading-relaxed">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{cameraError}</span>
                  </div>
                ) : (
                  <p className="text-xs text-[#8A6E68]">Align your mouth in the center of the viewport under soft, direct daylight.</p>
                )}
              </div>
            )}

            {/* IF UPLOAD MODE */}
            {mode === 'upload' && (
              <div className="mb-4">
                <div className="relative border-2 border-dashed border-[#D5C2BE] hover:border-[#9C3A3C] transition-colors rounded-2xl p-6 text-center bg-[#FAF6F5] cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-[#8A6E68] mx-auto mb-2" />
                  <span className="text-xs font-semibold text-[#1A1515] block">
                    {selectedFile ? selectedFile.name : 'Choose file or drag & drop'}
                  </span>
                  <span className="text-[10px] text-[#8A6E68] mt-1 block">PNG or JPEG up to 6 MB</span>
                </div>
              </div>
            )}

          </div>

          <button
            id="scanner-execute-btn"
            onClick={executeBeautyDiagnostic}
            disabled={isScanning || (!imagePreview && !isWebcamActive)}
            className="w-full py-4 text-white bg-linear-to-r from-[#9C3A3C] via-[#E25B45] to-[#E25B45] hover:scale-[1.01] transition-transform font-medium rounded-full flex items-center justify-center space-x-2 cursor-pointer shadow-md disabled:bg-gray-300 disabled:from-gray-300 disabled:to-gray-300 disabled:scale-100 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Generate Lip Diagnostic</span>
          </button>

        </div>

        {/* RIGHT COLUMN: RENDER SCREEN */}
        <div className="lg:col-span-6">
          <div className="relative w-full aspect-[3/4] bg-[#F0E6E3] rounded-[40px] overflow-hidden border-4 border-white shadow-lg flex items-center justify-center group bg-radial">
            
            {/* 1. ACTUAL IMAGES / VIDEO LAYERS */}
            {mode === 'webcam' && isWebcamActive ? (
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : imagePreview ? (
              <img
                src={imagePreview}
                alt="Capture Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="p-8 text-center space-y-2 text-[#8A6E68]">
                <Camera className="w-10 h-10 mx-auto opacity-50" />
                <p className="text-xs font-semibold">Ready to Snap Face Calibration</p>
                <p className="text-[10px] font-light">Select a skin category on the left sidebar context</p>
              </div>
            )}

            {/* 2. THE CHANNELS FOR CANVAS HIDDEN CAPTURE */}
            <canvas ref={canvasRef} className="hidden" />

            {/* 3. SIMULATED DIGITAL RETICLE MESH GAUGE */}
            {((mode === 'webcam' && isWebcamActive) || imagePreview) && !isScanning && (
              <div className="absolute inset-0 pointer-events-none border-[12px] border-[#FAF6F5]/10 flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                  <div className="font-mono text-[9px] text-white bg-black/40 px-2 py-0.5 rounded-sm backdrop-blur-3xs">
                    SYS.REC: {mode.toUpperCase()}
                  </div>
                  <div className="w-4 h-4 border-t-2 border-r-2 border-white/50" />
                </div>
                
                {/* Lip Alignment Guide Indicator overlay */}
                <div className="w-40 h-20 border border-dashed border-[#E25B45]/70 rounded-full mx-auto flex items-center justify-center relative">
                  <div className="w-1 h-8 bg-[#E25B45]/50" />
                  <div className="absolute top-1 text-[8px] font-mono tracking-widest text-[#E25B45] uppercase bg-[#FAF6F5]/90 px-1 py-0.5 rounded-xs leading-none">
                    ALiGN LiPS
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-white/50" />
                  <div className="font-mono text-[9px] text-[#FAF6F5] tracking-tight bg-[#9C3A3C]/40 px-2.5 py-1 rounded-full border border-white/20">
                    60fps calibrator active
                  </div>
                </div>
              </div>
            )}

            {/* 4. CHRONO ACTIVE LASER SCAN sweep animation */}
            <AnimatePresence>
              {isScanning && (
                <div id="scanning-laser-container" className="absolute inset-0 z-20 pointer-events-none bg-black/30 flex flex-col items-center justify-center">
                  
                  {/* Laser bar */}
                  <div className="absolute left-0 right-0 h-1.5 bg-linear-to-r from-transparent via-[#E25B45] to-transparent shadow-[0_0_12px_#E25B45] animate-laser" />
                  
                  {/* Digital Diagnostic details */}
                  <div className="glass-panel p-5 rounded-2xl max-w-xs text-center border border-white/30 shadow-2xl relative">
                    <p className="text-xs text-[#E25B45] font-mono uppercase tracking-widest animate-pulse font-bold">{loadingText}</p>
                    <div className="w-36 h-1.5 bg-gray-200/40 rounded-full mx-auto mt-3 overflow-hidden">
                      <div className="h-full bg-[#E25B45] transition-all" style={{ width: `${scanProgress}%` }} />
                    </div>
                    <span className="text-[10px] font-mono text-gray-300 block mt-1.5">{scanProgress}% Diagnostics Computed</span>
                  </div>
                </div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>
    </div>
  );
}
