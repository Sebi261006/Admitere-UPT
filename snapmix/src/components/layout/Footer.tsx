const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black/60 py-8 text-sm text-gray-400">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} SNAPMIX. Premium photography & cocktail experiences.</span>
        <span className="text-gray-500">Built for modern events with polished visuals.</span>
      </div>
    </footer>
  );
};

export default Footer;
