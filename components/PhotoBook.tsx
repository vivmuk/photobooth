import React, { useCallback, useEffect, useMemo, useState } from 'react';

// Fun tips for first-time parents
const FUN_TIPS: string[] = [
  "Sleep when the baby sleeps, dance when the baby wiggles—it's the new cardio!",
  "Tag-team diaper duty like a relay race; pass the wipes baton with flair.",
  "Take more photos than you think you need; tiny toes grow faster than Wi-Fi speeds.",
  "Whisper your favorite songs into every cuddle—they'll become the family's secret soundtrack.",
  "Keep a stash of snacks for midnight feeds; sleepy parents deserve treats, too.",
  "Celebrate small wins: burp achieved? High-five and victory lap around the couch!",
  "Use silly voices for story time—babies love dramatic readings of grocery lists.",
  "Remember, laundry is infinite; joy comes from the giggles, not the folded towels.",
  "Create a tiny traditions jar and pull one out each Sunday for surprise family magic.",
  "Let friends help; a dropped-off casserole is basically a love letter in foil.",
  "Sleep when the baby sleeps - even if it's just 20 minutes! 💤",
  "You don't need to sanitize everything. A little dirt builds immunity! 🦠",
  "Trust your instincts - you know your baby better than anyone! 💝",
  "It's okay to ask for help. Superheroes have sidekicks too! 🦸",
  "Babies cry - it's their only way to communicate. You're not doing anything wrong! 😢",
  "Take lots of photos, but also be present in the moment! 📸",
  "Every baby is different. Don't compare yours to others! 🌟",
  "You will make mistakes, and that's perfectly normal! 💪",
  "Self-care isn't selfish - it's necessary for you and baby! 🛁",
  "The days are long, but the years are short. Enjoy every stage! ⏰",
];

// Cover image filename - the one with the text overlay
const COVER_IMAGE_NAME = 'Manali_Raj_Baby_Shower_1763932447250.jpg';

