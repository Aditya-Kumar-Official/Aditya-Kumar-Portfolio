import { useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Mail, Phone } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { profile } from '../data/site.js';
import Magnetic from '../components/Magnetic.jsx';
import SectionHeading from '../components/SectionHeading.jsx';

const COOLDOWN_MS = 30000;   // minimum gap between sends from one browser tab
const TIMEOUT_MS = 15000;    // give up on a hung request instead of spinning forever

const RULES = {
  name: (v) => (v.trim().length < 2 ? 'Enter your name (at least 2 characters).' : ''),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address, like you@example.com.'),
  message: (v) => (v.trim().length < 10 ? 'Write at least 10 characters so I know how to help.' : '')
};

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">{label}</label>
      {children}
      <p id={`${id}-err`} className="mt-1.5 min-h-5 text-sm text-red-400" role={error ? 'alert' : undefined}>{error}</p>
    </div>
  );
}

function SuccessMark() {
  /* stroke-draw circle, then the tick (CSS keyframes `check-draw`) */
  return (
    <svg viewBox="0 0 52 52" className="h-20 w-20" aria-hidden="true" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <circle className="check-circle" pathLength="1" cx="26" cy="26" r="23" stroke="rgb(var(--accent-text))" />
      <path className="check-mark" pathLength="1" d="M15 27l8 8 14-16" stroke="rgb(var(--accent-text))" />
    </svg>
  );
}

