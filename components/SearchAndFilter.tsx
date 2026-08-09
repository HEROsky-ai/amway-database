'use client';

import React from 'react';
import { Search, Star, X } from 'lucide-react';

const text = {
  aria: '\u641c\u5c0b\u8207\u7be9\u9078',
  placeholder: '\u641c\u5c0b\u6a19\u984c\u3001\u6458\u8981\u3001\u5167\u5bb9\u3001Q&A\u3001\u9023\u7d50\u6216\u5716\u7247\u6587\u5b57',
  clear: '\u6e05\u9664\u641c\u5c0b',
  favorite: '\u6536\u85cf',
  showing: '\u986f\u793a',
  records: '\u7b46',
};

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  showOnlyFavorites: boolean;
  onToggleFavorites: () => void;
  totalFilteredCount: number;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  onSearchChange,
  showOnlyFavorites,
  onToggleFavorites,
  totalFilteredCount,
}) => {
  return (
    <section className="container toolbar" aria-label={text.aria}>
      <div className="search-row compact">
        <div className="search-box">
          <Search size={18} />
          <input
            className="field search-field"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={text.placeholder}
          />
          {searchQuery && (
            <button
              className="icon-btn clear-search"
              type="button"
              onClick={() => onSearchChange('')}
              title={text.clear}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleFavorites}
          className={`btn-secondary favorite-toggle ${showOnlyFavorites ? 'active' : ''}`}
        >
          <Star size={16} fill={showOnlyFavorites ? 'currentColor' : 'none'} />
          <span>{text.favorite}</span>
        </button>

        <div className="filter-meta">
          {text.showing} {totalFilteredCount} {text.records}
        </div>
      </div>
    </section>
  );
};
