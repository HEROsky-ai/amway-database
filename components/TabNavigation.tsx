'use client';

import React from 'react';
import { CATEGORIES, CategoryType } from '@/lib/types';
import { Apple, Droplets, Wind, Briefcase } from 'lucide-react';

interface TabNavigationProps {
  activeTab: CategoryType;
  onTabChange: (tab: CategoryType) => void;
  itemCounts: Record<CategoryType, number>;
}

const renderIcon = (iconName: string, active: boolean, color: string) => {
  const iconProps = {
    className: `w-5 h-5 transition-transform duration-200 ${active ? 'scale-110' : ''}`,
    style: { color: active ? color : undefined },
  };

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
    <div className="w-full px-4 sm:px-8 max-w-7xl mx-auto my-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CATEGORIES.map((cat) => {
          const isActive = activeTab === cat.id;
          const count = itemCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onTabChange(cat.id)}
              className={`relative flex items-center justify-between p-4 rounded-xl border transition-all duration-300 text-left cursor-pointer ${
                isActive
                  ? 'bg-slate-800/90 border-white/20 shadow-xl shadow-black/40 translate-y-[-2px]'
                  : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-slate-800/50 hover:border-white/10'
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <div
                  className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full shadow-lg"
                  style={{ backgroundColor: cat.color }}
                />
              )}

              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-lg transition-colors ${
                    isActive ? 'bg-white/10' : 'bg-slate-800/50'
                  }`}
                >
                  {renderIcon(cat.iconName, isActive, cat.color)}
                </div>
                <div>
                  <h3
                    className={`font-bold text-base transition-colors ${
                      isActive ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 hidden sm:block line-clamp-1">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Badge Count */}
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'bg-slate-800 text-slate-500'
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
