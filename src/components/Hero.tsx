import { Braces, ChevronDown, Code2, Github, Mail, MessageCircleMore, MonitorSmartphone, PanelsTopLeft, Sparkles } from 'lucide-react';
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
    <div className="hero-copy">
      <div className="availability"><Sparkles size={16} aria-hidden="true"/>{t.interest}</div>
      <p className="hello">{t.hello} <strong>{profile.name[locale]}</strong></p>
      <p className="hero-role"><span aria-hidden="true">&lt;/&gt;</span>{profile.role[locale]}</p>
      <h1 id="hero-title">{t.headline}<br/><span className="text-gradient">{t.headlineAccent}</span></h1>
      <p className="hero-description">{t.intro}</p>
      <div className="hero-actions"><a className="btn btn-primary" href="#projects"><PanelsTopLeft size={19} aria-hidden="true"/>{t.explore}</a><a className="btn btn-outline" href="#contact">{t.contactMe}</a></div>
      <div className="hero-social-row"><SocialLinks t={t}/><span className="hero-social-line" aria-hidden="true"/></div>
    </div>
    <div className="hero-visual" role="img" aria-label={t.visualLabel}>
      <div className="design-stage">
        <div className="stage-toolbar" aria-hidden="true"><span className="stage-wordmark" dir="ltr">LM / STUDIO</span><span className="stage-tool"><PanelsTopLeft size={15}/><Code2 size={15}/></span></div>
        <div className="stage-canvas">
          <div className="stage-cross stage-cross-top" aria-hidden="true">+</div><div className="stage-cross stage-cross-bottom" aria-hidden="true">+</div>
          <div className="stage-orbit" aria-hidden="true"/><div className="stage-orbit stage-orbit-inner" aria-hidden="true"/>
          <div className="identity-art">
            {portrait ? <img src={portrait} alt={profile.name[locale]} width="180" height="180" className="portrait"/> : <span className="identity-monogram" dir="ltr">{profile.initials}<i>.</i></span>}
            <span className="identity-art-caption" aria-hidden="true" dir="ltr">DESIGN → DEVELOP → REFINE</span>
          </div>
          <div className="stage-note stage-note-top"><MonitorSmartphone size={23} aria-hidden="true"/><span>{t.responsive}</span></div>
          <div className="stage-note stage-note-bottom"><Braces size={23} aria-hidden="true"/><span>{t.cleanCode}</span></div>
        </div>
        <div className="identity-card"><span className="identity-signature" aria-hidden="true">{profile.initials}</span><div><strong>{profile.name[locale]}</strong><span>{profile.role[locale]}</span></div><span className="identity-symbol" aria-hidden="true">✳</span></div>
      </div>
      <div className="code-window" aria-hidden="true" dir="ltr"><div className="window-bar"><div className="traffic-lights"><i/><i/><i/></div><span className="file-name">loay.tsx</span><Code2 size={15}/></div><div className="window-body"><div><span className="syntax-purple">const</span> focus = <span className="syntax-cyan">'Front-End'</span>;</div><div><span className="syntax-purple">const</span> learning = <span className="syntax-cyan">true</span>;</div></div></div>
    </div>
    <a className="scroll-cue" href="#projects"><span>{t.discover}</span><ChevronDown size={18} aria-hidden="true"/></a>
  </section>;
}
