'use client';

import React from 'react';
import { CATEGORIES, CategoryType } from '@/lib/types';
import { Apple, Briefcase, Droplets, Wind } from 'lucide-react';

interface TabNavigationProps {
  activeTab: CategoryType;
  onTabChange: (tab: CategoryType) => void;
  itemCounts: Record<CategoryType, number>;
}

const renderIcon = (iconName: string) => {
  const props = { size: 24, strokeWidth: 2.1 };
  if (iconName === 'Droplets') return <Droplets {...props} />;
  if (iconName === 'Wind') return <Wind {...props} />;
  if (iconName === 'Briefcase') return <Briefcase {...props} />;
  return <Apple {...props} />;
};

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  itemCounts,
}) => {
  return (
    <div className="container tabs-wrap">
      <nav className="tabs tabs-large" aria-label="categories">
        {CATEGORIES.map((cat) => {
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onTabChange(cat.id)}
              className={`tab-btn tab-card ${isActive ? 'active' : ''}`}
              aria-pressed={isActive}
            >
              <span className="tab-icon tab-icon-large" style={{ color: cat.color }}>
                {renderIcon(cat.iconName)}
              </span>
              <span className="tab-copy">
                <span className="tab-title">{cat.name}</span>
                <span className="tab-desc">{cat.description}</span>
              </span>
              <span className="count-pill">{itemCounts[cat.id] || 0}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
