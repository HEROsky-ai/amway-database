'use client';

import React from 'react';
import { CATEGORIES, CategoryType } from '@/lib/types';
import { Apple, Droplets, Wind, Briefcase } from 'lucide-react';

interface TabNavigationProps {
  activeTab: CategoryType;
  onTabChange: (tab: CategoryType) => void;
  itemCounts: Record<CategoryType, number>;
}

const IconMap: Record<string, React.FC<{ size: number; color: string }>> = {
  Apple: ({ size, color }) => <Apple size={size} color={color} />,
  Droplets: ({ size, color }) => <Droplets size={size} color={color} />,
  Wind: ({ size, color }) => <Wind size={size} color={color} />,
  Briefcase: ({ size, color }) => <Briefcase size={size} color={color} />,
};

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  itemCounts,
}) => {
  return (
    <div className="tab-grid">
      {CATEGORIES.map((cat) => {
        const isActive = activeTab === cat.id;
        const Icon = IconMap[cat.iconName] || IconMap['Apple'];
        const count = itemCounts[cat.id] || 0;

        return (
          <button
            key={cat.id}
            onClick={() => onTabChange(cat.id)}
            className={`tab-card${isActive ? ' active' : ''}`}
            style={{ ['--tab-color' as string]: cat.color }}
          >
            <div className="tab-icon" style={{ border: `1px solid ${isActive ? cat.color + '50' : 'var(--border)'}` }}>
              <Icon size={20} color={isActive ? cat.color : 'var(--text-muted)'} />
            </div>
            <div className="tab-info">
              <div className="tab-name">{cat.name}</div>
              <div className="tab-desc">{cat.description}</div>
            </div>
            <span className="tab-count">{count}</span>
          </button>
        );
      })}
    </div>
  );
};
