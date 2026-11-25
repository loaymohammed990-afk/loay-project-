import { useEffect, useState } from 'react';
import { Code2, Figma, Globe2, GraduationCap, LayoutDashboard, Mail, Smartphone, Sparkles, TerminalSquare } from 'lucide-react';
import Header from './components/Header';
import Hero, { SocialLinks } from './components/Hero';
import ProjectModal from './components/ProjectModal';
import ContactForm from './components/ContactForm';
import { assetUrl, dictionary, initialPreference, portfolio, setMetadata } from './data';
import type { Locale, Project } from './types';

function SectionHeading({ tag, title, accent, description }: { tag: string; title: string; accent: string; description: string }) {
  return <div className="section-heading" data-reveal><span className="eyebrow">{tag}</span><h2>{title} <span className="text-gradient">{accent}</span></h2><p>{description}</p></div>;
}
const serviceIcons = { code: Code2, figma: Figma, phone: Smartphone, globe: Globe2, dashboard: LayoutDashboard, sparkles: Sparkles };

export default function App() {
  const [locale, setLocale] = useState<Locale>(() => initialPreference('portfolio-locale', ['ar', 'en'], 'ar'));
  const [theme, setTheme] = useState<'dark' | 'light'>(() => initialPreference('portfolio-theme', ['dark', 'light'], 'dark'));
  const [filter, setFilter] = useState<'all' | 'project' | 'training'>('all');
  const [selected, setSelected] = useState<Project | null>(null);
  const [active, setActive] = useState('home');
  const [cv, setCv] = useState<string>();
  const t = dictionary[locale];
  const { profile } = portfolio;
  useEffect(() => {
    setMetadata(locale);
    try { localStorage.setItem('portfolio-locale', locale); } catch { /* Preferences are optional. */ }
  }, [locale]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#060b15' : '#f7fbfd');
    try { localStorage.setItem('portfolio-theme', theme); } catch { /* Preferences are optional. */ }
  }, [theme]);
  useEffect(() => {
    const controller = new AbortController();
    const path = assetUrl(profile.cv);
    if (path && /\.pdf$/i.test(path)) {
      void fetch(path, { signal: controller.signal }).then(async response => {
        if (!response.ok) return;
        const bytes = new Uint8Array(await response.arrayBuffer());
        if (new TextDecoder().decode(bytes.slice(0, 5)) === '%PDF-') setCv(path);
      }).catch(() => { /* A missing or invalid CV must not create a broken link. */ });
    }
    return () => controller.abort();
  }, [profile.cv]);
  useEffect(() => {
    const reveals = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveals.unobserve(entry.target); }
    }), { threshold: 0.06 });
    document.querySelectorAll('[data-reveal]').forEach(item => reveals.observe(item));
    const sections = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); }), { rootMargin: '-15% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(item => sections.observe(item));
    return () => { reveals.disconnect(); sections.disconnect(); };
  }, [filter]);
  const projects = portfolio.projects.filter(project => filter === 'all' || project.category === filter);

  return <>
    <a className="skip-link" href="#main">{t.skip}</a>
    <div className="site-shell"><div className="page-grid" aria-hidden="true"/>
      <Header t={t} locale={locale} theme={theme} active={active} onLocale={() => setLocale(locale === 'ar' ? 'en' : 'ar')} onTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}/>
      <main id="main" tabIndex={-1}>
        <Hero t={t} locale={locale}/>
        <div className="specialty-bar"><div className="container">{[t.frontend, t.responsive, t.thoughtful, t.learning].map(item => <span key={item}><span aria-hidden="true">✳</span>{item}</span>)}</div></div>
        <section className="section about-section" id="about"><div className="container">
          <SectionHeading tag={t.aboutTag} title={t.aboutTitle} accent={t.aboutAccent} description={t.aboutIntro}/>
          <div className="about-layout"><div className="about-story" data-reveal><span className="about-quote" aria-hidden="true">“</span><h3>{t.aboutQuote}</h3><p>{t.bio}</p><p>{t.bioMore}</p>{cv && <a className="btn btn-outline" href={cv} download>{t.cv}</a>}</div>
            <div className="about-highlights" data-reveal>{[{ icon: GraduationCap, title: t.education, value: profile.education[locale] }, { icon: TerminalSquare, title: t.experience, value: t.experienceValue }, { icon: Code2, title: t.focus, value: profile.role[locale] }].map(({ icon: Icon, title, value }) => <div className="about-card" key={title}><span className="about-card-icon"><Icon size={24} aria-hidden="true"/></span><h3>{title}</h3><p>{value}</p></div>)}</div>
          </div>
        </div></section>
        <section className="section skills-section" id="skills"><div className="container">
          <SectionHeading tag={t.skillsTag} title={t.skillsTitle} accent={t.skillsAccent} description={t.skillsIntro}/>
          <div className="skills-layout"><div className="skills-feature" data-reveal><div className="skills-feature-top"><TerminalSquare size={25} aria-hidden="true"/><span>{t.toolbox}</span></div><div className="skills-graphic" aria-hidden="true"><div className="graphic-ring ring-one"/><div className="graphic-ring ring-two"/><div className="graphic-core"><Code2 size={48}/></div></div><h3>{t.toolQuote}</h3><p>{t.toolNote}</p></div>
            <div className="skills-groups">{portfolio.skillGroups.map(group => <div className="skill-group" key={group.id} data-reveal><h3>{group.title[locale]}</h3><div className="skill-pills">{group.items.map(item => <span key={item} dir="ltr">{item}</span>)}</div></div>)}</div>
          </div>
        </div></section>
        <section className="section projects-section" id="projects"><div className="container">
          <div className="projects-header"><SectionHeading tag={t.projectsTag} title={t.projectsTitle} accent={t.projectsAccent} description={t.projectsIntro}/><div className="project-filters" role="group" aria-label={t.filterLabel}>{(['all', 'project', 'training'] as const).map(value => <button type="button" key={value} aria-pressed={filter === value} onClick={() => setFilter(value)} className={filter === value ? 'filter-active' : ''}>{value === 'all' ? t.all : value === 'project' ? t.projectFilter : t.trainingFilter}</button>)}</div></div>
          <div className="projects-grid">{projects.map(project => <article className="project-card" key={project.id} data-reveal>
            <button className="project-cover" onClick={() => setSelected(project)} aria-label={`${t.details} — ${project.name[locale]}${project.illustrative ? ` — ${t.illustration}` : ''}`}><img src={assetUrl(project.image)} width="960" height="600" alt={project.illustrative ? `${t.illustration} — ${project.name[locale]}` : project.name[locale]} loading="lazy"/>{project.illustrative && <span className="project-cover-note">{t.illustration}</span>}</button>
            <div className="project-info"><span className={`project-category ${project.category === 'training' ? 'training-badge' : ''}`}>{project.category === 'training' ? t.training : t.project}</span><h3>{project.name[locale]}</h3><p className="project-description">{project.description[locale]}</p><button className="text-link" onClick={() => setSelected(project)}>{t.details}</button></div>
          </article>)}</div><p className="projects-disclaimer">{t.projectNote}</p>
        </div></section>
        <section className="section services-section" id="services"><div className="container">
          <SectionHeading tag={t.servicesTag} title={t.servicesTitle} accent={t.servicesAccent} description={t.servicesIntro}/>
          <div className="services-grid">{portfolio.services.map(service => { const Icon = serviceIcons[service.icon as keyof typeof serviceIcons] ?? Code2; return <article className="service-card" key={service.id} data-reveal><span className="service-icon"><Icon size={25} aria-hidden="true"/></span><h3>{service.title[locale]}</h3><p>{service.description[locale]}</p><a className="text-link" href="#contact" aria-label={`${t.serviceContact} — ${service.title[locale]}`}>{t.serviceContact}</a></article>; })}</div>
          <div className="process-line" data-reveal><h3>{t.process}</h3><ol>{t.steps.map(step => <li key={step}>{step}</li>)}</ol></div>
        </div></section>
        <section className="section contact-section" id="contact"><div className="container contact-grid">
          <div className="contact-copy" data-reveal><span className="eyebrow">{t.contactTag}</span><h2>{t.contactTitle}<br/><span className="text-gradient">{t.contactAccent}</span></h2><p>{t.contactIntro}</p><div className="contact-channels"><div className="contact-item"><span className="contact-item-icon"><Mail size={21} aria-hidden="true"/></span><div><small>{t.email}</small><a href={`mailto:${profile.email}`} dir="ltr">{profile.email}</a></div></div><div className="contact-item"><span className="contact-item-icon"><Smartphone size={21} aria-hidden="true"/></span><div><small>{t.phone}</small><a href={`tel:${profile.phone}`} dir="ltr">{profile.phone}</a></div></div></div><SocialLinks t={t}/></div>
          <div data-reveal><ContactForm t={t}/></div>
        </div></section>
      </main>
      <footer className="footer"><div className="container footer-inner"><a className="footer-brand" href="#home" aria-label={`LM. — ${t.homeLabel}`} dir="ltr">LM<span>.</span></a><p>{profile.name[locale]} · {profile.role[locale]}<br/>© {new Date().getFullYear()} · {t.rights}</p><a className="back-top" href="#home">{t.backTop}</a></div></footer>
    </div>
    {selected && <ProjectModal project={selected} locale={locale} t={t} onClose={() => setSelected(null)}/>}
  </>;
}



