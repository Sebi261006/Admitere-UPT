import Hero from "../../components/home/Hero";

const Home = () => {
  return (
    <>
      <Hero />

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Premium lifestyle service</p>
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight">We capture nights that feel cinematic and moments that taste unforgettable.</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: "Curated visuals", body: "Refined imagery for every atmosphere." },
              { title: "Signature cocktails", body: "Handcrafted menus for premium guests." },
              { title: "Event direction", body: "Stylish setups designed for sharing." },
              { title: "Effortless delivery", body: "Fast turnaround and smooth communication." },
            ].map((item) => (
              <div key={item.title} className="glass-card p-6 rounded-3xl border-white/10 shadow-[0_35px_120px_-70px_rgba(255,255,255,0.3)]">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-300">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;