import { motion } from 'motion/react';
import { User, Heart, ShoppingBag, Eye, Trash2, Calendar, Award, CheckCircle2, ChevronRight, Star, AlertCircle } from 'lucide-react';
import { Lipstick, BeautyProfile, AnalysisResult } from '../types';
import { LIPSTICK_DATABASE } from '../data/lipsticks';

interface ProfileDashboardProps {
  profile: BeautyProfile | null;
  scanResult: AnalysisResult | null;
  favorites: Lipstick[];
  onRemoveFavorite: (lip: Lipstick) => void;
  cart: { lipstick: Lipstick; count: number }[];
  onUpdateCartCount: (lipId: string, count: number) => void;
  onRemoveFromCart: (lipId: string) => void;
  onTryOnShade: (lip: Lipstick) => void;
  setActiveTab: (tab: string) => void;
  imageUrl: string | null;
}

export default function ProfileDashboard({
  profile,
  scanResult,
  favorites,
  onRemoveFavorite,
  cart,
  onUpdateCartCount,
  onRemoveFromCart,
  onTryOnShade,
  setActiveTab,
  imageUrl
}: ProfileDashboardProps) {

  // Dynamic calculations
  const cartSubtotal = cart.reduce((acc, curr) => acc + (curr.lipstick.price * curr.count), 0);
  const cartItemsTotal = cart.reduce((acc, curr) => acc + curr.count, 0);

  const defaultProfile: BeautyProfile = profile || {
    skinTone: 'Not Scanning Yet',
    undertone: 'neutral',
    lipShape: 'Generic',
    contrast: 'medium',
    makeupStyle: 'Classic Elegance',
    favOccasion: 'Anytime Wear'
  };

  const handleCheckoutSimulate = () => {
    alert(`Checking out ${cartItemsTotal} items. Since these are real brand links, we have routed you to our premium affiliate coupons!\n\nSubtotal: $${cartSubtotal}\nEnjoy your premium look!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 w-full pb-16 space-y-10">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#F0E6E3] pb-6 gap-4">
        <div>
          <span className="text-xs text-[#E25B45] uppercase tracking-widest font-mono font-semibold">User Vanity Dashboard</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1A1515] mt-1">My Personal Vanity</h2>
          <p className="text-xs sm:text-sm text-[#8A6E68] font-light mt-1.5">
            Your beauty passport. Monitor scanned facial analytics indices, view saved favorites, and customize your items cart checkout.
          </p>
        </div>

        {/* Scan Status Gauge */}
        {profile ? (
          <div className="bg-[#FAF0EE] border border-[#E5D5D1] rounded-full px-5 py-2 text-xs flex items-center space-x-2.5 font-sans font-medium hover:bg-[#F5EAE7] transition-colors cursor-pointer" onClick={() => setActiveTab('scanner')}>
            <Award className="w-4 h-4 text-[#9C3A3C]" />
            <span className="text-[#9C3A3C]">Beauty DNA Score: <strong>{scanResult?.overallScore || 91}%</strong></span>
          </div>
        ) : (
          <button 
            id="vanity-scan-now-btn"
            onClick={() => setActiveTab('scanner')} 
            className="px-5 py-2 bg-[#1A1515] hover:bg-[#9C3A3C] transition-colors rounded-full text-white text-xs font-semibold flex items-center space-x-1 shadow-xs cursor-pointer"
          >
            <span>Scan Face for Beauty DNA</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: BIOMETRIC PASSPORT DNA */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white p-6 rounded-[32px] border border-[#F0E6E3] shadow-xs space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1515] pb-3 border-b border-[#F5EAE7] flex items-center space-x-2">
              <User className="w-4 h-4 text-[#9C3A3C]" />
              <span>Diagnostic Beauty DNA</span>
            </h3>

            {/* Selfie Mini Scan block */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF6F5] border border-[#F0E6E3] flex items-center justify-center">
              {imageUrl ? (
                <img src={imageUrl} alt="My Face Profile Scan" className="w-full h-full object-cover" />
              ) : (
                <div className="p-6 text-center text-[#8A6E68] space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#FAF0EE] text-[#9C3A3C] flex items-center justify-center mx-auto">
                    <User className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold">Face Scan Unprocessed</p>
                  <p className="text-[10px] font-light leading-relaxed">Let Aria scan a photo to populate your diagnostic biometric face profile metrics.</p>
                </div>
              )}
            </div>

            {/* DNA Metrics breakdown list */}
            <div className="space-y-4 text-xs font-sans">
              <div className="flex justify-between items-center py-2 border-b border-[#FAF5F4]">
                <span className="text-gray-400 font-mono text-[10px]">SKIN COMPLEXION</span>
                <span className="font-semibold text-[#1A1515]">{defaultProfile.skinTone}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#FAF5F4]">
                <span className="text-gray-400 font-mono text-[10px]">UNDERTONE COLOR</span>
                <span className="font-semibold text-[#1A1515] uppercase">{defaultProfile.undertone}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#FAF5F4]">
                <span className="text-gray-400 font-mono text-[10px]">LIP GEOMETRY</span>
                <span className="font-semibold text-[#1A1515]">{defaultProfile.lipShape}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#FAF5F4]">
                <span className="text-gray-400 font-mono text-[10px]">CONTRAST THRESHOLD</span>
                <span className="font-semibold text-[#1A1515] uppercase">{defaultProfile.contrast}</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400 font-mono text-[10px]">CALIBRATION TYPE</span>
                <span className="font-semibold text-emerald-600 uppercase font-mono text-[9px]">
                  {imageUrl ? 'Biometric Face Mesh' : 'Temporary Default'}
                </span>
              </div>
            </div>

          </div>

          {/* ADVANCED AI PANEL: CELEBRITY LOOKS & SEASONAL FESTIVAL */}
          <div className="bg-[#1A1515] text-white p-6 rounded-[32px] shadow-xl space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-mono text-amber-400 font-bold">Advanced AI Insights</h3>
            
            <div className="space-y-4.5">
              
              <div className="pt-2">
                <span className="text-[10px] text-gray-400 block font-mono">CELEBRITY COMPATIBILITY MATCH</span>
                <p className="text-xs text-[#E5D5D1] mt-1">
                  Your structural parameters align strongly with <strong>Selena Gomez</strong> (Summer Warm family). Focus on peach-toned nudes like **Maybelline Loyalist** or clean pink gloss.
                </p>
              </div>

              <div className="border-t border-white/8 pt-3">
                <span className="text-[10px] text-gray-400 block font-mono">BRIDAL / GALA REVELRY PRESET</span>
                <p className="text-xs text-[#E5D5D1] mt-1">
                  For upcoming festival styles, layer **Charlotte Tilbury Walk of No Shame** rose-berry lipstick underneath a high specular glassy top-shimmer layer.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SAVED FAVS & SIMULATED SHOPPING BAG COUrIER */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* A. SAVED FAVORITES (VANITY GRID) */}
          <div className="bg-white p-6 md:p-8 rounded-[32px] border border-[#F0E6E3] shadow-xs space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1515] flex items-center space-x-2 border-b border-[#F5EAE7] pb-3">
              <Heart className="w-4.5 h-4.5 text-[#9C3A3C] fill-[#9C3A3C]" />
              <span>My Favorited Shades ({favorites.length})</span>
            </h3>

            {favorites.length === 0 ? (
              <div className="text-center py-12 text-[#8A6E68] space-y-2">
                <Heart className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-xs font-semibold">Vanity Collection Empty</p>
                <p className="text-[10px] font-zinc-400 max-w-xs mx-auto">Click "Quick Try" or look through the Boutique list to save gorgeous colors here!</p>
                <button
                  id="dashboard-boutique-cta"
                  onClick={() => setActiveTab('products')}
                  className="px-4 py-1.5 bg-[#FAF0EE] hover:bg-[#9C3A3C] hover:text-white text-[#9C3A3C] rounded-full text-xs font-semibold cursor-pointer transition-colors mt-2"
                >
                  Browse Boutique
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favorites.map((fav) => (
                  <div key={fav.id} className="p-4 bg-[#FAF6F5] border border-[#F0E6E3] hover:border-[#D5C2BE] rounded-2xl flex items-center justify-between gap-4 transition-all">
                    
                    <div className="flex items-center space-x-3 truncate">
                      <div className="w-8 h-8 rounded-full border border-gray-100 flex-shrink-0" style={{ backgroundColor: fav.color }} />
                      <div className="truncate">
                        <span className="text-[9px] uppercase font-bold text-[#806B66] tracking-wider leading-none block">{fav.brand}</span>
                        <h4 className="font-bold text-xs text-[#1A1515] mt-0.5 truncate">{fav.name.split('-')[1] || fav.name}</h4>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        id={`fav-tryon-${fav.id}`}
                        onClick={() => onTryOnShade(fav)}
                        className="p-2 rounded-full text-[#5C4A47] hover:text-[#9C3A3C] hover:bg-white transition-all cursor-pointer"
                        title="Load in Tryon"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        id={`fav-remove-${fav.id}`}
                        onClick={() => onRemoveFavorite(fav)}
                        className="p-2 rounded-full text-[#8A6E68] hover:text-[#D11C29] hover:bg-white transition-all cursor-pointer"
                        title="Remove Favorite"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* B. BOUTIQUE CART / CHECKOUT SIMULATOR */}
          <div className="bg-white p-6 md:p-8 rounded-[32px] border border-[#F0E6E3] shadow-xs space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1515] flex items-center space-x-2 border-b border-[#F5EAE7] pb-3">
              <ShoppingBag className="w-4.5 h-4.5 text-[#E25B45]" />
              <span>Boutique Shopping Bag ({cartItemsTotal} items)</span>
            </h3>

            {cart.length === 0 ? (
              <div className="text-center py-12 text-[#8A6E68] space-y-2">
                <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-xs font-semibold">Shopping Bag Empty</p>
                <p className="text-[10px] font-zinc-400">Discover your perfect matches and add them to carry home.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.lipstick.id} className="py-3 border-b border-[#FAF6F5] flex items-center justify-between gap-4">
                      
                      <div className="flex items-center space-x-3 truncate">
                        <div className="w-6 h-6 rounded-full border border-gray-100 flex-shrink-0" style={{ backgroundColor: item.lipstick.color }} />
                        <div className="truncate">
                          <h4 className="font-bold text-xs text-[#1A1515] leading-none">{item.lipstick.brand}</h4>
                          <span className="text-[10px] text-[#806B66] block mt-1 truncate">{item.lipstick.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 shrink-0">
                        {/* Selector Controls */}
                        <div className="flex items-center border border-[#E5D5D1] rounded-lg overflow-hidden bg-[#FAF6F5] text-xs font-semibold">
                          <button
                            id={`cart-minus-${item.lipstick.id}`}
                            onClick={() => onUpdateCartCount(item.lipstick.id, item.count - 1)}
                            className="px-2 py-1 hover:bg-white text-[#5C4A47] cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-[#1A1515]">{item.count}</span>
                          <button
                            id={`cart-plus-${item.lipstick.id}`}
                            onClick={() => onUpdateCartCount(item.lipstick.id, item.count + 1)}
                            className="px-2 py-1 hover:bg-white text-[#5C4A47] cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-serif italic font-semibold text-xs leading-none text-[#1A1515]">${item.lipstick.price * item.count}</span>

                        <button
                          id={`cart-trash-${item.lipstick.id}`}
                          onClick={() => onRemoveFromCart(item.lipstick.id)}
                          className="p-1.5 rounded-full text-[#8A6E68] hover:text-[#D11C29] hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

                {/* SUBTOTAL CALCULATOR */}
                <div className="bg-[#FAF6F5] p-5 rounded-2xl border border-[#F0E6E3] text-xs space-y-3">
                  <div className="flex justify-between items-center text-[#5C4A47]">
                    <span>Subtotal Products</span>
                    <span className="font-medium">${cartSubtotal}</span>
                  </div>

                  <div className="flex justify-between items-center text-[#5C4A47]">
                    <span>Shipping Courier Fee</span>
                    <span className="text-emerald-600 uppercase font-mono text-[10px] font-bold">Complimentary Free</span>
                  </div>

                  <div className="flex justify-between items-center text-sm font-bold border-t border-[#E5D5D1] pt-3 text-[#1A1515]">
                    <span>Grand Total</span>
                    <span className="font-serif italic text-base">${cartSubtotal}</span>
                  </div>

                  <button
                    id="cart-checkout-btn"
                    onClick={handleCheckoutSimulate}
                    className="w-full py-3 bg-[#1A1515] hover:bg-[#9C3A3C] transition-colors text-white font-semibold rounded-xl text-center cursor-pointer shadow-xs"
                  >
                    Checkout Securely
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
