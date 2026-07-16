import { useState } from "react";

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return alert("Complete all fields.");

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Server error');
      setSent(true);
      return;
    } catch (err) {
      const messages = JSON.parse(localStorage.getItem("snapmix_messages") || "[]");
      messages.push({ ...form, createdAt: new Date().toISOString() });
      localStorage.setItem("snapmix_messages", JSON.stringify(messages));
      setSent(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 rounded-[32px] border-white/10 shadow-[0_30px_120px_-70px_rgba(255,255,255,0.3)]">
      {sent && <div className="mb-5 rounded-2xl border border-green-400/20 bg-green-400/10 p-4 text-green-200">Message saved. We will reply shortly.</div>}

      <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="w-full p-4 mb-4 bg-white/5 border border-white/10 rounded-3xl text-white placeholder:text-gray-500 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-300/20" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Your email" className="w-full p-4 mb-4 bg-white/5 border border-white/10 rounded-3xl text-white placeholder:text-gray-500 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-300/20" />
      <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" className="w-full p-4 mb-4 bg-white/5 border border-white/10 rounded-3xl text-white placeholder:text-gray-500 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-300/20" rows={6} />

      <div>
        <button className="btn-primary">Send message</button>
      </div>
    </form>
  );
};

export default ContactForm;
