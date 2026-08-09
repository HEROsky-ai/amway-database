'use client';

import React from 'react';
import { Search, X, Star, Filter, Tag } from 'lucide-react';

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
    <div className="w-full px-4 sm:px-8 max-w-7xl mx-auto my-4">
      <div className="glass-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜尋產品名稱、成分、關鍵字、故障排解、QA..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 text-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Favorite Toggle */}
          <button
            onClick={onToggleFavorites}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              showOnlyFavorites
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border-white/10 hover:text-slate-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>精選/收藏</span>
          </button>

          {/* Reset Filters if any active */}
          {(searchQuery || selectedTag || showOnlyFavorites) && (
            <button
              onClick={() => {
                onSearchChange('');
                onSelectTag(null);
                if (showOnlyFavorites) onToggleFavorites();
              }}
              className="px-3 py-2 text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              清除篩選
            </button>
          )}

          <div className="text-xs text-slate-400 ml-2 hidden lg:block">
            顯示 <span className="text-white font-bold">{totalFilteredCount}</span> 項結果
          </div>
        </div>

      </div>

      {/* Available Tags Carousel / Wrap */}
      {availableTags.length > 0 && (
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0 font-medium">
            <Tag className="w-3.5 h-3.5" /> 標籤熱搜:
          </span>
          {availableTags.slice(0, 10).map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => onSelectTag(isSelected ? null : tag)}
                className={`px-3 py-1 rounded-full text-xs transition-all shrink-0 font-medium border ${
                  isSelected
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800/60 text-slate-300 border-white/5 hover:bg-slate-700/60 hover:border-white/10'
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
