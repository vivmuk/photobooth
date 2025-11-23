import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface DriveItem {
  id: string;
  name: string;
  createdTime?: string;
}

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
];

const idToViewUrl = (id: string) => `/api/drive-image?id=${id}`;
const idToOpenUrl = (id: string) => `https://drive.google.com/file/d/${id}/view`;

interface PhotoBookProps {
  onBack: () => void;
}

const PhotoBook: React.FC<PhotoBookProps> = ({ onBack }) => {
  const [items, setItems] = useState<DriveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [isTurning, setIsTurning] = useState<'forward' | 'backward' | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        const combined: DriveItem[] = [];
        const seen = new Set<string>();
        const pageSize = 60;
        let page = 0;

        while (true) {
          const res = await fetch(`/api/drive-list?page=${page}&pageSize=${pageSize}`, { method: 'GET' });
          if (!res.ok) {
            throw new Error(`Unable to load the photo book right now (status ${res.status}).`);
          }
          const data = await res.json();
          const files = (data.files || []) as DriveItem[];
          for (const file of files) {
            if (!seen.has(file.id)) {
              seen.add(file.id);
              combined.push(file);
            }
          }
          if (files.length < pageSize || files.length === 0) {
            break;
          }
          page += 1;
        }

        if (!cancelled) {
          setItems(combined);
          setPageIndex(0);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || 'Something went wrong while loading the photo book.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchAll();
    return () => {
      cancelled = true;
    };
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
              <p className="text-sm text-sky-100/80">Every page pulls straight from the drive with a sprinkle of parenting joy.</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 text-sky-100/80">
            <span className="text-lg">✨</span>
            <p className="text-sm font-medium">Swipe with arrows or tap the buttons to glide through memories</p>
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
              No photos have arrived yet. Snap some moments to fill the book!
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
                      src={idToViewUrl(currentItem.id)}
                      alt={currentItem.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 text-xs px-3 py-1 rounded-full border border-white/20">
                      {pageLabel}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sky-100/80 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📖</span>
                      <span>Flip for the sweetest tips for the newest parents.</span>
                    </div>
                    <a
                      href={idToOpenUrl(currentItem.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-full bg-white/15 border border-white/25 text-xs font-semibold hover:bg-white/25 transition-colors"
                    >
                      Open in Drive
                    </a>
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
                  <span>All photos are streamed directly from the shared drive.</span>
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
