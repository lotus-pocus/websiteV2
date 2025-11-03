// src/pages/Contact.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import Section from "../components/Section";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending...");

    try {
      const res = await fetch("https://formspree.io/f/mzzjgwld", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      console.error("Form submission failed:", err);
      setStatus("Something went wrong. Please try again.");
    }
  };

  return (
    <Layout>
      <section
        data-theme="dark"
        className="min-h-screen bg-black text-white no-global-link"
      >
        <Section
          id="contact"
          theme="dark" // 👈 ensures black background + white text
          paddingClass="py-20 px-6"
        >
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Left: Contact details + Map */}
            <div>
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="mb-6">
                We’d love to hear from you! Drop us a line about projects,
                collaborations, or just to say hi.
              </p>
              <div className="space-y-2 mb-6">
                <p>
                  <strong>Address:</strong> Studio8, 18 All Saints Road,
                  London,W11 1HH, UK
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:hello@gamoola.com" className="underline">
                    hello@gamoola.com
                  </a>
                </p>
              </div>

              {/* Google Maps Embed */}
              {/* Google Maps Embed */}
              <div className="w-full h-64 mb-6">
                <iframe
                  title="map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.7350358529875!2d-0.2062225881172922!3d51.51807690980614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876101c4f92036d%3A0xd5a89d3c0825826a!2sGamoola%20Ltd!5e0!3m2!1sen!2suk!4v1759508221069!5m2!1sen!2suk"
                  className="w-full h-full rounded-lg border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Back to Home link */}
              <Link
                to="/"
                className="inline-block mt-4 text-white hover:underline"
              >
                ← Back to Home
              </Link>
            </div>

            {/* Right: Contact form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded bg-gray-800 text-white"
              />
              <input
                type="email"
                name="email"
                placeholder="Your email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded bg-gray-800 text-white"
              />
              <textarea
                name="message"
                placeholder="Your message"
                rows={6}
                value={form.message}
                onChange={handleChange}
                required
                className="w-full p-3 rounded bg-gray-800 text-white"
              />
              <button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded font-bold"
              >
                Send Message
              </button>
              {status && <p className="text-sm mt-2">{status}</p>}
            </form>
          </div>
        </Section>
      </section>
    </Layout>
  );
};

export default Contact;
