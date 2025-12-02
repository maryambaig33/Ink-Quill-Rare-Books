import React, { useState } from 'react';
import { Book } from '../types';
import { Play, Pause, BookOpen, Loader } from 'lucide-react';
import { generateBookNarration } from '../services/geminiService';
import { decodeBase64, decodeAudioData } from '../services/audioUtils';

// Mock Data
const SAMPLE_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    year: '1813',
    price: '$12,500',
    description: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
    condition: 'Fine',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: '1925',
    price: '$8,200',
    description: 'In my younger and more vulnerable years my father gave me some advice that I’ve been turning over in my mind ever since.',
    condition: 'Very Good',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    title: 'Moby Dick',
    author: 'Herman Melville',
    year: '1851',
    price: '$15,000',
    description: 'Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.',
    condition: 'Fair',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    year: '1890',
    price: '$6,800',
    description: 'The studio was filled with the rich odour of roses, and when the light summer wind stirred amidst the trees of the garden, there came through the open door the heavy scent of the lilac, or the more delicate perfume of the pink-flowering thorn.',
    condition: 'Fine',
    image: 'https://images.unsplash.com/photo-1610882648335-ced8fc8fa6b6?auto=format&fit=crop&q=80&w=800'
  }
];

export const Collection: React.FC = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [currentSource, setCurrentSource] = useState<AudioBufferSourceNode | null>(null);

  const handlePlayExcerpt = async (book: Book) => {
    // Stop current playback
    if (currentSource) {
      currentSource.stop();
      setCurrentSource(null);
    }

    if (playingId === book.id) {
      setPlayingId(null);
      return;
    }

    // Initialize Audio Context on user gesture if needed
    let ctx = audioContext;
    if (!ctx) {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      setAudioContext(ctx);
    }
    if (ctx?.state === 'suspended') {
      await ctx.resume();
    }

    setLoadingId(book.id);

    try {
      const base64Audio = await generateBookNarration(book.description);
      if (base64Audio && ctx) {
        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setPlayingId(null);
        source.start();
        setCurrentSource(source);
        setPlayingId(book.id);
      }
    } catch (e) {
      console.error("Playback failed", e);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-heading text-[#2C2420] mb-4">Curated Acquisitions</h2>
        <div className="h-1 w-24 bg-[#8B5E3C] mx-auto"></div>
        <p className="mt-4 text-[#5C4D45] font-body-serif text-lg">Rare finds from the 18th and 19th centuries.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {SAMPLE_BOOKS.map((book) => (
          <div key={book.id} className="group bg-white border border-[#E5DCC5] rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative aspect-[3/4] overflow-hidden bg-[#2C2420]">
              <img 
                src={book.image} 
                alt={book.title} 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={() => handlePlayExcerpt(book)}
                  className="bg-[#FDFBF7] p-3 rounded-full shadow-lg text-[#2C2420] hover:bg-[#E6C685] transition-colors"
                  title="Listen to Excerpt"
                  disabled={loadingId === book.id}
                >
                   {loadingId === book.id ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : playingId === book.id ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                 <span className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">{book.year}</span>
                 <span className="px-2 py-0.5 bg-[#F5F0E6] text-[#5C4D45] text-xs rounded-full">{book.condition}</span>
              </div>
              <h3 className="text-xl font-heading font-bold text-[#2C2420] mb-1 line-clamp-1">{book.title}</h3>
              <p className="text-[#5C4D45] italic mb-4 text-sm">{book.author}</p>
              
              <div className="mt-4 pt-4 border-t border-[#F5F0E6] flex justify-between items-center">
                <span className="font-bold text-lg text-[#2C2420]">{book.price}</span>
                <button className="text-sm text-[#8B5E3C] hover:text-[#2C2420] font-semibold flex items-center">
                  Details <BookOpen className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
