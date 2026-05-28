/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import Scanner from './components/Scanner';
import TryOnStudio from './components/TryOnStudio';
import ProductListing from './components/ProductListing';
import BeautyChatbot from './components/BeautyChatbot';
import ProfileDashboard from './components/ProfileDashboard';
import { Lipstick, BeautyProfile, AnalysisResult } from './types';

export default function App() {
  // Navigation Routing Tab State
  const [activeTab, setActiveTab] = useState<string>('landing');

  // Beauty Scan Profile Records
  const [userProfile, setUserProfile] = useState<BeautyProfile | null>(null);
  const [scanResult, setScanResult] = useState<AnalysisResult | null>(null);
  const [uploadedSelfieSrc, setUploadedSelfieSrc] = useState<string | null>(null);

  // E-commerce Cart & Favorites Collection
  const [favorites, setFavorites] = useState<Lipstick[]>([]);
  const [cart, setCart] = useState<{ lipstick: Lipstick; count: number }[]>([]);

  // Intermediate Quick Inter-Tab Color Passer state
  const [quickSelectColor, setQuickSelectColor] = useState<string | null>(null);

  // Hydrate Favorites list and Cart from LocalStorage
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('lipshade_favs');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }

      const storedCart = localStorage.getItem('lipshade_cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }

      const storedProfile = localStorage.getItem('lipshade_profile');
      const storedScanResult = localStorage.getItem('lipshade_scan_result');
      const storedSelfie = localStorage.getItem('lipshade_selfie');

      if (storedProfile) setUserProfile(JSON.parse(storedProfile));
      if (storedScanResult) setScanResult(JSON.parse(storedScanResult));
      if (storedSelfie) setUploadedSelfieSrc(storedSelfie);

    } catch (e) {
      console.error('LocalStorage hydration error:', e);
    }
  }, []);

  // Update LocalStorage on change
  const saveFavoritesToLocalStorage = (newFavorites: Lipstick[]) => {
    localStorage.setItem('lipshade_favs', JSON.stringify(newFavorites));
  };

  const saveCartToLocalStorage = (newCart: { lipstick: Lipstick; count: number }[]) => {
    localStorage.setItem('lipshade_cart', JSON.stringify(newCart));
  };

  const handleScanCompleted = (analysis: AnalysisResult, profile: BeautyProfile, imageSrc: string) => {
    setScanResult(analysis);
    setUserProfile(profile);
    setUploadedSelfieSrc(imageSrc);

    localStorage.setItem('lipshade_profile', JSON.stringify(profile));
    localStorage.setItem('lipshade_scan_result', JSON.stringify(analysis));
    localStorage.setItem('lipshade_selfie', imageSrc);

    // Jump to Virtual Try-On instantly after scanning complete!
    setActiveTab('tryon');
  };

  // Add shade to Favorites
  const handleAddToFavorites = (lip: Lipstick) => {
    setFavorites((prev) => {
      const exists = prev.find((x) => x.id === lip.id);
      let updated;
      if (exists) {
        updated = prev.filter((x) => x.id !== lip.id);
      } else {
        updated = [...prev, lip];
      }
      saveFavoritesToLocalStorage(updated);
      return updated;
    });
  };

  const isSavedInFavorites = (lipId: string): boolean => {
    return favorites.some((x) => x.id === lipId);
  };

  // Add Shade to Shopping Cart Bag
  const handleAddToCart = (lip: Lipstick) => {
    setCart((prev) => {
      const exists = prev.find((x) => x.lipstick.id === lip.id);
      let updated;
      if (exists) {
        updated = prev.map((x) =>
          x.lipstick.id === lip.id ? { ...x, count: x.count + 1 } : x
        );
      } else {
        updated = [...prev, { lipstick: lip, count: 1 }];
      }
      saveCartToLocalStorage(updated);
      return updated;
    });
  };

  const handleUpdateCartCount = (lipId: string, count: number) => {
    if (count <= 0) {
      handleRemoveFromCart(lipId);
      return;
    }
    setCart((prev) => {
      const updated = prev.map((x) =>
        x.lipstick.id === lipId ? { ...x, count } : x
      );
      saveCartToLocalStorage(updated);
      return updated;
    });
  };

  const handleRemoveFromCart = (lipId: string) => {
    setCart((prev) => {
      const updated = prev.filter((x) => x.lipstick.id !== lipId);
      saveCartToLocalStorage(updated);
      return updated;
    });
  };

  // Switch look in Mirror
  const handleTryOnShade = (lip: Lipstick) => {
    setQuickSelectColor(lip.color);
    setActiveTab('tryon');
  };

  // Render proper tab page body
  const renderTabContent = () => {
    switch (activeTab) {
      case 'landing':
        return (
          <LandingPage
            setActiveTab={setActiveTab}
            onSelectQuickShade={(colorHex) => {
              setQuickSelectColor(colorHex);
            }}
          />
        );
      case 'scanner':
        return (
          <Scanner
            onScanCompleted={handleScanCompleted}
            savedImage={uploadedSelfieSrc}
            savedResult={scanResult}
          />
        );
      case 'tryon':
        return (
          <TryOnStudio
            activeSelfie={uploadedSelfieSrc}
            activeProfile={userProfile}
            quickSelectColor={quickSelectColor}
            clearQuickSelectColor={() => setQuickSelectColor(null)}
            onAddToCart={handleAddToCart}
            onAddToFavorites={handleAddToFavorites}
            isSavedInFavorites={isSavedInFavorites}
          />
        );
      case 'products':
        return (
          <ProductListing
            onAddToCart={handleAddToCart}
            onAddToFavorites={handleAddToFavorites}
            isSavedInFavorites={isSavedInFavorites}
            onTryOnShade={handleTryOnShade}
          />
        );
      case 'chatbot':
        return <BeautyChatbot userProfile={userProfile} />;
      case 'dashboard':
        return (
          <ProfileDashboard
            profile={userProfile}
            scanResult={scanResult}
            favorites={favorites}
            onRemoveFavorite={handleAddToFavorites}
            cart={cart}
            onUpdateCartCount={handleUpdateCartCount}
            onRemoveFromCart={handleRemoveFromCart}
            onTryOnShade={handleTryOnShade}
            setActiveTab={setActiveTab}
            imageUrl={uploadedSelfieSrc}
          />
        );
      default:
        return (
          <LandingPage
            setActiveTab={setActiveTab}
            onSelectQuickShade={(colorHex) => setQuickSelectColor(colorHex)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans">
      <div className="w-full">
        {/* Prestige Navigation Menu Banner */}
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          cartCount={cart.reduce((acc, curr) => acc + curr.count, 0)}
          profile={userProfile}
        />

        {/* Global Tab Contents Router Layout container */}
        <main className="py-8 md:py-12">
          {renderTabContent()}
        </main>
      </div>

      {/* LUXURY FOOTER BRANDING */}
      <footer className="border-t border-[#F0E6E3] bg-white py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-serif text-xs font-bold font-serif">
              L
            </div>
            <span className="font-serif font-black tracking-wider text-sm uppercase text-[#1A1515]">
              LipShade AI — Beauty Startup Product
            </span>
          </div>

          <div className="flex space-x-6 text-[11px] text-[#806B66] uppercase tracking-widest font-mono">
            <a href="#how" onClick={(e) => { e.preventDefault(); setActiveTab('landing'); }} className="hover:text-[#9C3A3C]">Biometrics Science</a>
            <a href="#rules" onClick={(e) => { e.preventDefault(); setActiveTab('products'); }} className="hover:text-[#9C3A3C]">Shade Catalogs</a>
            <a href="#policy" className="hover:text-[#9C3A3C]">Safety Assurance</a>
          </div>

          <p className="text-xs text-[#A38A85]">
            © {new Date().getFullYear()} LipShade AI Inc. Inspired by Fenty, Rare Beauty, and Sephora. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
