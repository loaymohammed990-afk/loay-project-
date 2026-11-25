import { Github, Mail, MessageCircleMore, PanelsTopLeft, Sparkles } from 'lucide-react';
import { assetUrl, portfolio, safeExternal, type Copy } from '../data';
import type { Locale } from '../types';

export function SocialLinks({ t }: { t: Copy }) {
  const { profile } = portfolio;
  return <div className="social-links">
    {safeExternal(profile.github) && <a href={safeExternal(profile.github)} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={20} aria-hidden="true"/></a>}
    <a href={`mailto:${profile.email}`} aria-label={t.email}><Mail size={20} aria-hidden="true"/></a>
    {safeExternal(profile.whatsapp) && <a href={safeExternal(profile.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label={t.whatsapp}><MessageCircleMore size={20} aria-hidden="true"/></a>}
    {safeExternal(profile.linkedin) && <a href={safeExternal(profile.linkedin)} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><span dir="ltr">in</span></a>}
  </div>;
}

export default function Hero({ t, locale }: { t: Copy; locale: Locale }) {
  const { profile } = portfolio;
  const portrait = assetUrl(profile.portrait);
  return <section className="hero-section container" id="home" aria-labelledby="hero-title">
    <div className="hero-topline"><span className="hero-role">{profile.role[locale]}</span><span className="availability"><Sparkles size={16} aria-hidden="true"/>{t.interest}</span></div>
    <div className="hero-copy">
      <div className="hero-identity"><div className="hero-visual" role="img" aria-label={t.visualLabel}>{portrait ? <img src={portrait} alt={profile.name[locale]} width="52" height="52" className="portrait"/> : <span className="identity-monogram" dir="ltr">{profile.initials}<i>.</i></span>}</div><p className="hello">{t.hello} <strong>{profile.name[locale]}</strong></p></div>
      <h1 id="hero-title">{t.headline}<br/><span className="hero-accent-line"><span className="text-gradient">{t.headlineAccent}</span><svg className="hero-emblem" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 0 60 28 85 15 72 40 100 50 72 60 85 85 60 72 50 100 40 72 15 85 28 60 0 50 28 40 15 15 40 28Z" fill="currentColor"/><circle cx="50" cy="50" r="11" fill="var(--bg)"/></svg></span></h1>
      <div className="hero-bottom"><p className="hero-description">{t.intro}</p><div className="hero-action-block"><div className="hero-actions"><a className="btn btn-primary" href="#projects"><PanelsTopLeft size={19} aria-hidden="true"/>{t.explore}</a><a className="btn btn-outline" href="#contact">{t.contactMe}</a></div><SocialLinks t={t}/></div></div>
    </div>
    <div className="hero-footnote"><span>{t.detail}</span><span>{t.detailNote}</span><a href="#projects">{t.discover}</a></div>
  </section>;
}