// List of all image filenames
const IMAGE_FILENAMES = [
  'Manali_Raj_Baby_Shower_1763302187461.jpg',
  'Manali_Raj_Baby_Shower_1763303028137.jpg',
  'Manali_Raj_Baby_Shower_1763304678465.jpg',
  'Manali_Raj_Baby_Shower_1763304976387.jpg',
  'Manali_Raj_Baby_Shower_1763305062799.jpg',
  'Manali_Raj_Baby_Shower_1763322440752.jpg',
  'Manali_Raj_Baby_Shower_1763322592706.jpg',
  'Manali_Raj_Baby_Shower_1763322719795.jpg',
  'Manali_Raj_Baby_Shower_1763322804280.jpg',
  'Manali_Raj_Baby_Shower_1763590986592.jpg',
  'Manali_Raj_Baby_Shower_1763601252001.jpg',
  'Manali_Raj_Baby_Shower_1763601441667.jpg',
  'Manali_Raj_Baby_Shower_1763605771902.jpg',
  'Manali_Raj_Baby_Shower_1763606130147.jpg',
  'Manali_Raj_Baby_Shower_1763749095474.jpg',
  'Manali_Raj_Baby_Shower_1763751326124.jpg',
  'Manali_Raj_Baby_Shower_1763755342270.jpg',
  'Manali_Raj_Baby_Shower_1763755877161.jpg',
  'Manali_Raj_Baby_Shower_1763763893426.jpg',
  'Manali_Raj_Baby_Shower_1763767461860.jpg',
  'Manali_Raj_Baby_Shower_1763767741148.jpg',
  'Manali_Raj_Baby_Shower_1763774278032.jpg',
  'Manali_Raj_Baby_Shower_1763776695614.jpg',
  'Manali_Raj_Baby_Shower_1763776900177.jpg',
  'Manali_Raj_Baby_Shower_1763853301458.jpg',
  'Manali_Raj_Baby_Shower_1763853533996.jpg',
  'Manali_Raj_Baby_Shower_1763853648813.jpg',
  'Manali_Raj_Baby_Shower_1763853775935.jpg',
  'Manali_Raj_Baby_Shower_1763854751501.jpg',
  'Manali_Raj_Baby_Shower_1763856707897.jpg',
  'Manali_Raj_Baby_Shower_1763864683519.jpg',
  'Manali_Raj_Baby_Shower_1763864706754.jpg',
  'Manali_Raj_Baby_Shower_1763900968822.jpg',
  'Manali_Raj_Baby_Shower_1763901087965.jpg',
  'Manali_Raj_Baby_Shower_1763917075509.jpg',
  'Manali_Raj_Baby_Shower_1763917412315.jpg',
  'Manali_Raj_Baby_Shower_1763917669749.jpg',
  'Manali_Raj_Baby_Shower_1763917964014.jpg',
  'Manali_Raj_Baby_Shower_1763919770119.jpg',
  'Manali_Raj_Baby_Shower_1763922596724.jpg',
  'Manali_Raj_Baby_Shower_1763922713559.jpg',
  'Manali_Raj_Baby_Shower_1763922782151.jpg',
  'Manali_Raj_Baby_Shower_1763922880288.jpg',
  'Manali_Raj_Baby_Shower_1763922937416.jpg',
  'Manali_Raj_Baby_Shower_1763922969590.jpg',
  'Manali_Raj_Baby_Shower_1763922985107.jpg',
  'Manali_Raj_Baby_Shower_1763922988025.jpg',
  'Manali_Raj_Baby_Shower_1763923009745.jpg',
  'Manali_Raj_Baby_Shower_1763923108802.jpg',
  'Manali_Raj_Baby_Shower_1763923125819.jpg',
  'Manali_Raj_Baby_Shower_1763923133212.jpg',
  'Manali_Raj_Baby_Shower_1763923140278.jpg',
  'Manali_Raj_Baby_Shower_1763923173251.jpg',
  'Manali_Raj_Baby_Shower_1763923176147.jpg',
  'Manali_Raj_Baby_Shower_1763923178504.jpg',
  'Manali_Raj_Baby_Shower_1763923234978.jpg',
  'Manali_Raj_Baby_Shower_1763923252547.jpg',
  'Manali_Raj_Baby_Shower_1763923278887.jpg',
  'Manali_Raj_Baby_Shower_1763923280150.jpg',
  'Manali_Raj_Baby_Shower_1763923317316.jpg',
  'Manali_Raj_Baby_Shower_1763923410905.jpg',
  'Manali_Raj_Baby_Shower_1763923476848.jpg',
  'Manali_Raj_Baby_Shower_1763923508653.jpg',
  'Manali_Raj_Baby_Shower_1763923575862.jpg',
  'Manali_Raj_Baby_Shower_1763923661636.jpg',
  'Manali_Raj_Baby_Shower_1763923839381.jpg',
  'Manali_Raj_Baby_Shower_1763923863943.jpg',
  'Manali_Raj_Baby_Shower_1763923868147.jpg',
  'Manali_Raj_Baby_Shower_1763923887672.jpg',
  'Manali_Raj_Baby_Shower_1763923887774.jpg',
  'Manali_Raj_Baby_Shower_1763923907956.jpg',
  'Manali_Raj_Baby_Shower_1763923926458.jpg',
  'Manali_Raj_Baby_Shower_1763924105386.jpg',
  'Manali_Raj_Baby_Shower_1763925024807.jpg',
  'Manali_Raj_Baby_Shower_1763925030442.jpg',
  'Manali_Raj_Baby_Shower_1763925044264.jpg',
  'Manali_Raj_Baby_Shower_1763925261594.jpg',
  'Manali_Raj_Baby_Shower_1763925294324.jpg',
  'Manali_Raj_Baby_Shower_1763925634085.jpg',
  'Manali_Raj_Baby_Shower_1763925743044.jpg',
  'Manali_Raj_Baby_Shower_1763925828610.jpg',
  'Manali_Raj_Baby_Shower_1763925988815.jpg',
  'Manali_Raj_Baby_Shower_1763926062491.jpg',
  'Manali_Raj_Baby_Shower_1763926075145.jpg',
  'Manali_Raj_Baby_Shower_1763926138429.jpg',
  'Manali_Raj_Baby_Shower_1763926172946.jpg',
  'Manali_Raj_Baby_Shower_1763926222794.jpg',
  'Manali_Raj_Baby_Shower_1763926298972.jpg',
  'Manali_Raj_Baby_Shower_1763926443010.jpg',
  'Manali_Raj_Baby_Shower_1763926854549.jpg',
  'Manali_Raj_Baby_Shower_1763928819188.jpg',
  'Manali_Raj_Baby_Shower_1763929593438.jpg',
  'Manali_Raj_Baby_Shower_1763929684073.jpg',
  'Manali_Raj_Baby_Shower_1763930104146.jpg',
  'Manali_Raj_Baby_Shower_1763930320254.jpg',
  'Manali_Raj_Baby_Shower_1763932447250.jpg',
  'Manali_Raj_Baby_Shower_1763932636844.jpg',
];

