import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Services from "../pages/Services/Services";
import Gallery from "../pages/Gallery/Gallery";
import Booking from "../pages/Booking/Booking";
import Contact from "../pages/Contact/Contact";
import Admin from "../pages/Admin/Admin";

const MainLayout = () => {
  return (
    <div className="bg-[#0B0B0B] text-white min-h-screen flex flex-col">
      <Navbar />

      <main className="pt-24 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;