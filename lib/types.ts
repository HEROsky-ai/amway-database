export type CategoryType = 'nutrition' | 'water' | 'air' | 'business';

export interface QAItem {
  question: string;
  answer: string;
}

export interface LinkItem {
  label: string;
  url: string;
}

export interface DatabaseItem {
  id: string;
  title: string;
  category: CategoryType;
  subcategory: string;
  tags: string[];
  summary: string;
  content: string;
  highlights?: string[];
  qa?: QAItem[];
  links?: LinkItem[];
  imageUrl?: string;
  isFavorite?: boolean;
  updatedAt: string;
}

export interface CategoryInfo {
  id: CategoryType;
  name: string;
  iconName: string;
  description: string;
  color: string;
  bgGradient: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'nutrition',
    name: '營養保健',
    iconName: 'Apple',
    description: '鈕崔萊 Nutrilite 核心保健、維生素與成分全解析',
    color: '#10b981',
    bgGradient: 'from-emerald-500/10 to-teal-500/5',
  },
  {
    id: 'water',
    name: '淨水器',
    iconName: 'Droplets',
    description: 'eSpring 益之源淨水器規格、濾心維護與故障排除',
    color: '#06b6d4',
    bgGradient: 'from-cyan-500/10 to-blue-500/5',
  },
  {
    id: 'air',
    name: '空氣清淨機',
    iconName: 'Wind',
    description: 'Atmosphere 逸新清淨機 HEPA 技術、效能與保養',
    color: '#6366f1',
    bgGradient: 'from-indigo-500/10 to-violet-500/5',
  },
  {
    id: 'business',
    name: '事業與起步',
    iconName: 'Briefcase',
    description: '獎金制度、新手起步 90 天心法與溝通應答庫',
    color: '#f59e0b',
    bgGradient: 'from-amber-500/10 to-orange-500/5',
  },
];
