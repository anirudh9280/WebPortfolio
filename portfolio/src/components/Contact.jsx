import { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import SectionHeader from "./SectionHeader";
import { SectionWrapper } from "../hoc";
import { fadeIn } from "../utils/motion";

const EMAILJS = {
  serviceId: "service_uneg1dg",
  templateId: "template_9d98q7o",
  publicKey: "y6EGu6pqN2I7S6rpU",
};

const CHANNELS = [
  { label: "Email", value: "anirudh.annabathula@gmail.com", href: "mailto:anirudh.annabathula@gmail.com" },
  { label: "GitHub", value: "anirudh9280", href: "https://github.com/anirudh9280" },
  { label: "LinkedIn", value: "anirudha9", href: "https://www.linkedin.com/in/anirudha9" },
  { label: "Phone", value: "408-838-9692", href: "tel:+14088389692" },
];

const inputClass =
  "w-full rounded-panel border border-line/15 bg-surface-2 px-4 py-3 text-[15px] text-ink placeholder:text-muted/60 outline-none transition-colors focus:border-accent";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  // Inline status instead of alert() -- alerts block the main thread and read
  // as broken on mobile.
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    emailjs
      .send(
        EMAILJS.serviceId,
        EMAILJS.templateId,
        {
          from_name: form.name,
          to_name: "Anirudh",
          from_email: form.email,
          to_email: "anirudh.annabathula@gmail.com",
          message: form.message,
        },
        EMAILJS.publicKey
      )
      .then(
        () => {
          setLoading(false);
          setStatus({ ok: true, text: "Message sent. I'll reply soon." });
          setForm({ name: "", email: "", message: "" });
        },
        (error) => {
          setLoading(false);
          console.error(error);
          setStatus({
            ok: false,
            text: "That didn't send. Email me directly at anirudh.annabathula@gmail.com.",
          });
        }
      );
  };

  return (
    <>
      <SectionHeader
        label="Contact"
        title="Get in touch."
        readout="La Jolla, CA · PT"
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16">
        <motion.form
          ref={formRef}
          onSubmit={handleSubmit}
          variants={fadeIn("right", "tween", 0.1, 0.7)}
          className="flex flex-col gap-5"
        >
          <label className="flex flex-col gap-2">
            <span className="readout">Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="readout">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="readout">Message</span>
            <textarea
              rows={6}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What would you like to talk about?"
              required
              className={`${inputClass} resize-y`}
            />
          </label>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="rounded-panel bg-accent px-6 py-3 font-mono text-[12px] font-medium uppercase tracking-readout text-on-accent transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send message"}
            </button>

            {status ? (
              <p
                role="status"
                className={`text-[13px] ${status.ok ? "text-accent" : "text-ink"}`}
              >
                {status.text}
              </p>
            ) : null}
          </div>
        </motion.form>

        <motion.div variants={fadeIn("left", "tween", 0.2, 0.7)}>
          <div className="flex items-center gap-4">
            <span className="readout">Channels</span>
            <span className="panel-rule" aria-hidden="true" />
          </div>

          <ul className="mt-4 divide-y divide-line/[0.08]">
            {CHANNELS.map((channel) => (
              <li key={channel.label}>
                <a
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    channel.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group flex items-baseline justify-between gap-4 py-3 transition-colors hover:text-accent"
                >
                  <span className="readout shrink-0">{channel.label}</span>
                  <span className="truncate font-mono text-[13px] text-ink transition-colors group-hover:text-accent">
                    {channel.value}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-[14px] leading-[1.7] text-muted">
            Graduating March 2027 and looking for new-grad roles in data
            engineering, machine learning, and computer vision. Internships and
            research collaborations welcome too.
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default SectionWrapper(Contact, "contact");
