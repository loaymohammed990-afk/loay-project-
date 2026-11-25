import content from './portfolio.json';
import translations from './i18n.json';
import type { Portfolio, Locale } from '../types';

export const portfolio: Portfolio = {
  ...content,
  projects: content.projects.map(project => {
    if (project.category !== 'project' && project.category !== 'training') throw new Error(`Invalid category: ${project.id}`);
    return { ...project, category: project.category };
  }),
};
export const dictionary = translations;
export type Copy = typeof translations.ar;
export const navigation = ['home', 'about', 'skills', 'projects', 'services', 'contact'] as const;
export function safeExternal(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : undefined;
  } catch { return undefined; }
}
export function assetUrl(value?: string): string | undefined {
  if (!value || !/^\/(?!\/)[\w./-]+$/.test(value) || value.includes('..')) return undefined;
  return `${import.meta.env.BASE_URL}${value.slice(1)}`;
}
export function initialPreference<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return allowed.includes(value as T) ? value as T : fallback;
  } catch { return fallback; }
}
export function setMetadata(locale: Locale) {
  const { profile } = portfolio;
  const title = `${profile.name[locale]} — ${profile.role[locale]}`;
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', dictionary[locale].intro);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', dictionary[locale].intro);
  document.querySelector('meta[property="og:locale"]')?.setAttribute('content', locale === 'ar' ? 'ar_AR' : 'en_US');
}
