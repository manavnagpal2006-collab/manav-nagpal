export interface Lipstick {
  id: string;
  name: string;
  brand: string;
  color: string; // hex
  shadeFamily: 'Nude' | 'Red' | 'Pink' | 'Berry' | 'Coral' | 'Plum' | 'Brown';
  finish: 'Matte' | 'Glossy' | 'Satin' | 'Velvet';
  price: number;
  rating: number;
  reviewsCount: number;
  vegan: boolean;
  longLasting: boolean;
  transferProof: boolean;
  affiliateUrl: string;
  description: string;
  bestFor: string; // undertone suitability
}

export interface BeautyProfile {
  skinTone: string;
  undertone: 'warm' | 'cool' | 'neutral';
  lipShape: string;
  contrast: 'high' | 'medium' | 'low';
  makeupStyle: string;
  favOccasion: string;
}

export interface AnalysisResult {
  skinTone: string;
  undertone: 'warm' | 'cool' | 'neutral' | string;
  undertoneExplanation: string;
  lipShape: string;
  lipShapeExplanation: string;
  facialSymmetryScore: number;
  contrast: 'high' | 'medium' | 'low' | string;
  overallScore: number;
  bestColors: string[];
  notRecommendedColors: string[];
  shadeExplanations: { [key: string]: string }; // Map of shade family -> why it works or not
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface FilterState {
  brand: string[];
  finish: string[];
  shadeFamily: string[];
  priceRange: [number, number];
  vegan: boolean;
  longLasting: boolean;
  transferProof: boolean;
  search: string;
}

export interface FavoriteShade {
  id: string;
  lipstickId: string;
  savedAt: string;
}

export interface TryOnFeedback {
  suitabilityScore: number;
  label: 'Perfect Match' | 'Best Nude Shade' | 'Party Look' | 'Not Recommended' | 'Too Warm for Your Undertone' | 'Too Cool for Your Undertone' | 'Harmonious Match';
  explanation: string;
  confidence: number;
}
