import { useState } from "react";

const IMAGES = [
  "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=1200&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
  "https://images.unsplash.com/photo-1482192505345-5655af888cc4?w=1200&q=80",
  "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=1200&q=80",
];

const GalleryGrid = () => {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {IMAGES.map((src) => (
          <button
            key={src}
            onClick={() => setActive(src)}
            className="group overflow-hidden rounded-3xl bg-white/5 border border-white/10 shadow-[0_18px_60px_-40px_rgba(0,0,0,0.75)] transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
          >
            <img src={`${src}&auto=format&fit=crop&w=800&q=60`} alt="gallery" className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105" />
          </button>
        ))}
      </div>

      {active && (
        <dialog open className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="max-w-4xl w-full rounded-3xl overflow-hidden bg-[#0b0b0b] shadow-[0_35px_120px_-45px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-black/70 px-6 py-4">
              <span className="text-sm uppercase tracking-[0.3em] text-gray-400">Photo preview</span>
              <button className="text-white/90 hover:text-white" onClick={() => setActive(null)}>Close</button>
            </div>
            <img src={`${active}&auto=format&fit=contain&w=1600&q=80`} alt="large" className="w-full h-auto" />
          </div>
        </dialog>
      )}
    </>
  );
};

export default GalleryGrid;
