import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const items = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Gallery", to: "/gallery" },
  { label: "Booking", to: "/booking" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl shadow-[0_25px_80px_-48px_rgba(0,0,0,0.75)]">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        <NavLink to="/" className="text-2xl font-semibold tracking-[0.35em] text-white/95">SNAPMIX</NavLink>

        <nav className="hidden md:flex gap-8 text-sm items-center">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                `transition-colors duration-200 ${isActive ? "text-white font-semibold" : "text-gray-300 hover:text-white"}`
              }
            >
              {it.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="md:hidden p-2 text-white/90 hover:text-white"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>

      {open && (
        <div className="md:hidden bg-[#060606]/95 border-t border-white/10 backdrop-blur-2xl">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-3">
            {items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-3 px-4 rounded-2xl transition-colors duration-200 ${
                    isActive ? "bg-white/10 text-white font-semibold" : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {it.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;