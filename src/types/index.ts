export type Locale = 'ar' | 'en';
export type Localized = Record<Locale, string>;
export interface Project {
  id: string;
  name: Localized;
  category: 'project' | 'training';
  description: Localized;
  image: string;
  illustrative: boolean;
  technologies?: string[];
  role?: Localized;
  demo?: string;
  repository?: string;
}
export interface Portfolio {
  profile: {
    name: Localized;
    initials: string;
    role: Localized;
    education: Localized;
    email: string;
    phone: string;
    github: string;
    whatsapp: string;
    portrait?: string;
    cv?: string;
    linkedin?: string;
  };
  skillGroups: { id: string; title: Localized; items: string[] }[];
  projects: Project[];
  services: { id: string; icon: string; title: Localized; description: Localized }[];
}
