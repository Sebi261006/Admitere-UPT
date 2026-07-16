import GalleryGrid from "../../components/gallery/GalleryGrid";

const Gallery = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="mb-12 max-w-2xl">
        <span className="text-sm uppercase tracking-[0.35em] text-blue-300">Featured works</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-4">A refined archive of mood, motion and craft.</h2>
        <p className="mt-4 text-gray-300 leading-8">Browse the gallery for a sense of SnapMix style: editorial lighting, elegant details, and atmospheric event design.</p>
      </div>

      <GalleryGrid />
    </section>
  );
};

export default Gallery;
