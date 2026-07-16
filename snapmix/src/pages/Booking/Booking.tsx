import BookingForm from "../../components/booking/BookingForm";

const Booking = () => {
  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <div className="mb-10">
        <span className="text-sm uppercase tracking-[0.35em] text-emerald-300">Book your session</span>
        <h2 className="text-4xl font-bold mt-4">Plan your next visual experience.</h2>
        <p className="text-gray-300 mt-4 leading-8">Share your event details and our team will craft a bespoke photography and cocktail experience for your occasion.</p>
      </div>
      <BookingForm />
    </section>
  );
};

export default Booking;
