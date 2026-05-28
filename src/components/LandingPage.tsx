import { Camera, Eye, ArrowRight, ShieldCheck, Heart, Sparkles, Star, Users, Flame, Award } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';
import { LIPSTICK_DATABASE } from '../data/lipsticks';

interface LandingPageProps {
  setActiveTab: (tab: string) => void;
  onSelectQuickShade: (colorHex: string) => void;
}

export default function LandingPage({ setActiveTab, onSelectQuickShade }: LandingPageProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  // Get some trending shades
  const trendingLipsticks = LIPSTICK_DATABASE.slice(0, 3);

  const handleSliderMove = (e: React.MouseEvent | React.TouchEvent) => {
    const container = document.getElementById('before-after-container');
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
    setSliderPosition(percentage);
  };

  return (
    <div className="flex flex-col space-y-16 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden px-4 pt-10 md:pt-16 md:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Text */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-white border border-[#E5D5D1] px-3.5 py-1.5 rounded-full shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#E25B45]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9C3A3C]">
                World\'s Smartest Beauty-Tech Scanner
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#1A1515] leading-[1.1] tracking-tight">
              Discover your perfect <br />
              <span className="relative">
                <span className="bg-gradient-to-r from-[#9C3A3C] via-[#E25B45] to-[#E25B45] bg-clip-text text-transparent italic">
                  lipstick shade
                </span>
                <span className="absolute left-0 bottom-1 w-full h-[3px] bg-[#E25B45]/20 rounded-full" />
              </span><br />
              with AI precision.
            </h1>

            <p className="text-base md:text-lg text-[#5E4D4A] font-light max-w-lg mx-auto lg:mx-0 leading-relaxed">
              No more guessing. Analyze your unique skin tone, undertones, and lip shape in seconds. Virtually try premium brands with realistic texture rendering.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                id="hero-scan-cta"
                onClick={() => setActiveTab('scanner')}
                className="w-full sm:w-auto px-8 py-4 bg-[#1A1515] hover:bg-[#9C3A3C] text-white rounded-full font-medium transition-all duration-300 flex items-center justify-center space-x-2.5 shadow-md cursor-pointer hover:scale-[1.02]"
              >
                <Camera className="w-5 h-5 text-white" />
                <span>AI Lip Scan (Free)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-tryon-cta"
                onClick={() => setActiveTab('tryon')}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#FAF0EE] text-[#1A1515] border border-[#D5C2BE] rounded-full font-medium transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-3xs"
              >
                <Eye className="w-5 h-5 text-[#9C3A3C]" />
                <span>Try-On Studio</span>
              </button>
            </div>

            {/* Social Proof */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-[#8A6E68]">
              <div className="flex -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
                  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
                  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
                ].map((url, i) => (
                  <img key={i} src={url} alt="User Face" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <div className="text-xs text-center lg:text-left font-sans">
                <div className="flex items-center justify-center lg:justify-start text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  <span className="font-bold text-[#1A1515] ml-1.5">4.9/5</span>
                </div>
                <p className="mt-0.5">Lauded by over 12,000+ beauty enthusiasts</p>
              </div>
            </div>
          </div>

          {/* Interactive Split Slider Sandbox */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative w-full max-w-[450px] aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white bg-[#EAE1DF]">
              
              <div 
                id="before-after-container"
                className="relative w-full h-full cursor-ew-resize select-none"
                onMouseMove={isDragging ? handleSliderMove : undefined}
                onTouchMove={isDragging ? handleSliderMove : undefined}
                onMouseDown={() => setIsDragging(true)}
                onTouchStart={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onTouchEnd={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
              >
                {/* BEFORE (Left) - Uncolored lipstick */}
                <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80" 
                    alt="Natural Look" 
                    className="w-full h-full object-cover pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-black/40 text-white font-mono text-[10px] tracking-widest uppercase px-2 py-1 rounded-sm backdrop-blur-sm">
                    Natural / Before
                  </div>
                </div>

                {/* AFTER (Right, colorized overlay on lips) */}
                <div 
                  className="absolute inset-y-0 right-0 overflow-hidden" 
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute inset-y-0 right-0 w-[450px] aspect-[4/5] max-w-[450px]">
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80" 
                      alt="Lipstick Try-on" 
                      className="w-full h-full object-cover pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                    {/* Simulated Highly Realist Lip Tint Overlay */}
                    <div 
                      className="absolute inset-0 mix-blend-multiply opacity-75 pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle at 50% 59%, #D11C29 11%, transparent 12%)'
                      }}
                    />
                    <div 
                      className="absolute inset-0 mix-blend-screen opacity-20 pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle at 50% 59%, #FFFFFF 5%, transparent 6%)'
                      }}
                    />
                  </div>
                  <div className="absolute top-4 right-4 bg-[#9C3A3C] text-white font-mono text-[10px] tracking-widest uppercase px-2 py-1 rounded-sm shadow-sm">
                    Try-On Live
                  </div>
                </div>

                {/* SLIDER CONTROLLER HANDLE */}
                <div 
                  className="absolute inset-y-0 w-1 bg-white cursor-ew-resize flex items-center justify-center"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-[#9C3A3C] shadow-lg flex items-center justify-between px-1 text-[#9C3A3C]">
                    <span className="text-xs font-bold font-mono">‹</span>
                    <span className="text-xs font-bold font-mono">›</span>
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              <div className="absolute bottom-6 left-6 right-6 glass-panel p-4 rounded-2xl border border-white/40 shadow-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs text-[#8A6E68] uppercase tracking-widest font-mono font-medium">Auto Recommendation</h4>
                  <p className="text-sm font-bold text-[#1A1515]">Ruby Woo — Retro Matte</p>
                </div>
                <span className="bg-emerald-500/10 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>97% Match</span>
                </span>
              </div>
            </div>
            <p className="text-xs text-[#8A6E68] mt-3 font-medium tracking-tight">Drag split slider to see LipShade AI in action</p>
          </div>
        </div>
      </section>

      {/* 2. BRAND CAROUSEL (LUXURY LABELS) */}
      <section className="bg-white/50 border-y border-[#F0E6E3] py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center space-y-4">
          <p className="text-xs text-[#8A6E68] uppercase tracking-widest font-mono font-semibold">Integrate and Try premium collections from</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60">
            {['MAC', 'Maybelline', 'Huda Beauty', 'Charlotte Tilbury', 'Rare Beauty', 'Lakmé', 'Nykaa'].map((brand, idx) => (
              <span key={idx} className="font-serif italic text-lg md:text-xl font-bold tracking-widest text-[#5E4D4A]">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. EXPERIENCE CORE BENEFITS (HOW IT WORKS) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs text-[#E25B45] uppercase tracking-widest font-medium font-mono">3-Step Magic</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1A1515]">How LipShade AI Decodes Beauty</h2>
          <p className="text-sm text-[#5E4D4A] font-light">
            We use computer vision and the Gemini API to bypass complicated undertone tests with instant skin-science modeling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Facial Shade Scan',
              description: 'Snap a live camera selfie or upload a portrait. Our locator detects lips boundaries, face mesh contrast, and skin tone lighting indices.',
              icon: Camera,
              color: '#9C3A3C',
              tab: 'scanner'
            },
            {
              step: '02',
              title: 'Diagnostic Engine',
              description: 'Gemini analyzes your face contrast and tone to diagnose if the lip shader is Warm, Cool, or Neutral, explaining the exact science behind the match.',
              icon: Sparkles,
              color: '#E25B45',
              tab: 'scanner'
            },
            {
              step: '03',
              title: 'Virtual Fitting & Shop',
              description: 'Instantly experiment with premium brand lists, alter opacity/textures (glossy, matte, velvet) and buy with direct affiliate discount coupons.',
              icon: Eye,
              color: '#D89E92',
              tab: 'tryon'
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="bg-white hover:bg-[#FAF6F5] border border-[#F0E6E3] hover:border-[#D5C2BE] p-8 rounded-3xl transition-all duration-300 shadow-3xs flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-linear-to-r from-[#9C3A3C] to-[#E25B45]" style={{ backgroundColor: item.color }}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-serif font-bold text-4xl text-[#E5D5D1] group-hover:text-[#9C3A3C] transition-colors">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-[#1A1515] mb-2">{item.title}</h3>
                <p className="text-sm text-[#5E4D4A] font-light leading-relaxed mb-6">{item.description}</p>
              </div>
              <button 
                id={`howitworks-cta-${item.step}`}
                onClick={() => setActiveTab(item.tab)}
                className="text-xs font-semibold text-[#9C3A3C] hover:text-[#E25B45] flex items-center space-x-1 bg-none border-none cursor-pointer p-0 group-hover:translate-x-1 transition-all"
              >
                <span>Launch {item.title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. REAL-TIME RENDERER PREVIEW & INTUITION */}
      <section className="bg-white border-y border-[#F0E6E3] py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-6">
            <span className="text-xs text-[#E25B45] uppercase tracking-widest font-semibold font-mono">Boutique & Try-on Compatibility</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1A1515] leading-tight">
              A virtual lip counter right inside your browser.
            </h2>
            <p className="text-sm md:text-base text-[#5E4D4A] font-light leading-relaxed">
              We recreate cosmetic properties physically: Matte light-absorption, Glossy glass reflections, Satin soft moisture, and Velvet high-density pigment. Feel what it feels like before making a trip to the counter.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              {[
                { title: 'Matte Finish', desc: 'Dense non-reflective modern coverage', value: 'Matte' },
                { title: 'Glossy Finish', desc: 'Moist volumetric wet glass shine', value: 'Glossy' },
                { title: 'Velvet Soft', desc: 'Premium velvet smudge blurs', value: 'Velvet' },
                { title: 'Satin Classic', desc: 'Balanced luxurious cream texture', value: 'Satin' }
              ].map((style, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-[#E25B45]/15 flex items-center justify-center text-[#E25B45] shrink-0 mt-0.5">
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#1A1515]">{style.title}</h4>
                    <p className="text-xs text-[#8A6E68] font-light mt-0.5">{style.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                id="preview-find-perfect-cta"
                onClick={() => setActiveTab('tryon')}
                className="px-6 py-3 bg-[#1A1515] text-white hover:bg-[#9C3A3C] transition-colors rounded-full text-sm font-medium flex items-center space-x-2 cursor-pointer"
              >
                <span>Launch Try-On Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-[#FAF6F5] p-6 rounded-[40px] border border-[#F0E6E3] relative shadow-lg">
            <div className="bg-white rounded-[32px] p-6 space-y-6 shadow-xs border border-[#FAF0EE]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#8A6E68] tracking-widest uppercase">Suitability Analyzer Dashboard</span>
                <span className="bg-[#E25B45]/15 text-[#E25B45] text-xs font-semibold px-2.5 py-1 rounded-full">Perfect Match</span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm text-[#1A1515] font-semibold">MAC Ruby Woo</span>
                  <span className="font-serif italic font-bold text-xl text-[#9C3A3C]">97% Match Score</span>
                </div>
                <div className="w-full h-2 bg-[#E5D5D1] rounded-full overflow-hidden">
                  <div className="w-[97%] h-full bg-gradient-to-r from-[#9C3A3C] to-[#E25B45] rounded-full" />
                </div>
              </div>

              <p className="text-xs text-[#5C4A47] font-light leading-relaxed bg-[#FAF6F5] p-4 rounded-xl border border-[#F5EAE7]">
                “This gorgeous ruby red belongs to the cool-blue pigment family. It balances perfectly with deep wheatish, warm olive, or clear alabaster bases. Excellent choice to contrast high facial tone levels for formal dinner events.”
              </p>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#8A6E68]">Finish Level: <strong>Retro Matte</strong></span>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" />)}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. TRENDING SHADES CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
          <div className="text-center sm:text-left space-y-2">
            <span className="text-xs text-[#E25B45] uppercase tracking-widest font-mono font-semibold">Today\'s Hotpicks</span>
            <h2 className="text-3xl font-serif font-bold text-[#1A1515]">Trending Lipstick Shades</h2>
          </div>
          <button
            id="trending-view-all-cta"
            onClick={() => setActiveTab('products')}
            className="px-5 py-2.5 bg-white hover:bg-[#FAF0EE] border border-[#D5C2BE] text-sm font-medium text-[#c42023] rounded-full transition-all cursor-pointer flex items-center space-x-1"
          >
            <span>View 100+ Shades Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trendingLipsticks.map((lipstick) => (
            <div 
              key={lipstick.id} 
              className="bg-white border border-[#F0E6E3] hover:border-[#D5C2BE] rounded-3xl p-6 transition-all duration-300 select-none group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF6F5] flex items-center justify-center p-8 mb-4">
                  {/* Decorative Cosmetic Swatch Shape */}
                  <div 
                    className="w-16 h-16 rounded-full group-hover:scale-135 transition-transform duration-500 shadow-md border-4 border-white cursor-pointer relative"
                    style={{ backgroundColor: lipstick.color }}
                    onClick={() => onSelectQuickShade(lipstick.color)}
                    title="Click to apply shade instantly"
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse pointer-events-none" />
                  </div>
                  {/* Suitability Label */}
                  <span className="absolute top-3 right-3 bg-white border border-[#E5D5D1] text-[10px] uppercase tracking-widest font-mono text-[#9C3A3C] px-2.5 py-1 rounded-full font-bold">
                    {lipstick.finish}
                  </span>
                </div>

                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs text-[#8A6E68] font-semibold">{lipstick.brand}</span>
                    <h3 className="font-bold text-base text-[#1A1515] -mt-0.5">{lipstick.name}</h3>
                  </div>
                  <span className="font-serif italic font-bold text-lg text-[#1A1515]">${lipstick.price}</span>
                </div>

                <p className="text-xs text-[#5E4D4A] font-light leading-relaxed mb-4">
                  {lipstick.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F5EAE7] flex items-center justify-between">
                <span className="text-xs text-emerald-600 font-medium flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-current" />
                  <span>Perfect for {lipstick.bestFor} undertone</span>
                </span>
                
                <button
                  id={`quick-try-${lipstick.id}`}
                  onClick={() => {
                    onSelectQuickShade(lipstick.color);
                    setActiveTab('tryon');
                  }}
                  className="px-4 py-1.5 bg-[#FAF0EE] text-[#9C3A3C] hover:bg-[#9C3A3C] hover:text-white transition-colors rounded-full text-xs font-semibold cursor-pointer"
                >
                  Quick Try
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TRUST & BRAND VALUES */}
      <section className="bg-gradient-to-b from-white to-[#FAF6F5] py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: ShieldCheck, title: 'Safe Cosmetics', label: '100% hypoallergenic' },
              { icon: Heart, title: 'Cruelty-Free', label: 'Certified animal-safe' },
              { icon: Users, title: 'Diverse Shade Range', label: 'Over 80 skin-tone buckets' },
              { icon: Award, title: 'Startup of the Year', label: 'Cosmo Tech Award Winner' }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#FAF0EE] text-[#9C3A3C] flex items-center justify-center mx-auto mb-2 text-[#9C3A3C]">
                  <stat.icon className="w-6 h-6 text-[#9C3A3C]" />
                </div>
                <h4 className="text-base font-bold text-[#1A1515]">{stat.title}</h4>
                <p className="text-xs text-[#8A6E68]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
