import React, { useEffect, useState } from 'react';
import { GDRIVE_WEBAPP_URL } from '../constants';

type DriveItem = {
  id: string;
  name: string;
  createdTime?: string;
};

const idToViewUrl = (id: string) => `https://drive.google.com/uc?export=view&id=${id}`;
const idToOpenUrl = (id: string) => `https://drive.google.com/file/d/${id}/view`;

interface GalleryProps {
  onBack: () => void;
}

const Gallery: React.FC<GalleryProps> = ({ onBack }) => {
  const [items, setItems] = useState<DriveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        // Assumes the Apps Script exposes GET that returns { files: [{id,name,createdTime}] }
        const url = `${GDRIVE_WEBAPP_URL}?list=1`;
        const res = await fetch(url, { method: 'GET' });
        if (!res.ok) {
          throw new Error(`Failed to fetch gallery: ${res.status}`);
        }
        const data = await res.json();
        if (!cancelled) {
          setItems((data.files || []) as DriveItem[]);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-yellow-200">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-blue-900">Event Gallery</h2>
        <button
          onClick={onBack}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back
        </button>
      </div>
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-blue-800">Loading…</div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-red-700">Error: {error}</div>
      ) : items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-blue-800">No photos yet. Be the first!</div>
      ) : (
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((it) => (
              <a
                key={it.id}
                href={idToOpenUrl(it.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
              >
                <img
                  src={idToViewUrl(it.id)}
                  alt={it.name}
                  className="w-full h-40 object-cover bg-gray-100"
                  loading="lazy"
                />
                <div className="p-2 text-xs text-blue-900 truncate">{it.name}</div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

