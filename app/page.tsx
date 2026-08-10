'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DatabaseItem, CategoryType } from '@/lib/types';
import { INITIAL_ITEMS } from '@/lib/initialData';
import { loadItems, saveItems, exportDataJSON } from '@/lib/db';
import { Header } from '@/components/Header';
import { TabNavigation } from '@/components/TabNavigation';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { ItemCard } from '@/components/ItemCard';
import { ItemDetailModal } from '@/components/ItemDetailModal';
import { EditItemModal } from '@/components/EditItemModal';
import { CloudSyncModal } from '@/components/CloudSyncModal';
import { Plus, FolderOpen } from 'lucide-react';

export default function HomePage() {
  const [items, setItems] = useState<DatabaseItem[]>(INITIAL_ITEMS);
  const [activeTab, setActiveTab] = useState<CategoryType>('nutrition');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Modals state
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<DatabaseItem | null>(null);
  const [itemForEditing, setItemForEditing] = useState<DatabaseItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);

  useEffect(() => {
    loadItems().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setItems(loaded);
      }
    });
  }, []);

  const itemCounts = useMemo(() => {
    const counts: Record<CategoryType, number> = {
      nutrition: 0,
      water: 0,
      air: 0,
      business: 0,
    };
    items.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      }
    });
    return counts;
  }, [items]);

  const currentTabTags = useMemo(() => {
    const tabItems = items.filter((i) => i.category === activeTab);
    const tagSet = new Set<string>();
    tabItems.forEach((item) => {
      item.tags?.forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet);
  }, [items, activeTab]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (item.category !== activeTab) return false;
      if (showOnlyFavorites && !item.isFavorite) return false;
      if (selectedTag && !item.tags.includes(selectedTag)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(q);
        const inSummary = item.summary.toLowerCase().includes(q);
        const inContent = item.content.toLowerCase().includes(q);
        const inSubcat = item.subcategory.toLowerCase().includes(q);
        const inTags = item.tags.some((t) => t.toLowerCase().includes(q));
        const inQA = item.qa?.some(
          (qa) => qa.question.toLowerCase().includes(q) || qa.answer.toLowerCase().includes(q)
        );
        const inFiles = item.attachments?.some((f) => f.name.toLowerCase().includes(q));

        if (!inTitle && !inSummary && !inContent && !inSubcat && !inTags && !inQA && !inFiles) {
          return false;
        }
      }

      return true;
    });
  }, [items, activeTab, searchQuery, selectedTag, showOnlyFavorites]);

  const handlePersistItems = (newItems: DatabaseItem[]) => {
    setItems(newItems);
    saveItems(newItems);
  };

  const handleSaveItem = (savedItem: DatabaseItem) => {
    const exists = items.some((i) => i.id === savedItem.id);
    let updated: DatabaseItem[];
    if (exists) {
      updated = items.map((i) => (i.id === savedItem.id ? savedItem : i));
    } else {
      updated = [savedItem, ...items];
    }
    handlePersistItems(updated);
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    handlePersistItems(updated);
    if (selectedItemForDetail?.id === id) {
      setSelectedItemForDetail(null);
    }
  };

  const handleToggleFavorite = (id: string) => {
    const updated = items.map((i) =>
      i.id === id ? { ...i, isFavorite: !i.isFavorite } : i
    );
    handlePersistItems(updated);
  };

  const handleImportJSON = (jsonText: string) => {
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed) && parsed.length > 0) {
        handlePersistItems(parsed);
        alert(`成功匯入 ${parsed.length} 筆資料！`);
      }
    } catch (e) {
      alert('無效的 JSON 檔案格式');
    }
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <Header
        onAddNew={() => {
          setItemForEditing(null);
          setIsEditModalOpen(true);
        }}
        onExport={() => exportDataJSON(items)}
        onOpenCloudSync={() => setIsCloudModalOpen(true)}
        totalCount={items.length}
      />

      {/* Segmented Control 4 Tabs */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedTag(null);
        }}
        itemCounts={itemCounts}
      />

      {/* Search & Tags */}
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        availableTags={currentTabTags}
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
        showOnlyFavorites={showOnlyFavorites}
        onToggleFavorites={() => setShowOnlyFavorites((prev) => !prev)}
        totalFilteredCount={filteredItems.length}
      />

      {/* Items Grid List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onSelect={setSelectedItemForDetail}
                onEdit={(it) => {
                  setItemForEditing(it);
                  setIsEditModalOpen(true);
                }}
                onDelete={handleDeleteItem}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="clean-card p-12 text-center max-w-sm mx-auto my-12 space-y-3">
            <FolderOpen className="w-10 h-10 mx-auto text-slate-500" />
            <p className="text-slate-300 font-semibold text-sm">尚無相關項目</p>
            <button
              onClick={() => {
                setItemForEditing(null);
                setIsEditModalOpen(true);
              }}
              className="btn-primary text-xs mx-auto"
            >
              <Plus className="w-4 h-4" /> 新增資料
            </button>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <ItemDetailModal
        item={selectedItemForDetail}
        onClose={() => setSelectedItemForDetail(null)}
        onEdit={(itemToEdit) => {
          setSelectedItemForDetail(null);
          setItemForEditing(itemToEdit);
          setIsEditModalOpen(true);
        }}
      />

      {/* Create / Edit Modal */}
      <EditItemModal
        item={itemForEditing}
        defaultCategory={activeTab}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveItem}
      />

      {/* Cloud Sync & Permanent Database Setup */}
      <CloudSyncModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        onImportJSON={handleImportJSON}
        onResetDefault={() => handlePersistItems(INITIAL_ITEMS)}
      />
    </div>
  );
}
