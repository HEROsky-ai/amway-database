'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DatabaseItem, CategoryType, CATEGORIES } from '@/lib/types';
import { INITIAL_ITEMS } from '@/lib/initialData';
import { loadItems, saveItems, exportDataJSON } from '@/lib/db';
import { Header } from '@/components/Header';
import { TabNavigation } from '@/components/TabNavigation';
import { SearchBar } from '@/components/SearchBar';
import { NoteCard } from '@/components/NoteCard';
import { InlineDetailPanel } from '@/components/InlineDetailPanel';
import { EditItemModal } from '@/components/EditItemModal';
import { Plus, FolderOpen } from 'lucide-react';

export default function HomePage() {
  const [items, setItems] = useState<DatabaseItem[]>(INITIAL_ITEMS);
  const [activeTab, setActiveTab] = useState<CategoryType>('nutrition');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<DatabaseItem | null>(null);
  const [itemForEditing, setItemForEditing] = useState<DatabaseItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

  // 初次載入
  useEffect(() => {
    loadItems().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setItems(loaded);
      }
    });
  }, []);

  // 切換 tab 時清除 selected
  const handleTabChange = (tab: CategoryType) => {
    setActiveTab(tab);
    setSelectedItem(null);
  };

  // 計算每個分類數量
  const itemCounts = useMemo(() => {
    const counts: Record<CategoryType, number> = {
      nutrition: 0, water: 0, air: 0, business: 0,
    };
    items.forEach((item) => { counts[item.category]++; });
    return counts;
  }, [items]);

  // 過濾邏輯：全文搜尋 (標題、摘要、內容、子分類、亮點、QA、標籤)
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (item.category !== activeTab) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.subcategory.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q)) ||
        item.highlights?.some((h) => h.toLowerCase().includes(q)) ||
        item.qa?.some(
          (qa) => qa.question.toLowerCase().includes(q) || qa.answer.toLowerCase().includes(q)
        )
      );
    });
  }, [items, activeTab, searchQuery]);

  const persistItems = (newItems: DatabaseItem[]) => {
    setItems(newItems);
    saveItems(newItems);
  };

  const handleSaveItem = (savedItem: DatabaseItem) => {
    const exists = items.some((i) => i.id === savedItem.id);
    const updated = exists
      ? items.map((i) => (i.id === savedItem.id ? savedItem : i))
      : [savedItem, ...items];
    persistItems(updated);
    // update selected if it was edited
    if (selectedItem?.id === savedItem.id) setSelectedItem(savedItem);
  };

  const handleDeleteItem = (id: string) => {
    persistItems(items.filter((i) => i.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  const handleToggleFavorite = (id: string) => {
    persistItems(items.map((i) => (i.id === id ? { ...i, isFavorite: !i.isFavorite } : i)));
  };

  const handleSelectCard = (item: DatabaseItem) => {
    if (selectedItem?.id === item.id) {
      setSelectedItem(null); // toggle off
    } else {
      setSelectedItem(item);
      // Smooth scroll to detail panel after render
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
  };

  const openEditFor = (it: DatabaseItem) => {
    setItemForEditing(it);
    setIsEditModalOpen(true);
  };

  const catInfo = CATEGORIES.find((c) => c.id === activeTab) || CATEGORIES[0];

  return (
    <>
      <Header
        onAddNew={() => { setItemForEditing(null); setIsEditModalOpen(true); }}
        onExport={() => exportDataJSON(items)}
        totalCount={items.length}
      />

      <div className="app-shell">
        {/* 4-column tab cards */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          itemCounts={itemCounts}
        />

        {/* Search */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={(q) => { setSearchQuery(q); setSelectedItem(null); }}
        />

        {/* Section meta */}
        <div className="content-section">
          <div className="section-meta">
            <span className="section-title">
              <span style={{ color: catInfo.color }}>●</span>
              {catInfo.name}
            </span>
            <span className="section-count">
              {filteredItems.length} 筆{searchQuery ? ' 搜尋結果' : ' 筆記'}
            </span>
          </div>

          {/* Notes Grid */}
          {filteredItems.length > 0 ? (
            <div className="notes-grid">
              {filteredItems.map((item) => (
                <NoteCard
                  key={item.id}
                  item={item}
                  isSelected={selectedItem?.id === item.id}
                  onSelect={handleSelectCard}
                  onEdit={openEditFor}
                  onDelete={handleDeleteItem}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🗂️</div>
              <div className="empty-state-title">
                {searchQuery ? '找不到相符的筆記' : '尚未有任何筆記'}
              </div>
              <div className="empty-state-desc">
                {searchQuery ? `試試其他關鍵字` : '點下方按鈕新增你的第一筆資料'}
              </div>
              {!searchQuery && (
                <button className="btn btn-green" onClick={() => { setItemForEditing(null); setIsEditModalOpen(true); }}>
                  <Plus size={14} /> 新增資料
                </button>
              )}
            </div>
          )}

          {/* Inline Detail Panel - shown below the grid */}
          {selectedItem && (
            <div ref={detailRef} style={{ marginTop: 20 }}>
              <InlineDetailPanel
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                onEdit={(it) => { openEditFor(it); }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Edit / New Modal */}
      <EditItemModal
        item={itemForEditing}
        defaultCategory={activeTab}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveItem}
      />
    </>
  );
}
