import { useState, type FormEvent } from 'react';
import { Copy, Mail } from 'lucide-react';
import { portfolio, type Copy as Translation } from '../data';

export default function ContactForm({ t }: { t: Translation }) {
  const [status, setStatus] = useState<'prepared' | 'copied' | 'copyFailed' | 'invalid' | ''>('');
  const [draft, setDraft] = useState('');
  const prepare = (form: HTMLFormElement) => {
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    if (name.length < 2 || message.length < 10) { setStatus('invalid'); return; }
    const subject = `${t.subject} — ${name}`;
    const body = `${t.name}: ${name}\n${t.email}: ${email}\n\n${message}`;
    setDraft(`${subject}\n\n${body}`);
    return { subject, body, full: `${subject}\n\n${body}` };
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = prepare(event.currentTarget);
    if (!message) return;
    setStatus('prepared');
    window.location.href = `mailto:${portfolio.profile.email}?subject=${encodeURIComponent(message.subject)}&body=${encodeURIComponent(message.body)}`;
  };
  const copy = async (form: HTMLFormElement) => {
    const message = prepare(form);
    if (!message) return;
    try { await navigator.clipboard.writeText(message.full); setStatus('copied'); }
    catch { setStatus('copyFailed'); }
  };
  return <form className="contact-form" onSubmit={submit}>
    <div className="form-heading"><span className="eyebrow">{t.contactTag}</span><h3>{t.formTitle}</h3><p>{t.formIntro}</p></div>
    <div className="form-double"><label htmlFor="contact-name">{t.name}<input id="contact-name" name="name" autoComplete="name" placeholder={t.namePlaceholder} minLength={2} maxLength={80} required/></label><label htmlFor="contact-email">{t.email}<input id="contact-email" name="email" type="email" autoComplete="email" dir="ltr" placeholder="name@example.com" maxLength={254} required/></label></div>
    <label htmlFor="contact-message">{t.message}<textarea id="contact-message" name="message" rows={5} minLength={10} maxLength={3000} placeholder={t.messagePlaceholder} required/></label>
    <p id="contact-hint" className="form-hint">{t.formHint}</p>
    <button className="btn btn-primary form-submit" type="submit" aria-describedby="contact-hint"><Mail size={17} aria-hidden="true"/>{t.prepare}</button>
    <button className="copy-draft" type="button" onClick={event => { void copy(event.currentTarget.form!); }}><Copy size={16} aria-hidden="true"/>{t.copy}</button>
    <p className={status ? 'form-status' : 'status-empty'} role="status" aria-live="polite">{status ? t[status] : ''}</p>
    {draft && <details className="draft-preview" open={status === 'copyFailed'}><summary>{t.draft}</summary><textarea aria-label={t.draft} readOnly value={draft} rows={8}/></details>}
  </form>;
}
