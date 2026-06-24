import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});

  const handleChange = (field, val) => {
    if (field === 'name') setName(val);
    if (field === 'email') setEmail(val);
    if (field === 'message') setMessage(val);

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validate = () => {
    const e = {};

    if (!name.trim()) e.name = 'Name is required';

    if (!email.trim()) {
      e.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      e.email = 'Invalid email';
    }

    if (!message.trim()) {
      e.message = 'Message is required';
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setStatus('loading');

    try {
      await emailjs.send(
        import.meta.env.PUBLIC_EMAILJS_SERVICE_ID,
        import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          from_name: name,
          from_email: email,
          message: message,
        },
        import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY
      );

      setStatus('success');

      setName('');
      setEmail('');
      setMessage('');

      setTimeout(() => {
        setStatus('idle');
      }, 5000);

    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const inputBase =
    'w-full px-4 py-3.5 text-base bg-[var(--bg-surface)] border rounded-xl outline-none transition-all duration-200 text-[var(--text-primary)] placeholder-[var(--text-primary)]/30 leading-normal';
  const inputNormal = `${inputBase} border-[var(--border)] focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent)]/10`;
  const inputError = `${inputBase} border-red-500/40 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/10`;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 w-full"
      id="portfolio-contact-form"
    >
      <div className="flex flex-col gap-1.5">
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">Send a message</h3>
        <p className="text-sm text-[var(--text-primary)]/40 font-mono-technical">
          // I'll get back to you within 24 hours.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-name" className="text-sm font-medium text-[var(--text-primary)]/65">
          Your name
        </label>
        <input
          type="text"
          id="contact-name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={errors.name ? inputError : inputNormal}
        />
        {errors.name && (
          <span className="text-sm text-red-400 font-mono-technical">{errors.name}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-email" className="text-sm font-medium text-[var(--text-primary)]/65">
          Email address
        </label>
        <input
          type="email"
          id="contact-email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={errors.email ? inputError : inputNormal}
        />
        {errors.email && (
          <span className="text-sm text-red-400 font-mono-technical">{errors.email}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="text-sm font-medium text-[var(--text-primary)]/65">
          Message
        </label>
        <textarea
          id="contact-message"
          placeholder="Tell me about your project or idea..."
          rows={5}
          value={message}
          onChange={(e) => handleChange('message', e.target.value)}
          className={`resize-none ${errors.message ? inputError : inputNormal}`}
        />
        {errors.message && (
          <span className="text-sm text-red-400 font-mono-technical">{errors.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="interactive w-full py-3 md:py-4 rounded-xl text-sm md:text-base font-semibold bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-88 transition-all duration-200 flex items-center justify-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
      >
        {status === 'loading' ? (
          <>
            <span className="w-4 h-4 border-2 border-[var(--bg-primary)]/30 border-t-[var(--bg-primary)] rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send message
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M1 7h12M7 1l6 6-6 6"/>
            </svg>
          </>
        )}
      </button>

      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="p-4 bg-emerald-500/8 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm font-medium text-center"
          >
            ✓ Message sent successfully. I'll be in touch soon.
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="p-4 bg-red-500/8 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium text-center"
          >
            Something went wrong. Please try again or email me directly.
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
