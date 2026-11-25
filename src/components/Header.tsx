import { useEffect, useRef, useState } from 'react';
import { Menu, Moon, SunMedium, X } from 'lucide-react';
import { navigation, type Copy } from '../data';
import type { Locale } from '../types';

export default function Header({ t, locale, theme, active, onLocale, onTheme }: {
  t: Copy; locale: Locale; theme: 'dark' | 'light'; active: string; onLocale: () => void; onTheme: () => void;
}) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) document.querySelector<HTMLAnchorElement>('#main-navigation a')?.focus();
  }, [open]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) { setOpen(false); toggle.current?.focus(); }
    };
    const resize = () => { if (window.innerWidth > 970) setOpen(false); };
    window.addEventListener('keydown', close);
    window.addEventListener('resize', resize);
    return () => { window.removeEventListener('keydown', close); window.removeEventListener('resize', resize); };
  }, [open]);
  return <header className="site-header">
    <div className="container nav-wrap" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      <a className="brand" href="#home" aria-label={`LM . loay/ — ${t.homeLabel}`} onClick={() => setOpen(false)}>
        <span className="brand-mark" dir="ltr">LM<span>.</span></span><span className="brand-text" dir="ltr">loay<span>/</span></span>
      </a>
      <nav id="main-navigation" aria-label={t.navigation} className={`desktop-nav ${open ? 'nav-open' : ''}`}>
        {navigation.map(id => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} className={active === id ? 'nav-active' : ''} onClick={() => setOpen(false)}>{t.nav[id]}</a>)}
      </nav>
      <div className="nav-actions">
        <button className="icon-button language-button" onClick={onLocale} aria-label={`${locale === 'ar' ? 'EN' : 'AR'} — ${t.switchLanguage}`} lang={locale === 'ar' ? 'en' : 'ar'}>{locale === 'ar' ? 'EN' : 'AR'}</button>
        <button className="icon-button theme-button" onClick={onTheme} aria-label={theme === 'dark' ? t.light : t.dark}>{theme === 'dark' ? <SunMedium key="sun" size={20} aria-hidden="true"/> : <Moon key="moon" size={20} aria-hidden="true"/>}</button>
        <a className="nav-contact" href="#contact">{t.talk}</a>
        <button ref={toggle} className="icon-button mobile-menu-button" onClick={() => setOpen(!open)} aria-controls="main-navigation" aria-expanded={open} aria-label={open ? t.closeMenu : t.openMenu}>{open ? <X size={22}/> : <Menu size={22}/>}</button>
      </div>
    </div>
  </header>;
}