export default function Contact() {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [copied, setCopied] = useState(false);
  const [errorKind, setErrorKind] = useState('send');   // 'config' | 'cooldown' | 'send'
  const lastSent = useRef(0);
  const inFlight = useRef(false);   // synchronous guard: state updates are async, so a double click could slip past `status`

  const validate = (field) => RULES[field](values[field]);
  const onBlur = (f) => () => setErrors((e) => ({ ...e, [f]: validate(f) }));
  const onChange = (f) => (e) => { setValues((v) => ({ ...v, [f]: e.target.value })); if (errors[f]) setErrors((x) => ({ ...x, [f]: RULES[f](e.target.value) })); };

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { window.location.href = `mailto:${profile.email}`; }
  };

  const fail = (kind) => { setErrorKind(kind); setStatus('error'); };

  const submit = async (e) => {
    e.preventDefault();
    if (inFlight.current || status === 'sending') return;
    const next = Object.fromEntries(Object.keys(RULES).map((f) => [f, RULES[f](values[f])]));
    setErrors(next);
    const firstBad = Object.keys(next).find((f) => next[f]);
    if (firstBad) { document.getElementById(firstBad)?.focus(); return; }
    // Honeypot: only bots fill this hidden field. Nothing is sent; real visitors never trigger it.
    if (new FormData(e.currentTarget).get('website')) { setStatus('success'); return; }
    if (Date.now() - lastSent.current < COOLDOWN_MS) { fail('cooldown'); return; }

    const { VITE_EMAILJS_SERVICE_ID: service, VITE_EMAILJS_TEMPLATE_ID: template, VITE_EMAILJS_PUBLIC_KEY: key } = import.meta.env;
    if (!service || !template || !key) { console.error('Contact form: VITE_EMAILJS_* variables are missing from this build.'); fail('config'); return; }

    inFlight.current = true;
    setStatus('sending');
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctrl.signal,
        body: JSON.stringify({ service_id: service, template_id: template, user_id: key,
          template_params: { from_name: values.name.trim(), from_email: values.email.trim(), reply_to: values.email.trim(), message: values.message.trim(), to_email: profile.email } })
      });
      // EmailJS answers 200 "OK" only when it accepted the send. Anything else is a failure, shown as one.
      if (!res.ok) throw new Error(`EmailJS HTTP ${res.status}: ${(await res.text().catch(() => '')).slice(0, 200)}`);
      lastSent.current = Date.now();
      setStatus('success');
    } catch (err) { console.error('Contact form failed:', err); fail('send'); }   // `values` is untouched, so the message is still in the form
    finally { clearTimeout(timer); inFlight.current = false; }
  };

  const reset = () => { setValues({ name: '', email: '', message: '' }); setErrors({}); setStatus('idle'); };

  return (
    <section id="contact" aria-labelledby="contact-title" className="section">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeading id="contact-title" title="Good work starts with a conversation." note="Have an internship opportunity, a project idea, or just want to talk engineering? My inbox is open." />
          <Magnetic><button type="button" onClick={copyEmail} className="btn btn-primary">{copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}{copied ? 'Email copied' : 'Copy email address'}</button></Magnetic>
          <span className="sr-only" role="status">{copied ? 'Email address copied to clipboard' : ''}</span>
          <ul className="mt-10 space-y-1">
            {[
              { href: `mailto:${profile.email}`, Icon: Mail, text: profile.email, label: `Send an email to ${profile.email}` },
              { href: `tel:${profile.phone.replaceAll(' ', '')}`, Icon: Phone, text: profile.phone, label: `Call ${profile.phone}` },
              { href: profile.linkedinUrl, Icon: FaLinkedin, text: 'LinkedIn', label: 'LinkedIn profile (opens in a new tab)', ext: true },
              { href: profile.githubUrl, Icon: FaGithub, text: 'GitHub', label: 'GitHub profile (opens in a new tab)', ext: true }
            ].map(({ href, Icon, text, label, ext }) => (
              <li key={text}><a href={href} aria-label={label} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="group -mx-3 flex items-center gap-4 rounded-xl px-3 py-3 text-muted transition-colors hover:bg-ink/5 hover:text-ink">
                <Icon size={18} aria-hidden="true" /><span className="break-all">{text}</span><ArrowUpRight size={15} className="ml-auto opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
              </a></li>
            ))}
          </ul>
        </div>

        <div className="glass relative p-6 sm:p-10">
          <AnimatePresence mode="wait" initial={false}>
            {status === 'success' ? (
              <m.div key="ok" className="flex min-h-[26rem] flex-col items-center justify-center text-center" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} role="status">
                <SuccessMark />
                <h3 className="mt-6 text-h3 font-semibold">Message sent</h3>
                <p className="mt-2 max-w-xs text-muted">Thanks for reaching out. I&rsquo;ll reply to {values.email || 'your email'} soon.</p>
                <button type="button" onClick={reset} className="btn btn-ghost mt-8">Send another message</button>
              </m.div>
            ) : (
              <m.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-label="Contact form">
                <Field id="name" label="Your name" error={errors.name}>
                  <input id="name" name="name" autoComplete="name" maxLength={100} className="field" value={values.name} onChange={onChange('name')} onBlur={onBlur('name')} aria-invalid={!!errors.name} aria-describedby="name-err" placeholder="How should I address you?" />
                </Field>
                <Field id="email" label="Email address" error={errors.email}>
                  <input id="email" name="email" type="email" autoComplete="email" maxLength={160} className="field" value={values.email} onChange={onChange('email')} onBlur={onBlur('email')} aria-invalid={!!errors.email} aria-describedby="email-err" placeholder="you@example.com" />
                </Field>
                <Field id="message" label="Message" error={errors.message}>
                  <textarea id="message" name="message" rows={5} maxLength={3000} className="field resize-y" value={values.message} onChange={onChange('message')} onBlur={onBlur('message')} aria-invalid={!!errors.message} aria-describedby="message-err" placeholder="Tell me a little about it…" />
                </Field>
                {/* honeypot: hidden from people and assistive tech, bots fill it in */}
                <div className="absolute left-[-9999px]" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>

                {status === 'error' && (
                  <p role="alert" className="mb-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm">
                    {errorKind === 'cooldown' ? 'You just sent a message. Please wait a few seconds before sending another.'
                      : errorKind === 'config' ? 'The contact form isn\u2019t configured on this site yet, so nothing was sent.'
                      : 'Your message couldn\u2019t be sent. What you wrote is still here, so you can try again.'}
                    {' '}You can also email me directly at <a className="font-semibold underline" href={`mailto:${profile.email}`}>{profile.email}</a>.
                  </p>
                )}
                <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={status === 'sending'} aria-busy={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send message'} <ArrowUpRight size={17} aria-hidden="true" />
                </button>
              </m.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
