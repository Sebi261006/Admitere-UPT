import { useEffect, useState } from "react";

const ADMIN_PASSWORD = "snapmixadmin";

const defaultRates = {
  base: { photography: 850, cocktail: 720, full: 1500 },
  perHour: 160,
  weekendMultiplier: 1.15,
  eveningMultiplier: 1.1,
};

const Admin = () => {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [rates, setRates] = useState(defaultRates);
  const [rateInputs, setRateInputs] = useState(defaultRates);
  const [rateStatus, setRateStatus] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [estimateInputs, setEstimateInputs] = useState({
    serviceType: "full",
    guests: "2",
    hours: "3",
    date: new Date().toISOString().slice(0, 10),
    time: "19:00",
  });
  const [error, setError] = useState<string | null>(null);

  const readStoredRates = () => {
    if (typeof window === "undefined") return null;

    try {
      const stored = window.localStorage.getItem("snapmix_rates");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const persistRates = (data: typeof defaultRates) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("snapmix_rates", JSON.stringify(data));
    }
  };

  useEffect(() => {
    if (!authorized) return;

    const fetchData = async () => {
      try {
        const [bookingsRes, messagesRes, ratesRes] = await Promise.all([
          fetch("/api/bookings"),
          fetch("/api/messages"),
          fetch("/api/rates"),
        ]);

        if (!bookingsRes.ok || !messagesRes.ok || !ratesRes.ok) {
          throw new Error("Unable to load data");
        }

        setBookings(await bookingsRes.json());
        setMessages(await messagesRes.json());
        const fetchedRates = await ratesRes.json();
        setRates(fetchedRates);
        setRateInputs(fetchedRates);
        persistRates(fetchedRates);
      } catch (err) {
        const fallbackRates = readStoredRates();
        if (fallbackRates) {
          setRates(fallbackRates);
          setRateInputs(fallbackRates);
        }
        setError("Could not load admin data. Please ensure the server is running.");
      }
    };

    fetchData();
  }, [authorized]);

  const handleEstimateChange = (field: string, value: string) => {
    setSelectedBooking(null);
    setEstimateInputs((current) => ({ ...current, [field]: value }));
  };

  const selectBooking = (booking: any) => {
    setSelectedBooking(booking);
    setEstimateInputs({
      serviceType: "full",
      guests: String(booking.guests || 2),
      hours: "3",
      date: booking.date || new Date().toISOString().slice(0, 10),
      time: booking.time || "19:00",
    });
  };

  const saveRates = async () => {
    try {
      const res = await fetch("/api/rates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rateInputs),
      });

      if (!res.ok) {
        throw new Error("Unable to save rates");
      }

      const updatedRates = await res.json();
      setRates(updatedRates);
      setRateInputs(updatedRates);
      persistRates(updatedRates);
      setRateStatus("Tarifele au fost salvate cu succes.");
    } catch (err) {
      persistRates(rateInputs);
      setRates(rateInputs);
      setRateInputs(rateInputs);
      setRateStatus("Serverul nu este disponibil, tarifele au fost salvate local.");
    }
  };

  const handleRateChange = (field: string, value: string) => {
    setRateStatus(null);
    if (field.startsWith("base.")) {
      const key = field.split(".")[1] as keyof typeof rateInputs.base;
      setRateInputs((current) => ({
        ...current,
        base: { ...current.base, [key]: Number(value) },
      }));
      return;
    }

    setRateInputs((current) => ({
      ...current,
      [field]: Number(value),
    }));
  };

  const calculateEstimate = () => {
    const currentRates = rates || defaultRates;
    const serviceRates: Record<string, number> = {
      photography: currentRates.base.photography,
      cocktail: currentRates.base.cocktail,
      full: currentRates.base.full,
    };

    const hours = Math.max(Number(estimateInputs.hours) || 3, 1);
    const timeHour = Number((estimateInputs.time || "19:00").split(":")[0] || 19);
    const base = serviceRates[estimateInputs.serviceType] ?? serviceRates.full;
    const hourCharge = hours * currentRates.perHour;

    let total = base + hourCharge;
    const eventDate = new Date(estimateInputs.date || new Date().toISOString().slice(0, 10));
    const isWeekend = [0, 5, 6].includes(eventDate.getDay());
    const isEvening = timeHour >= 20;

    if (isWeekend) total *= currentRates.weekendMultiplier;
    if (isEvening) total *= currentRates.eveningMultiplier;

    return Math.round(total);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthorized(true);
      setError(null);
      return;
    }
    setError("Parolă incorectă.");
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold mb-6">Admin Panel</h2>
      {!authorized ? (
        <form onSubmit={handleLogin} className="max-w-xl bg-zinc-900/50 p-6 rounded-lg">
          <p className="text-gray-300 mb-4">Introdu parola admin pentru a vedea rezervările și mesajele.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parola admin"
            className="w-full p-3 mb-4 bg-transparent border border-white/10 rounded"
          />
          <button className="bg-white text-black px-5 py-3 rounded">Loghează-te</button>
          {error && <p className="mt-4 text-red-400">{error}</p>}
        </form>
      ) : (
        <div className="space-y-10">
          <div className="bg-zinc-900/50 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4">Rezervări</h3>
            {error && <p className="text-red-400 mb-4">{error}</p>}
            {bookings.length === 0 ? (
              <p className="text-gray-300">Nu există rezervări înregistrate.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 border-b border-white/10">Nume</th>
                      <th className="px-4 py-3 border-b border-white/10">Email</th>
                      <th className="px-4 py-3 border-b border-white/10">Data</th>
                      <th className="px-4 py-3 border-b border-white/10">Ora</th>
                      <th className="px-4 py-3 border-b border-white/10">Persoane</th>
                      <th className="px-4 py-3 border-b border-white/10">Acțiune</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="odd:bg-white/5">
                        <td className="px-4 py-3">{booking.name}</td>
                        <td className="px-4 py-3">{booking.email}</td>
                        <td className="px-4 py-3">{booking.date}</td>
                        <td className="px-4 py-3">{booking.time || "-"}</td>
                        <td className="px-4 py-3">{booking.guests || "-"}</td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => selectBooking(booking)}
                            className="rounded-full bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300 hover:bg-emerald-400/20"
                          >
                            Estimează
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4">Calculator preț estimativ</h3>
            <p className="text-gray-300 mb-6">Selectează o rezervare din tabel sau completează manual datele pentru a vedea un cost orientativ.</p>

            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                {selectedBooking && (
                  <div className="rounded-3xl border border-emerald-300/15 bg-emerald-300/5 p-4 text-emerald-100">
                    <p className="text-sm uppercase tracking-[0.3em] text-emerald-300 mb-2">Rezervare selectată</p>
                    <p className="text-sm text-gray-300">{selectedBooking.name} • {selectedBooking.guests} persoane • {selectedBooking.date} {selectedBooking.time || ""}</p>
                    <button
                      type="button"
                      onClick={() => setSelectedBooking(null)}
                      className="mt-3 text-sm text-white/70 hover:text-white"
                    >
                      Șterge selecția
                    </button>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-gray-300">
                    <span>Tip serviciu</span>
                    <select
                      value={estimateInputs.serviceType}
                      onChange={(e) => handleEstimateChange("serviceType", e.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-slate-950/95 p-4 text-white outline-none"
                    >
                      <option value="photography">Fotografie editorială</option>
                      <option value="cocktail">Serviciu cocktail</option>
                      <option value="full">Pachet complet</option>
                    </select>
                  </label>

                  <label className="space-y-2 text-sm text-gray-300">
                    <span>Număr de persoane</span>
                    <input
                      type="number"
                      min={1}
                      value={estimateInputs.guests}
                      onChange={(e) => handleEstimateChange("guests", e.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-slate-950/95 p-4 text-white outline-none"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-gray-300">
                    <span>Durata estimată (ore)</span>
                    <input
                      type="number"
                      min={1}
                      value={estimateInputs.hours}
                      onChange={(e) => handleEstimateChange("hours", e.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-slate-950/95 p-4 text-white outline-none"
                    />
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2 text-sm text-gray-300">
                      <span>Data evenimentului</span>
                      <input
                        type="date"
                        value={estimateInputs.date}
                        onChange={(e) => handleEstimateChange("date", e.target.value)}
                        className="w-full rounded-3xl border border-white/10 bg-slate-950/95 p-4 text-white outline-none"
                      />
                    </label>

                    <label className="space-y-2 text-sm text-gray-300">
                      <span>Ora de început</span>
                      <input
                        type="time"
                        value={estimateInputs.time}
                        onChange={(e) => handleEstimateChange("time", e.target.value)}
                        className="w-full rounded-3xl border border-white/10 bg-slate-950/95 p-4 text-white outline-none"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-6 text-gray-200">
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-300 mb-4">Rezultat estimativ</p>
                <p className="text-3xl font-semibold text-white mb-4">{calculateEstimate().toLocaleString()} lei</p>
                <div className="space-y-3 text-sm text-gray-400">
                  <p>Costul include un tarif de bază, ajustat în funcție de numărul de persoane, ore și dacă evenimentul este în weekend sau se desfășoară seara.</p>
                  <p>Dacă alegi o rezervare din tabel, valorile se completează automat pe baza datelor existente.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-lg">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-2xl font-semibold mb-2">Tarife serviciu</h3>
                <p className="text-gray-300 max-w-2xl">Modifică tarifele direct din acest panou. Valorile sunt salvate în fișierul <span className="font-semibold text-white">server/rates.json</span> și sunt folosite în calculatorul estimativ.</p>
              </div>
              <button
                type="button"
                onClick={saveRates}
                className="rounded-full bg-emerald-400/10 px-5 py-3 text-emerald-300 hover:bg-emerald-400/20"
              >
                Salvează tarife
              </button>
            </div>

            <div className="grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3">
              <label className="space-y-2 text-sm text-gray-300">
                <span>Fotografie editorială</span>
                <input
                  type="number"
                  min={0}
                  value={rateInputs.base.photography}
                  onChange={(e) => handleRateChange("base.photography", e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/95 p-4 text-white outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-gray-300">
                <span>Serviciu cocktail</span>
                <input
                  type="number"
                  min={0}
                  value={rateInputs.base.cocktail}
                  onChange={(e) => handleRateChange("base.cocktail", e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/95 p-4 text-white outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-gray-300">
                <span>Pachet complet</span>
                <input
                  type="number"
                  min={0}
                  value={rateInputs.base.full}
                  onChange={(e) => handleRateChange("base.full", e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/95 p-4 text-white outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-gray-300">
                <span>Cost per oră</span>
                <input
                  type="number"
                  min={0}
                  value={rateInputs.perHour}
                  onChange={(e) => handleRateChange("perHour", e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/95 p-4 text-white outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-gray-300">
                <span>Multiplicator weekend</span>
                <input
                  type="number"
                  step="0.01"
                  min={1}
                  value={rateInputs.weekendMultiplier}
                  onChange={(e) => handleRateChange("weekendMultiplier", e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/95 p-4 text-white outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-gray-300">
                <span>Multiplicator seară</span>
                <input
                  type="number"
                  step="0.01"
                  min={1}
                  value={rateInputs.eveningMultiplier}
                  onChange={(e) => handleRateChange("eveningMultiplier", e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/95 p-4 text-white outline-none"
                />
              </label>
            </div>
            {rateStatus && <p className="mt-4 text-sm text-emerald-300">{rateStatus}</p>}
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4">Mesaje</h3>
            {messages.length === 0 ? (
              <p className="text-gray-300">Nu există mesaje noi.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="border border-white/10 rounded-lg p-4 bg-black/20">
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-2">
                      <span>{msg.name}</span>
                      <span>{msg.email}</span>
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-200">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Admin;
