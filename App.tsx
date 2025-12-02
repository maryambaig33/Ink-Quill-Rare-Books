import React, { useState } from 'react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Collection } from './components/Collection';
import { Curator } from './components/Curator';
import { Appraiser } from './components/Appraiser';
import { AppView } from './types';

function App() {
  const [currentView, setView] = useState<AppView>(AppView.HOME);

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return (
          <>
            <Hero setView={setView} />
            <Collection />
            <div className="bg-[#2C2420] text-[#D4C5B0] py-16 text-center">
              <h3 className="text-2xl font-heading mb-4 text-[#E6C685]">Visit Our Physical Archives</h3>
              <p className="mb-8">128 Bibliophile Lane, Oxford</p>
              <button 
                onClick={() => setView(AppView.CURATOR)}
                className="text-white underline decoration-[#8B5E3C] decoration-2 underline-offset-4 hover:text-[#E6C685] transition-colors"
              >
                Contact Us
              </button>
            </div>
          </>
        );
      case AppView.COLLECTION:
        return <Collection />;
      case AppView.CURATOR:
        return <Curator />;
      case AppView.APPRAISER:
        return <Appraiser />;
      default:
        return <Hero setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Nav currentView={currentView} setView={setView} />
      <main className="flex-grow">
        {renderView()}
      </main>
      <footer className="bg-[#2C2420] text-[#5C4D45] py-8 border-t border-[#8B5E3C]/20">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>© 2024 Ink & Quill Rare Books. All rights reserved.</p>
          <p className="mt-2 text-xs">Powered by Gemini. Images are for demonstration.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;