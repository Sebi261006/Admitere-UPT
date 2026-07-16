import ContactForm from "../../components/contact/ContactForm";

const Contact = () => {
  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <div className="mb-10">
        <span className="text-sm uppercase tracking-[0.35em] text-blue-300">Say hello</span>
        <h2 className="text-4xl font-bold mt-4">Let’s create your next memorable moment.</h2>
        <p className="text-gray-300 mt-4 leading-8">Whether you’re planning an intimate gathering or a creative brand event, we’re ready to help with visuals and cocktails.</p>
      </div>
      <ContactForm />
    </section>
  );
};

export default Contact;
