import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative h-screen overflow-hidden flex items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_24%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/50 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative max-w-4xl text-center"
      >
        <p className="text-sm uppercase tracking-[0.4em] text-emerald-300 mb-6">SnapMix Studio</p>
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight">SNAPMIX</h1>
        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-8">
          An elevated blend of editorial photography and cocktail hospitality for boutique events, launches and private experiences.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <span className="btn-secondary">Photography</span>
          <span className="btn-secondary">Cocktail service</span>
          <span className="btn-secondary">Event styling</span>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;