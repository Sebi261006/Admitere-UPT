const Services = () => {
  const services = [
    { title: "Photography Session", desc: "Portraits, couples, and events." },
    { title: "Cocktail Experience", desc: "Custom cocktail service for events." },
    { title: "Event Coverage", desc: "Full event photo & video coverage." },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="mb-12 max-w-3xl">
        <span className="text-sm uppercase tracking-[0.35em] text-emerald-300">What we offer</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-4">Services designed for refined brand moments.</h2>
        <p className="mt-4 text-gray-300 leading-8">From editorial photo sets to immersive cocktail bar design, each service is tailored to ensure your event looks premium and runs smoothly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((s) => (
          <div key={s.title} className="glass-card p-8 rounded-3xl border-white/10 shadow-[0_30px_90px_-50px_rgba(0,0,0,0.7)]">
            <div className="mb-5 text-emerald-300 uppercase tracking-[0.4em] text-xs">Service</div>
            <h3 className="text-2xl font-semibold mb-3">{s.title}</h3>
            <p className="text-gray-300 leading-7">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
