import { useState } from "react";

const BookingForm = () => {
  const [form, setForm] = useState({ name: "", email: "", date: "", time: "", guests: "2", message: "" });
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // basic validation
    if (!form.name || !form.email || !form.date) return alert("Please complete required fields.");

    // try sending to server
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Server error');
      setSaved(true);
      return;
    } catch (err) {
      // fallback to localStorage
      const bookings = JSON.parse(localStorage.getItem("snapmix_bookings") || "[]");
      bookings.push({ ...form, createdAt: new Date().toISOString() });
      localStorage.setItem("snapmix_bookings", JSON.stringify(bookings));
      setSaved(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 rounded-[32px] border-white/10 shadow-[0_30px_120px_-70px_rgba(255,255,255,0.3)]">
      {saved && <div className="mb-5 rounded-2xl border border-green-400/20 bg-green-400/10 p-4 text-green-200">Reservation saved. We will contact you shortly.</div>}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-200">Nume complet</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ex: Ana Popescu"
            required
            className="p-4 bg-white/5 border border-white/10 rounded-3xl text-white placeholder:text-gray-500 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
          />
          <p className="text-xs text-gray-500">Completează numele pentru confirmarea rezervării.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-200">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Ex: ana@example.com"
            required
            className="p-4 bg-white/5 border border-white/10 rounded-3xl text-white placeholder:text-gray-500 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
          />
          <p className="text-xs text-gray-500">Adresa de email folosită pentru confirmare și detalii.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-medium text-gray-200">Data evenimentului</label>
          <input
            id="date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
            className="p-4 bg-white/5 border border-white/10 rounded-3xl text-white outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
          />
          <p className="text-xs text-gray-500">Alege ziua în care dorești serviciul.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="time" className="text-sm font-medium text-gray-200">Interval orar</label>
          <input
            id="time"
            name="time"
            type="time"
            value={form.time}
            onChange={handleChange}
            className="p-4 bg-white/5 border border-white/10 rounded-3xl text-white outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
          />
          <p className="text-xs text-gray-500">Ora estimată a evenimentului (dacă o știi).</p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="guests" className="text-sm font-medium text-gray-200">Număr de persoane</label>
          <select
            id="guests"
            name="guests"
            value={form.guests}
            onChange={handleChange}
            className="p-4 w-full bg-slate-950/95 border border-white/10 rounded-3xl text-white appearance-none outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
          >
            <option className="text-white" value="1">1 persoană</option>
            <option className="text-white" value="2">2 persoane</option>
            <option className="text-white" value="3">3 persoane</option>
            <option className="text-white" value="4">4 persoane</option>
            <option className="text-white" value="5">5+ persoane</option>
          </select>
          <p className="text-xs text-gray-500">Alege câte persoane participă la eveniment.</p>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-gray-200">Detalii suplimentare</label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Note speciale, cerințe sau preferințe pentru cocktail-uri"
          className="w-full p-4 bg-white/5 border border-white/10 rounded-3xl text-white placeholder:text-gray-500 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
          rows={5}
        />
        <p className="text-xs text-gray-500">Spune-ne ce dorești să includem în experiență.</p>
      </div>

      <div className="mt-6">
        <button className="btn-primary">Trimite rezervarea</button>
      </div>
    </form>
  );
};

export default BookingForm;
