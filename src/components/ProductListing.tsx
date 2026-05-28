import { useState } from 'react';
import { Search, SlidersHorizontal, Heart, ShieldCheck, HelpCircle, ShoppingBag, Eye, RefreshCw, X, Check, Star } from 'lucide-react';
import { Lipstick } from '../types';
import { LIPSTICK_DATABASE } from '../data/lipsticks';

interface ProductListingProps {
  onAddToCart: (lip: Lipstick) => void;
  onAddToFavorites: (lip: Lipstick) => void;
  isSavedInFavorites: (lipId: string) => boolean;
  onTryOnShade: (lip: Lipstick) => void;
}

export default function ProductListing({
  onAddToCart,
  onAddToFavorites,
  isSavedInFavorites,
  onTryOnShade
}: ProductListingProps) {
  // Filters state
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(40);
  const [onlyVegan, setOnlyVegan] = useState<boolean>(false);
  const [onlyLongLasting, setOnlyLongLasting] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Comparative states
  const [comparisonList, setComparisonList] = useState<Lipstick[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);

  // Constants
  const brands = ['MAC', 'Rare Beauty', 'Charlotte Tilbury', 'Huda Beauty', 'Maybelline', 'Nykaa Cosmetics', 'Lakmé'];
  const finishes = ['Matte', 'Glossy', 'Satin', 'Velvet'];
  const families = ['Nude', 'Red', 'Pink', 'Berry', 'Coral', 'Plum', 'Brown'];

  const toggleBrand = (b: string) => {
    setSelectedBrands(prev => 
      prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]
    );
  };

  const toggleFinish = (f: string) => {
    setSelectedFinishes(prev => 
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  };

  const toggleFamily = (fam: string) => {
    setSelectedFamilies(prev => 
      prev.includes(fam) ? prev.filter(x => x !== fam) : [...prev, fam]
    );
  };

  const toggleComparisonProduct = (lip: Lipstick) => {
    setComparisonList(prev => {
      const exists = prev.find(x => x.id === lip.id);
      if (exists) {
        return prev.filter(x => x.id !== lip.id);
      }
      if (prev.length >= 2) {
        alert('You can compare a maximum of 2 premium shades at once. Remove one of the items to select another.');
        return prev;
      }
      return [...prev, lip];
    });
  };

  const filteredProducts = LIPSTICK_DATABASE.filter(lip => {
    // Search query match
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesName = lip.name.toLowerCase().includes(q);
      const matchesBrand = lip.brand.toLowerCase().includes(q);
      const matchesFamily = lip.shadeFamily.toLowerCase().includes(q);
      if (!matchesName && !matchesBrand && !matchesFamily) return false;
    }

    // Brands match
    if (selectedBrands.length > 0 && !selectedBrands.includes(lip.brand)) return false;

    // Finishes match
    if (selectedFinishes.length > 0 && !selectedFinishes.includes(lip.finish)) return false;

    // Shade family match
    if (selectedFamilies.length > 0 && !selectedFamilies.includes(lip.shadeFamily)) return false;

    // Max Price match
    if (lip.price > maxPrice) return false;

    // Only Vegan
    if (onlyVegan && !lip.vegan) return false;

    // Only Long-Lasting
    if (onlyLongLasting && !lip.longLasting) return false;

    return true;
  });

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedFinishes([]);
    setSelectedFamilies([]);
    setMaxPrice(40);
    setOnlyVegan(false);
    setOnlyLongLasting(false);
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 w-full pb-16">
      
      {/* BOUTIQUE TITLES */}
      <div className="text-center md:text-left space-y-2 mb-10">
        <span className="text-xs text-[#E25B45] uppercase tracking-widest font-mono font-semibold">LipShade Vault</span>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1A1515]">Cosmetics Boutique</h2>
        <p className="text-sm text-[#5E4D4A] max-w-xl font-light">
          Browse premium items from premium manufacturers. Filter based on cosmetic factors and compare multiple pigments side-by-side.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 1. FILTERS PANEL SIDEBAR (Left column) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-[#F0E6E3] space-y-6">
          <div className="flex justify-between items-center border-b border-[#F5EAE7] pb-3">
            <span className="text-sm font-bold uppercase tracking-wider text-[#1A1515] flex items-center space-x-1.5">
              <SlidersHorizontal className="w-4 h-4 text-[#9C3A3C]" />
              <span>Filters ({filteredProducts.length})</span>
            </span>
            <button 
              id="clear-filters-btn"
              onClick={clearFilters} 
              className="text-xs text-[#9C3A3C] hover:underline hover:text-[#E25B45] cursor-pointer font-medium"
            >
              Clear All
            </button>
          </div>

          {/* A. SEARCH BAR */}
          <div>
            <label className="text-xs uppercase font-mono tracking-widest text-[#8A6E68] font-bold block mb-2">Search Catalog</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A6E68] w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                id="listing-search"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brand, name..."
                className="w-full bg-[#FAF6F5] pl-10 pr-4 py-2 text-xs rounded-xl border border-[#E5D5D1] focus:outline-none focus:ring-1 focus:ring-[#9C3A3C]"
              />
            </div>
          </div>

          {/* B. BRAND CHECKBOXES */}
          <div>
            <label className="text-xs uppercase font-mono tracking-widest text-[#8A6E68] font-bold block mb-2.5">Brands</label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {brands.map((brand) => {
                const checked = selectedBrands.includes(brand);
                return (
                  <label key={brand} className="flex items-center space-x-2 text-xs text-[#5C4A47] cursor-pointer hover:font-medium select-none">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleBrand(brand)}
                      className="rounded-xs accent-[#9C3A3C]"
                    />
                    <span>{brand}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* C. SHADE FAMILY FILTER */}
          <div>
            <label className="text-xs uppercase font-mono tracking-widest text-[#8A6E68] font-bold block mb-2.5">Shade Families</label>
            <div className="flex flex-wrap gap-1.5">
              {families.map((fam) => {
                const selected = selectedFamilies.includes(fam);
                return (
                  <button
                    key={fam}
                    id={`filter-family-${fam}`}
                    onClick={() => toggleFamily(fam)}
                    className={`px-3 py-1.5 rounded-full text-[10px] uppercase font-semibold border cursor-pointer transition-all ${
                      selected 
                        ? 'bg-[#1A1515] text-white border-[#1A1515]' 
                        : 'bg-white border-[#E5D5D1] text-[#5C4A47] hover:bg-[#FAF6F5]'
                    }`}
                  >
                    {fam}
                  </button>
                );
              })}
            </div>
          </div>

          {/* D. FINISH SELECTION */}
          <div>
            <label className="text-xs uppercase font-mono tracking-widest text-[#8A6E68] font-bold block mb-2.5">Texture Finishes</label>
            <div className="grid grid-cols-2 gap-1.5">
              {finishes.map((f) => {
                const selected = selectedFinishes.includes(f);
                return (
                  <button
                    key={f}
                    id={`filter-finish-${f}`}
                    onClick={() => toggleFinish(f)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center uppercase border cursor-pointer transition-all ${
                      selected 
                        ? 'bg-[#E25B45]/15 border-[#E25B45] text-[#E25B45]' 
                        : 'bg-white border-[#E5D5D1] text-[#5C4A47] hover:bg-[#FAF6F5]'
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          {/* E. MAXIMUM BUDGET PRICE */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs uppercase font-mono tracking-widest text-[#8A6E68] font-bold">Max Budget Price</label>
              <span className="text-xs font-semibold font-serif text-[#1A1515]">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="8"
              max="40"
              step="1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-[#9C3A3C] appearance-none h-1 bg-[#FAF0EE] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-[#A38A85] font-mono uppercase mt-1">
              <span>$8</span>
              <span>$40</span>
            </div>
          </div>

          {/* F. FORMULA SPECS (TOGGLES) */}
          <div className="pt-2 border-t border-[#F5EAE7] space-y-2">
            <label className="flex items-center space-x-2 text-xs text-[#5C4A47] cursor-pointer hover:font-medium select-none">
              <input
                type="checkbox"
                checked={onlyVegan}
                onChange={(e) => setOnlyVegan(e.target.checked)}
                className="rounded-xs accent-[#9C3A3C]"
              />
              <span>Only 100% Vegan Formulas</span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-[#5C4A47] cursor-pointer hover:font-medium select-none">
              <input
                type="checkbox"
                checked={onlyLongLasting}
                onChange={(e) => setOnlyLongLasting(e.target.checked)}
                className="rounded-xs accent-[#9C3A3C]"
              />
              <span>Long-Lasting (12h+ Wear)</span>
            </label>
          </div>

        </div>

        {/* 2. PRODUCT LISTING GRID (Right columns) */}
        <div className="lg:col-span-9 space-y-6">
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#F0E6E3] rounded-[32px] space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF0EE] text-[#9C3A3C] flex items-center justify-center mx-auto">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">No Shades Match Selected Filters</h3>
              <p className="text-xs text-[#8A6E68] max-w-sm mx-auto leading-relaxed">
                Try widening your price limit or clearing a few brand properties to find compatible lipstick listings.
              </p>
              <button
                id="reset-filter-grid-cta"
                onClick={clearFilters}
                className="px-5 py-2.5 bg-[#1A1515] hover:bg-[#9C3A3C] text-white rounded-full text-xs font-semibold cursor-pointer"
              >
                Reset Filter Parameters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((lip) => {
                const favorited = isSavedInFavorites(lip.id);
                const isCompared = comparisonList.some(x => x.id === lip.id);

                return (
                  <div 
                    key={lip.id} 
                    className="bg-white border border-[#F0E6E3] hover:border-[#D5C2BE] hover:shadow-lg rounded-3xl p-5 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Interactive Visual Banner */}
                      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF6F5] flex items-center justify-center p-8 mb-4">
                        
                        {/* Swatch Blob */}
                        <div 
                          className="w-14 h-14 rounded-full group-hover:scale-125 transition-transform duration-500 shadow-sm border-2 border-white relative cursor-pointer"
                          style={{ backgroundColor: lip.color }}
                          onClick={() => onTryOnShade(lip)}
                          title="Click to load in tryon mirror"
                        >
                          <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse pointer-events-none" />
                        </div>

                        {/* Top corner actions */}
                        <div className="absolute top-3 left-3 flex flex-col space-y-1">
                          {lip.vegan && (
                            <span className="bg-emerald-500/10 text-emerald-700 text-[8px] font-mono uppercase tracking-widest font-bold border border-emerald-500/20 px-2 py-0.5 rounded-sm">
                              Vegan
                            </span>
                          )}
                          {lip.longLasting && (
                            <span className="bg-[#E25B45]/10 text-[#E25B45] text-[8px] font-mono uppercase tracking-widest font-bold border border-[#E25B45]/20 px-2 py-0.5 rounded-sm">
                              Longwear
                            </span>
                          )}
                        </div>

                        <button
                          id={`like-btn-vault-${lip.id}`}
                          onClick={() => onAddToFavorites(lip)}
                          className={`absolute top-3 right-3 p-2 rounded-full cursor-pointer transition-colors ${
                            favorited 
                              ? 'bg-[#E25B45]/15 text-[#E25B45]' 
                              : 'bg-white text-[#8A6E68] hover:text-[#E25B45]'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
                        </button>

                        {/* Comparative Selector toggle */}
                        <button
                          id={`compare-toggle-btn-${lip.id}`}
                          onClick={() => toggleComparisonProduct(lip)}
                          className={`absolute bottom-3 left-3 text-[9px] uppercase tracking-wider font-semibold py-1.5 px-3 rounded-full flex items-center space-x-1.5 cursor-pointer shadow-3xs transition-all ${
                            isCompared 
                              ? 'bg-amber-400 text-black border border-amber-400 font-bold' 
                              : 'bg-white/80 backdrop-blur-3xs border border-[#F0E6E3] text-[#5C4A47] hover:bg-white'
                          }`}
                        >
                          {isCompared ? <Check className="w-2.5 h-2.5" /> : null}
                          <span>{isCompared ? 'Comparing' : '+ Compare'}</span>
                        </button>

                      </div>

                      {/* Info details */}
                      <div className="flex justify-between items-start mb-1.5">
                        <div>
                          <span className="text-[10px] text-[#806B66] uppercase tracking-wider font-bold leading-none block">{lip.brand}</span>
                          <h4 className="font-bold text-base text-[#1A1515] mt-0.5 line-clamp-1">{lip.name}</h4>
                        </div>
                        <span className="font-serif italic font-bold text-lg text-[#1A1515]">${lip.price}</span>
                      </div>

                      <p className="text-xs text-[#5E4D4A] font-light leading-relaxed mb-4 line-clamp-2">
                        {lip.description}
                      </p>
                    </div>

                    {/* Bottom Actions */}
                    <div>
                      <div className="flex items-center space-x-2 text-xs text-[#8A6E68] font-mono mb-4">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(lip.rating) ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                        <span className="font-semibold text-[#1A1515]">{lip.rating}</span>
                        <span>({lip.reviewsCount})</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 border-t border-[#F5EAE7] pt-4">
                        <button
                          id={`listing-tryon-btn-${lip.id}`}
                          onClick={() => onTryOnShade(lip)}
                          className="py-2.5 bg-[#FAF0EE] text-[#9C3A3C] hover:bg-[#9C3A3C] hover:text-white rounded-full text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Try-On</span>
                        </button>

                        <button
                          id={`listing-cart-btn-${lip.id}`}
                          onClick={() => onAddToCart(lip)}
                          className="py-2.5 bg-[#1A1515] hover:bg-[#E25B45] text-white rounded-full text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add Bag</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* COMPARE HUD BAR / DRAWER (Always floating at bottom if item present) */}
      {comparisonList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#1A1515] text-white px-6 py-4 rounded-[28px] shadow-2xl flex items-center justify-between gap-6 w-[90%] max-w-xl transition-all">
          <div className="flex items-center space-x-3.5 truncate">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">Comparison Drawer</span>
            <div className="flex -space-x-1 min-w-[70px]">
              {comparisonList.map((c) => (
                <div 
                  key={c.id} 
                  className="w-7 h-7 rounded-full border border-white flex-shrink-0 animate-pulse"
                  style={{ backgroundColor: c.color }}
                  title={`${c.brand}: ${c.name}`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-[#E5D5D1] truncate">{comparisonList.length === 1 ? 'Select 1 more shade to compare' : 'Shades selected ready to compare!'}</span>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {comparisonList.length === 2 && (
              <button
                id="compare-trigger-modal-btn"
                onClick={() => setIsComparisonOpen(true)}
                className="px-5 py-2 bg-[#E25B45] hover:bg-[#9C3A3C] text-black hover:text-white rounded-full text-xs font-semibold transition-colors cursor-pointer"
              >
                Analyze Differences
              </button>
            )}
            <button
              id="compare-cancel-all-btn"
              onClick={() => setComparisonList([])}
              className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SIDE-BY-SIDE ANALYTICS IN-DEPTH DIALOG POPUP */}
      {isComparisonOpen && comparisonList.length === 2 && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-2xs">
          <div className="bg-[#FAF6F5] w-full max-w-2xl rounded-3xl overflow-hidden border border-[#D5C2BE] shadow-2xl flex flex-col max-h-[85vh]">
            
            <div className="p-5 bg-gradient-to-r from-[#9C3A3C] to-[#E25B45] text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#E5D5D1]">Cosmetic comparison grid</span>
                <h3 className="font-serif font-bold text-xl leading-none mt-1">Shade Suitability Comparison</h3>
              </div>
              <button 
                id="close-compare-modal-btn"
                onClick={() => setIsComparisonOpen(false)} 
                className="p-1.5 rounded-full bg-white/12 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                {comparisonList.map((item, idx) => (
                  <div key={item.id} className="bg-white p-4 rounded-2xl border border-[#F0E6E3] space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full border border-gray-100" style={{ backgroundColor: item.color }} />
                      <div>
                        <span className="text-[9px] uppercase font-bold text-[#806B66] tracking-wider leading-none block">{item.brand}</span>
                        <h4 className="font-bold text-sm text-[#1A1515] mt-0.5">{item.name.split('-')[1] || item.name}</h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F5EAE7] text-[10px]">
                      <div>
                        <span className="text-gray-400 block font-mono">FINISH</span>
                        <span className="font-semibold text-[#1A1515]">{item.finish}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-mono">PRICE</span>
                        <span className="font-semibold text-[#1A1515]">${item.price}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-mono">VEGAN</span>
                        <span className="font-semibold text-emerald-600">{item.vegan ? 'Yes' : 'No'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-mono">LONGWEAR</span>
                        <span className="font-semibold text-[#1A1515]">{item.longLasting ? '12 Hours' : '6 Hours'}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#5C4A47] italic font-light font-editorial leading-relaxed">
                      "{item.description}"
                    </p>

                    <div className="pt-2">
                      <button
                        id={`compare-select-tryon-${item.id}`}
                        onClick={() => {
                          onTryOnShade(item);
                          setIsComparisonOpen(false);
                        }}
                        className="w-full py-1.5 bg-[#FAF0EE] hover:bg-[#9C3A3C] hover:text-white text-[#9C3A3C] transition-colors rounded-full text-center font-semibold cursor-pointer text-[10px]"
                      >
                        Apply this shade now
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* HARMONY SUMMARY */}
              <div className="bg-white p-4 rounded-2xl border border-[#F0E6E3] space-y-2 text-center">
                <h4 className="font-mono text-[9px] uppercase tracking-wider text-[#8A6E68] font-bold">Biometric recommendation synopsis</h4>
                <p className="text-[11px] text-[#5C4A47] leading-relaxed max-w-md mx-auto font-light">
                  <strong>{comparisonList[0].name.split('-')[1] || comparisonList[0].name}</strong> belongs to the <strong>{comparisonList[0].shadeFamily} family ({comparisonList[0].finish})</strong> which is highly suitable for evening looks. In contrast, <strong>{comparisonList[1].name.split('-')[1] || comparisonList[1].name} ({comparisonList[1].finish})</strong> focuses on <strong>{comparisonList[1].shadeFamily} pigments</strong>, creating an ideal subtle everyday nude.
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
