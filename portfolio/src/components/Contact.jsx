import { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import SectionHeader from "./SectionHeader";
import { SectionWrapper } from "../hoc";
import { fadeIn } from "../utils/motion";
import {
  EMAIL,
  PHONE,
  GITHUB_URL,
  LINKEDIN_URL,
  RESUME_URL,
} from "../constants/links";

const EMAILJS = {
  serviceId: "service_uneg1dg",
  templateId: "template_9d98q7o",
  publicKey: "y6EGu6pqN2I7S6rpU",
};

const CHANNELS = [
  { label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
  { label: "GitHub", value: "anirudh9280", href: GITHUB_URL },
  { label: "LinkedIn", value: "anirudha9", href: LINKEDIN_URL },
  { label: "Résumé", value: "PDF", href: RESUME_URL },
  { label: "Phone", value: PHONE, href: `tel:+1${PHONE.replace(/-/g, "")}` },
];

const inputClass =
  "w-full rounded-panel border border-line/15 bg-surface-2 px-4 py-3 text-[15px] text-ink placeholder:text-muted/60 outline-none transition-colors focus:border-accent";

/** Everything the visitor typed, handed to their own mail client. */
const buildMailto = ({ name, email, message }) => {
  const subject = `Portfolio enquiry from ${name || "a visitor"}`;
  const body = [message, "", `From: ${name}`, `Reply to: ${email}`]
    .join("\n")
    .trim();
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  // Inline status rather than alert(): alerts block the main thread and read
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
          to_email: EMAIL,
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
          // Log the real reason. EmailJS returns e.g. 412 "Gmail_API: Invalid
          // grant" when the mail service's OAuth token needs reconnecting --
          // a dashboard problem, not something the visitor can act on.
          console.error("EmailJS send failed:", error?.status, error?.text);
          setStatus({
            ok: false,
            text: "The form couldn't reach the mail service.",
            mailto: buildMailto(form),
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

            {status?.ok ? (
              <p role="status" className="text-[13px] text-accent">
                {status.text}
              </p>
            ) : null}
          </div>

          {/* A failed send must not be a dead end -- hand the typed message to
              the visitor's own mail client, already filled in. */}
          {status && !status.ok ? (
            <div
              role="alert"
              className="rounded-panel border border-line/20 bg-surface-2 p-4"
            >
              <p className="text-[14px] leading-relaxed text-ink">
                {status.text}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">
                Nothing you wrote is lost. Open it in your mail app and hit
                send, or copy the address below.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a
                  href={status.mailto}
                  className="rounded-panel border border-accent px-4 py-2 font-mono text-[11px] uppercase tracking-readout text-accent transition-colors hover:bg-accent hover:text-on-accent"
                >
                  Open in mail app
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="font-mono text-[12px] text-muted underline decoration-line/30 underline-offset-4 transition-colors hover:text-accent"
                >
                  {EMAIL}
                </a>
              </div>
            </div>
          ) : null}
        </motion.form>

        <motion.div variants={fadeIn("left", "tween", 0.2, 0.7)}>
          <div className="flex items-center gap-4">
            <span className="readout">Channels</span>
            <span className="panel-rule" aria-hidden="true" />
          </div>

          <ul className="mt-4 divide-y divide-line/[0.08]">
            {CHANNELS.map((channel) => {
              const external =
                channel.href.startsWith("http") || channel.href.endsWith(".pdf");
              return (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="group flex items-baseline justify-between gap-4 py-3 transition-colors hover:text-accent"
                  >
                    <span className="readout shrink-0">{channel.label}</span>
                    <span className="truncate font-mono text-[13px] text-ink transition-colors group-hover:text-accent">
                      {channel.value}
                      {external ? " ↗" : ""}
                    </span>
                  </a>
                </li>
              );
            })}
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
