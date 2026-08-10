export type CategoryType = 'nutrition' | 'water' | 'air' | 'business';

export interface QAItem {
  question: string;
  answer: string;
}

export interface LinkItem {
  label: string;
  url: string;
}

export interface AttachmentItem {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
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
  attachments?: AttachmentItem[];
  imageUrl?: string;
  imageText?: string;
  isFavorite?: boolean;
  updatedAt: string;
}

export interface CategoryInfo {
  id: CategoryType;
  name: string;
  iconName: string;
  description: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'nutrition',
    name: '\u71df\u990a\u4fdd\u5065',
    iconName: 'Apple',
    description: '\u7522\u54c1\u91cd\u9ede\u8207\u65e5\u5e38\u4fdd\u990a\u7b46\u8a18',
    color: '#087f5b',
  },
  {
    id: 'water',
    name: '\u6de8\u6c34\u79d1\u6280',
    iconName: 'Droplets',
    description: 'eSpring \u8207\u98f2\u6c34\u76f8\u95dc\u8cc7\u6599',
    color: '#0b7891',
  },
  {
    id: 'air',
    name: '\u7a7a\u6c23\u54c1\u8cea',
    iconName: 'Wind',
    description: '\u7a7a\u6c23\u6e05\u6de8\u8207\u5c45\u5bb6\u74b0\u5883',
    color: '#4f46e5',
  },
  {
    id: 'business',
    name: '\u4e8b\u696d\u7d93\u71df',
    iconName: 'Briefcase',
    description: '\u9080\u7d04\u3001\u8ddf\u9032\u8207\u670d\u52d9\u7b46\u8a18',
    color: '#b7791f',
  },
];
