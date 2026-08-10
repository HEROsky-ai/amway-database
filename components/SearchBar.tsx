'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="search-wrap">
      <Search className="search-icon" size={16} />
      <input
        type="text"
        className="search-input"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="搜尋標題、內容、QA 問答、摘要、亮點..."
      />
      {searchQuery && (
        <button className="search-clear" onClick={() => onSearchChange('')}>
          <X size={15} />
        </button>
      )}
    </div>
  );
};
