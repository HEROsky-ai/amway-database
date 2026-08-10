'use client';

import React from 'react';
import { Search, X, Star, Tag } from 'lucide-react';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  availableTags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  showOnlyFavorites: boolean;
  onToggleFavorites: () => void;
  totalFilteredCount: number;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  onSearchChange,
  availableTags,
  selectedTag,
  onSelectTag,
  showOnlyFavorites,
  onToggleFavorites,
  totalFilteredCount,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 my-3 space-y-3">
      {/* Search Input Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜尋產品名稱、成分、常見問答 QA..."
            className="w-full pl-10 pr-9 py-2 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Favorite Toggle */}
        <button
          onClick={onToggleFavorites}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-all ${
            showOnlyFavorites
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span>精選</span>
        </button>
      </div>

      {/* Tags Filter */}
      {availableTags.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-500 flex items-center gap-1 shrink-0">
            <Tag className="w-3 h-3" /> 熱門:
          </span>
          {availableTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => onSelectTag(isSelected ? null : tag)}
                className={`px-2.5 py-0.5 rounded-lg border transition-all shrink-0 ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                    : 'bg-slate-900/60 text-slate-400 border-white/5 hover:text-slate-200'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
