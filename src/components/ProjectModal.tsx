import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { assetUrl, safeExternal, type Copy } from '../data';
import type { Locale, Project } from '../types';

export default function ProjectModal({ project, locale, t, onClose }: {
  project: Project; locale: Locale; t: Copy; onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const element = dialog.current!;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const oldOverflow = document.body.style.overflow;
    const oldPadding = document.body.style.paddingInlineEnd;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingInlineEnd = `${scrollbar}px`;
    element.showModal();
    close.current?.focus();
    return () => {
      element.close();
      document.body.style.overflow = oldOverflow;
      document.body.style.paddingInlineEnd = oldPadding;
      opener?.focus({ preventScroll: true });
    };
  }, []);
  return createPortal(<dialog ref={dialog} className="project-modal" aria-labelledby="project-modal-title" aria-describedby="project-modal-description" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }} onKeyDown={event => {
    if (event.key !== 'Tab') return;
    const items = Array.from(dialog.current!.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex="0"]'));
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }}>
    <div className="modal-inner">
      <div className="modal-head"><span className="eyebrow">{t.details}</span><button ref={close} className="icon-button" aria-label={t.close} onClick={onClose}><X size={20}/></button></div>
      <figure className="modal-figure"><img src={assetUrl(project.image)} alt={project.illustrative ? `${t.illustration} — ${project.name[locale]}` : project.name[locale]} width="960" height="600" className="modal-image"/>{project.illustrative && <figcaption>{t.illustration}</figcaption>}</figure>
      <div className="modal-content"><span className="project-category">{project.category === 'training' ? t.training : t.project}</span>
        <h2 id="project-modal-title">{project.name[locale]}</h2><p id="project-modal-description">{project.description[locale]}</p>
        {project.role && <><h3>{t.role}</h3><p>{project.role[locale]}</p></>}
        {project.technologies?.length ? <><h3>{t.technologies}</h3><div className="tags">{project.technologies.map(item => <span key={item} dir="ltr">{item}</span>)}</div></> : <p className="pending-note">{t.pending}</p>}
        <div className="hero-actions">{safeExternal(project.demo) && <a className="btn btn-primary" href={safeExternal(project.demo)} target="_blank" rel="noopener noreferrer">{t.demo}</a>}{safeExternal(project.repository) && <a className="btn btn-outline" href={safeExternal(project.repository)} target="_blank" rel="noopener noreferrer">{t.repository}</a>}</div>
      </div>
    </div>
  </dialog>, document.body);
}
