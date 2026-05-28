import { Sparkles, Camera, Eye, ShoppingBag, MessageSquare, User, Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BeautyProfile } from '../types';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  profile: BeautyProfile | null;
}

export default function Navigation({ activeTab, setActiveTab, cartCount, profile }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'landing', label: 'Home', icon: Sparkles },
    { id: 'scanner', label: 'AI Scanner', icon: Camera },
    { id: 'tryon', label: 'Virtual Try-On', icon: Eye },
    { id: 'products', label: 'Boutique', icon: ShoppingBag },
    { id: 'chatbot', label: 'Beauty Chat', icon: MessageSquare },
    { id: 'dashboard', label: 'My Vanity', icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-[#F0E6E3] px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <div 
          onClick={() => setActiveTab('landing')} 
          className="flex items-center space-x-2 cursor-pointer group"
          id="nav-logo"
        >
          <div className="relative w-9 h-9 bg-linear-to-tr from-[#9C3A3C] via-[#E25B45] to-[#D89E92] rounded-full flex items-center justify-center text-white shadow-xs group-hover:rotate-12 transition-transform duration-300">
            <span className="font-serif font-bold text-lg tracking-tighter">L</span>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full border border-[#9C3A3C] animate-ping" />
          </div>
          <div>
            <span className="font-serif font-bold text-xl tracking-wider text-[#1A1515] uppercase">
              LipShade <span className="font-sans font-light text-[#9C3A3C] text-sm align-super">AI</span>
            </span>
            <p className="text-[9px] text-[#A38A85] tracking-widest uppercase font-sans font-medium -mt-1 hidden sm:block">Beauty Science Tech</p>
          </div>
        </div>

        {/* DESKTOP NAVIGATION TABS */}
        <div className="hidden md:flex items-center space-x-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-link-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-1.5 cursor-pointer ${
                  isActive 
                    ? 'text-white' 
                    : 'text-[#5C4A47] hover:text-[#9C3A3C] hover:bg-[#FAF0EE]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavBG"
                    className="absolute inset-0 bg-gradient-to-r from-[#9C3A3C] to-[#E25B45] rounded-full shadow-xs -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8A6E68]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* ACTION ICONS: FAVS, CART, PROFILE */}
        <div className="flex items-center space-x-3">
          <button 
            id="nav-favs-btn"
            onClick={() => setActiveTab('dashboard')} 
            className="p-2 rounded-full text-[#5C4A47] hover:text-[#9C3A3C] hover:bg-[#FAF0EE] transition-all relative cursor-pointer"
            title="My Favorites"
          >
            <Heart className="w-5 h-5" />
          </button>

          <button 
            id="nav-cart-btn"
            onClick={() => setActiveTab('products')} 
            className="p-2 rounded-full text-[#5C4A47] hover:text-[#9C3A3C] hover:bg-[#FAF0EE] transition-all relative cursor-pointer"
            title="Shed Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#E25B45] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-bounce shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center space-x-2 pl-2 border-l border-[#F0E6E3] cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-[#E5D5D1] border border-[#D5C2BE] flex items-center justify-center text-[#5C4A47] overflow-hidden group-hover:border-[#9C3A3C]">
              {profile ? (
                <div className="bg-[#9C3A3C] text-white w-full h-full flex items-center justify-center text-xs font-bold font-serif uppercase">
                  {profile.undertone[0]}
                </div>
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div className="hidden lg:block text-left">
              <span className="text-xs font-semibold text-[#1A1515] block leading-none">
                {profile ? `${profile.skinTone}` : 'Guest Profile'}
              </span>
              <span className="text-[10px] text-[#806B66] block mt-0.5 uppercase tracking-widest font-mono">
                {profile ? `${profile.undertone} undertone` : 'DNA Unsaved'}
              </span>
            </div>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-md text-[#5C4A47] hover:bg-[#FAF0EE] md:hidden cursor-pointer"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE EXPANDED MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white/95 mt-2 rounded-2xl flex flex-col space-y-1 p-2 border border-[#F0E6E3]"
          >
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-tab-link-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-3 cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#9C3A3C] to-[#E25B45] text-white' 
                      : 'text-[#5C4A47] hover:bg-[#FAF0EE]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8A6E68]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
