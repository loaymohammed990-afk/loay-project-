import { Code2, Github, Mail, MessageCircle, Sparkles } from 'lucide-react';
import { assetUrl, portfolio, safeExternal, type Copy } from '../data';
import type { Locale } from '../types';

export function SocialLinks({ t }: { t: Copy }) {
  const { profile } = portfolio;
  return <div className="social-links">
    {safeExternal(profile.github) && <a href={safeExternal(profile.github)} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={20} aria-hidden="true"/></a>}
    <a href={`mailto:${profile.email}`} aria-label={t.email}><Mail size={20} aria-hidden="true"/></a>
    {safeExternal(profile.whatsapp) && <a href={safeExternal(profile.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label={t.whatsapp}><MessageCircle size={20} aria-hidden="true"/></a>}
    {safeExternal(profile.linkedin) && <a href={safeExternal(profile.linkedin)} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><span dir="ltr">in</span></a>}
  </div>;
}

export default function Hero({ t, locale }: { t: Copy; locale: Locale }) {
  const { profile } = portfolio;
  const portrait = assetUrl(profile.portrait);
  return <section className="hero-section container" id="home" aria-labelledby="hero-title">
    <div className="hero-copy">
      <div className="availability"><Sparkles size={15} aria-hidden="true"/>{t.interest}</div>
      <p className="hello">{t.hello} <strong>{profile.name[locale]}</strong></p>
      <p className="hero-role">{profile.role[locale]}</p>
      <h1 id="hero-title">{t.headline}<br/><span className="text-gradient">{t.headlineAccent}</span></h1>
      <p className="hero-description">{t.intro}</p>
      <div className="hero-actions"><a className="btn btn-primary" href="#projects">{t.explore}</a><a className="btn btn-outline" href="#contact">{t.contactMe}</a></div>
      <SocialLinks t={t}/>
    </div>
    <div className="hero-visual" role="img" aria-label={t.visualLabel}>
      <div className="visual-orbit visual-orbit-one" aria-hidden="true"/><div className="visual-orbit visual-orbit-two" aria-hidden="true"/>
      <div className="identity-card">
        {portrait ? <img src={portrait} alt={profile.name[locale]} width="100" height="100" className="portrait"/> : <span className="identity-monogram" dir="ltr">{profile.initials}<i>.</i></span>}
        <div><strong>{profile.name[locale]}</strong><span>{profile.role[locale]}</span></div>
      </div>
      <div className="code-window" aria-hidden="true" dir="ltr">
        <div className="window-bar"><div className="traffic-lights"><i/><i/><i/></div><span className="file-name"><Code2 size={14}/> loay.tsx</span><span className="code-language">TSX</span></div>
        <div className="window-body">
          <div className="code-row"><em>01</em><span><b className="syntax-purple">const</b> developer = <b className="syntax-yellow">{'{'}</b></span></div>
          <div className="code-row"><em>02</em><span>  name: <b className="syntax-cyan">'Loay Mohammed'</b>,</span></div>
          <div className="code-row"><em>03</em><span>  role: <b className="syntax-cyan">'Front-End Developer'</b>,</span></div>
          <div className="code-row"><em>04</em><span>  focus: [<b className="syntax-cyan">'UI'</b>, <b className="syntax-cyan">'Web'</b>],</span></div>
          <div className="code-row"><em>05</em><span>  learning: <b className="syntax-orange">true</b></span></div>
          <div className="code-row"><em>06</em><span><b className="syntax-yellow">{'}'}</b>;</span></div>
          <div className="code-row code-row-last"><em>07</em><span className="syntax-comment">// one thoughtful detail at a time<span className="cursor">|</span></span></div>
        </div>
        <div className="window-status"><span>React + TypeScript</span><span>UTF-8</span></div>
      </div>
      <div className="floating-chip floating-chip-bottom"><span className="floating-icon"><Sparkles size={20}/></span><div><strong>{t.cleanCode}</strong><small>{t.cleanNote}</small></div></div>
    </div>
    <a className="scroll-cue" href="#about">{t.discover}<span aria-hidden="true">↓</span></a>
  </section>;
}
