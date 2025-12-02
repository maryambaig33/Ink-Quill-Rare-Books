import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AppView } from '../types';

interface HeroProps {
  setView: (view: AppView) => void;
}

export const Hero: React.FC<HeroProps> = ({ setView }) => {
  return (
    <div className="relative overflow-hidden bg-[#2C2420] text-[#FDFBF7]">
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1507842217153-e212234687ad?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#2C2420] via-[#2C2420]/90 to-transparent z-0"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="lg:w-2/3">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-[#8B5E3C]/30 bg-[#8B5E3C]/10 text-[#D4C5B0] text-sm mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2 text-[#E6C685]" />
            <span>AI-Powered Antiquarian Curation</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 leading-tight">
            Preserving History,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E6C685] to-[#B39B75]">
              One Page at a Time.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-[#D4C5B0] font-body-serif italic mb-10 max-w-2xl leading-relaxed">
            "A room without books is like a body without a soul." — Cicero. <br/>
            Explore our curated collection of rare manuscripts, first editions, and forgotten lore, enhanced by modern intelligence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setView(AppView.COLLECTION)}
              className="px-8 py-4 bg-[#E6C685] text-[#2C2420] font-semibold rounded-sm hover:bg-[#D4C5B0] transition-colors flex items-center justify-center"
            >
              Browse Collection
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button 
              onClick={() => setView(AppView.CURATOR)}
              className="px-8 py-4 border border-[#D4C5B0] text-[#D4C5B0] font-semibold rounded-sm hover:bg-[#D4C5B0]/10 transition-colors"
            >
              Ask the Curator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};