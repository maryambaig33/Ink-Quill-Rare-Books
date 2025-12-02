import React from 'react';
import { BookOpen, Search, Feather, Camera } from 'lucide-react';
import { AppView } from '../types';

interface NavProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const Nav: React.FC<NavProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: AppView.HOME, label: 'Sanctuary', icon: Feather },
    { id: AppView.COLLECTION, label: 'Collection', icon: BookOpen },
    { id: AppView.CURATOR, label: 'Curator', icon: Search },
    { id: AppView.APPRAISER, label: 'Appraisal', icon: Camera },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-sm border-b border-[#E5DCC5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center cursor-pointer" onClick={() => setView(AppView.HOME)}>
            <Feather className="h-8 w-8 text-[#8B5E3C] mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-[#2C2420] font-heading tracking-wide">INK & QUILL</h1>
              <p className="text-xs text-[#8B5E3C] tracking-widest uppercase font-semibold">Rare Books Est. 1924</p>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    currentView === item.id
                      ? 'text-[#8B5E3C] bg-[#F5F0E6]'
                      : 'text-[#5C4D45] hover:text-[#2C2420] hover:bg-[#F5F0E6]/50'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="md:hidden flex items-center">
             {/* Mobile menu button simplified for demo */}
             <button onClick={() => setView(AppView.CURATOR)} className="p-2 text-[#2C2420]">
                <Search className="w-6 h-6" />
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
};