'use client';

import React from 'react';
import { CATEGORIES, CategoryType } from '@/lib/types';
import { Apple, Droplets, Wind, Briefcase } from 'lucide-react';

interface TabNavigationProps {
  activeTab: CategoryType;
  onTabChange: (tab: CategoryType) => void;
  itemCounts: Record<CategoryType, number>;
}

const renderIcon = (iconName: string, active: boolean) => {
  const iconProps = { className: 'w-4 h-4' };
  switch (iconName) {
    case 'Apple':
      return <Apple {...iconProps} />;
    case 'Droplets':
      return <Droplets {...iconProps} />;
    case 'Wind':
      return <Wind {...iconProps} />;
    case 'Briefcase':
      return <Briefcase {...iconProps} />;
    default:
      return <Apple {...iconProps} />;
  }
};

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  itemCounts,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-2">
      <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 grid grid-cols-2 md:grid-cols-4 gap-1.5">
        {CATEGORIES.map((cat) => {
          const isActive = activeTab === cat.id;
          const count = itemCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onTabChange(cat.id)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {renderIcon(cat.iconName, isActive)}
              <span>{cat.name}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