interface PhotoItem {
  id: string;
  name: string;
  src: string;
}

interface PhotoBookProps {
  onBack: () => void;
}

const PhotoBook: React.FC<PhotoBookProps> = ({ onBack }) => {
  const [items, setItems] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [isTurning, setIsTurning] = useState<'forward' | 'backward' | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const basePath = '/drive-download-20251123T234132Z-1-001';
        const allImages = [COVER_IMAGE_NAME, ...IMAGE_FILENAMES.filter(name => name !== COVER_IMAGE_NAME)];
        
        // Preload images to verify they exist
        const loadedItems: PhotoItem[] = [];
        
        for (const filename of allImages) {
          const src = `${basePath}/${filename}`;
          const img = new Image();
          
          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              loadedItems.push({
                id: filename,
                name: filename.replace(/^Manali_Raj_Baby_Shower_|\.jpg$/g, '').replace(/_/g, ' '),
                src: src,
              });
              resolve();
            };
            img.onerror = () => {
              // Skip images that fail to load
              console.warn(`Failed to load image: ${filename}`);
              resolve();
            };
            img.src = src;
          });
        }
        
        setItems(loadedItems);
        setPageIndex(0);
      } catch (e: any) {
        setError(e?.message || 'Something went wrong while loading the photo book.');
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  const currentItem = items[pageIndex];
  const currentTip = useMemo(() => {
    if (!items.length) return null;
    return FUN_TIPS[pageIndex % FUN_TIPS.length];
  }, [pageIndex, items.length]);

  const turnPage = useCallback(
    (direction: 'forward' | 'backward') => {
      if (!items.length) return;
      setIsTurning(direction);
      setTimeout(() => {
        setPageIndex((prev) => {
          if (direction === 'forward') {
            return prev + 1 < items.length ? prev + 1 : 0;
          }
          return prev - 1 >= 0 ? prev - 1 : items.length - 1;
        });
        setTimeout(() => setIsTurning(null), 250);
      }, 140);
    },
    [items.length],
  );

  const handleKeyNav = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        turnPage('forward');
      }
      if (event.key === 'ArrowLeft') {
        turnPage('backward');
      }
    },
    [turnPage],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyNav);
    return () => window.removeEventListener('keydown', handleKeyNav);
  }, [handleKeyNav]);

  const pageLabel = items.length ? `Page ${pageIndex + 1} of ${items.length}` : 'Loading pages…';

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-sky-900 text-white">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #8bd1ff 0, transparent 35%), radial-gradient(circle at 80% 0%, #f4c6ff 0, transparent 30%), radial-gradient(circle at 60% 80%, #7cf7d4 0, transparent 25%)' }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.06),_transparent_55%)]" />

      <div className="relative z-10 h-full flex flex-col">
        <header className="p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-full bg-white/15 border border-white/30 text-white font-semibold backdrop-blur-lg shadow-lg hover:bg-white/25 transition-colors"
            >
              ← Back to Booth
            </button>
            <div className="text-left">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-100/80">Raj & Manali</p>
              <h1 className="text-2xl md:text-3xl font-bold">Photo Book of Love</h1>
              <p className="text-sm text-sky-100/80">Baby shower memories with parenting tips on every page.</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 text-sky-100/80">
            <span className="text-lg">✨</span>
            <p className="text-sm font-medium">Use arrow keys or tap buttons to navigate</p>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 pb-6 md:px-8">
          {loading ? (
            <div className="text-center animate-pulse text-lg text-blue-100">Loading your photo book…</div>
          ) : error ? (
            <div className="bg-white/10 border border-white/20 text-red-100 px-4 py-3 rounded-2xl shadow-lg max-w-lg text-center">
              {error}
            </div>
          ) : !items.length ? (
            <div className="bg-white/10 border border-white/20 text-sky-100 px-4 py-3 rounded-2xl shadow-lg max-w-lg text-center">
              No photos found. Please check that images are in the public folder.
            </div>
          ) : (
            <div
              key={currentItem?.id || 'page'}
              className="relative w-full max-w-5xl bg-white/10 border border-white/20 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden backdrop-blur-xl transition-all duration-500"
              style={{
                transform: isTurning ? 'scale(0.99) rotate(-0.25deg)' : 'scale(1)',
                animation: isTurning === 'forward'
                  ? 'pageFlipForward 0.55s ease'
                  : isTurning === 'backward'
                  ? 'pageFlipBackward 0.55s ease'
                  : 'fadePage 0.5s ease',
              }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 45%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.02) 55%, rgba(255,255,255,0.06) 100%)' }} />
              <div className="grid md:grid-cols-2 gap-0 relative">
                <div className="p-5 md:p-8 bg-slate-950/30 border-r border-white/10">
                  <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900/60">
                    <img
                      src={currentItem.src}
                      alt={currentItem.name}
                      className="h-full w-full object-cover"
                      loading="eager"
                      decoding="async"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 text-xs px-3 py-1 rounded-full border border-white/20">
                      {pageLabel}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sky-100/80 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📖</span>
                      <span>Flip for parenting tips on every page.</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 md:p-8 bg-gradient-to-br from-sky-200/20 via-white/5 to-purple-200/10 text-slate-50 flex flex-col gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-sky-100/80">Parenting cheer</p>
                    <h2 className="text-2xl md:text-3xl font-bold mt-1">Raj & Manali, this one's for you</h2>
                  </div>
                  <div className="flex items-start gap-3 bg-white/10 rounded-2xl p-4 border border-white/15 shadow-inner">
                    <span className="text-3xl">💡</span>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-white">Tiny Tip for New Parents</p>
                      <p className="text-base text-sky-50/90 leading-relaxed">{currentTip}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm text-sky-50/90">
                    <div className="bg-white/10 rounded-xl p-3 border border-white/10 shadow-md">
                      <p className="font-semibold text-white flex items-center gap-2"><span>🎀</span> Memory Magic</p>
                      <p className="mt-1">Add a caption to this page in your hearts—how did this moment feel?</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 border border-white/10 shadow-md">
                      <p className="font-semibold text-white flex items-center gap-2"><span>🌙</span> Cozy Reminder</p>
                      <p className="mt-1">Slow blinks, soft lights, and whispered wishes make the best bedtime stories.</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sky-100/80 text-sm mt-auto">
                    <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-2 rounded-full"><span>🧸</span>Made for snuggles</span>
                    <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-2 rounded-full"><span>🍼</span>Tips change each page</span>
                    <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-2 rounded-full"><span>🚀</span>Smooth transitions</span>
                  </div>
                </div>
              </div>
              <footer className="flex flex-col md:flex-row items-center justify-between gap-3 px-5 md:px-8 py-4 bg-black/30 border-t border-white/10 backdrop-blur">
                <div className="flex items-center gap-2 text-sky-100/80 text-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                  <span>All photos are loaded from the site.</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => turnPage('backward')}
                    className="px-4 py-2 rounded-full bg-white/15 border border-white/25 text-white font-semibold hover:bg-white/25 transition-colors"
                  >
                    ← Previous Page
                  </button>
                  <div className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold text-white">
                    {pageLabel}
                  </div>
                  <button
                    onClick={() => turnPage('forward')}
                    className="px-4 py-2 rounded-full bg-sky-400/80 border border-white/40 text-slate-900 font-bold shadow-lg hover:bg-sky-300 transition-colors"
                  >
                    Next Page →
                  </button>
                </div>
              </footer>
            </div>
          )}
        </main>
      </div>

      <style>
        {`
          @keyframes fadePage {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pageFlipForward {
            0% { transform: scale(0.99) rotate(-0.25deg); }
            50% { transform: scale(0.97) rotate(0.35deg); }
            100% { transform: scale(1) rotate(0deg); }
          }
          @keyframes pageFlipBackward {
            0% { transform: scale(0.99) rotate(0.25deg); }
            50% { transform: scale(0.97) rotate(-0.35deg); }
            100% { transform: scale(1) rotate(0deg); }
          }
        `}
      </style>
    </div>
  );
};

export default PhotoBook;
