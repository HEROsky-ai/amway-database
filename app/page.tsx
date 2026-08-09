'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DatabaseItem, CategoryType, CATEGORIES } from '@/lib/types';
import { INITIAL_ITEMS } from '@/lib/initialData';
import { loadItems, saveItems, exportDataJSON } from '@/lib/db';
import { Header } from '@/components/Header';
import { TabNavigation } from '@/components/TabNavigation';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { ItemCard } from '@/components/ItemCard';
import { ItemDetailModal } from '@/components/ItemDetailModal';
import { EditItemModal } from '@/components/EditItemModal';
import { CloudSyncModal } from '@/components/CloudSyncModal';
import { Plus, Search, Sparkles, FolderOpen } from 'lucide-react';

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

  // 初次加載資料
  useEffect(() => {
    loadItems().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setItems(loaded);
      }
    });
  }, []);

  // 計算每個分類的數量
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

  // 當前頁籤中的所有熱門標籤
  const currentTabTags = useMemo(() => {
    const tabItems = items.filter((i) => i.category === activeTab);
    const tagSet = new Set<string>();
    tabItems.forEach((item) => {
      item.tags?.forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet);
  }, [items, activeTab]);

  // 根據 頁籤 + 搜尋關鍵字 + 標籤 + 收藏 進行精準過濾
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. 頁籤分類
      if (item.category !== activeTab) return false;

      // 2. 精選過濾
      if (showOnlyFavorites && !item.isFavorite) return false;

      // 3. 標籤過濾
      if (selectedTag && !item.tags.includes(selectedTag)) return false;

      // 4. 關鍵字搜尋
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

        if (!inTitle && !inSummary && !inContent && !inSubcat && !inTags && !inQA) {
          return false;
        }
      }

      return true;
    });
  }, [items, activeTab, searchQuery, selectedTag, showOnlyFavorites]);

  // 儲存全域變更
  const handlePersistItems = (newItems: DatabaseItem[]) => {
    setItems(newItems);
    saveItems(newItems);
  };

  // 新增 / 編輯 儲存
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

  // 刪除條目
  const handleDeleteItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    handlePersistItems(updated);
    if (selectedItemForDetail?.id === id) {
      setSelectedItemForDetail(null);
    }
  };

  // 切換精選/收藏
  const handleToggleFavorite = (id: string) => {
    const updated = items.map((i) =>
      i.id === id ? { ...i, isFavorite: !i.isFavorite } : i
    );
    handlePersistItems(updated);
    if (selectedItemForDetail?.id === id) {
      setSelectedItemForDetail((prev) =>
        prev ? { ...prev, isFavorite: !prev.isFavorite } : null
      );
    }
  };

  // 匯入 JSON 備份
  const handleImportJSON = (jsonText: string) => {
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed) && parsed.length > 0) {
        handlePersistItems(parsed);
        alert(`成功匯入 ${parsed.length} 筆資料！`);
      } else {
        alert('匯入失敗：JSON 格式不合規');
      }
    } catch (e) {
      alert('無效的 JSON 檔案格式');
    }
  };

  // 重置為預設
  const handleResetDefault = () => {
    handlePersistItems(INITIAL_ITEMS);
  };

  const activeCategoryInfo = CATEGORIES.find((c) => c.id === activeTab) || CATEGORIES[0];

  return (
    <div className="min-h-screen pb-20">
      {/* Top Header */}
      <Header
        onAddNew={() => {
          setItemForEditing(null);
          setIsEditModalOpen(true);
        }}
        onExport={() => exportDataJSON(items)}
        onOpenCloudSync={() => setIsCloudModalOpen(true)}
        totalCount={items.length}
      />

      {/* Main 4 Category Tabs */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedTag(null);
        }}
        itemCounts={itemCounts}
      />

      {/* Search & Filter Bar */}
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

      {/* Category Banner Title */}
      <div className="px-4 sm:px-8 max-w-7xl mx-auto mt-6 mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>{activeCategoryInfo.name}資料庫</span>
            <span className="text-xs text-slate-400 font-normal">
              ({filteredItems.length} 筆項目)
            </span>
          </h2>
        </div>
      </div>

      {/* Grid List */}
      <main className="px-4 sm:px-8 max-w-7xl mx-auto">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
          /* Empty State */
          <div className="glass-panel p-12 text-center max-w-md mx-auto my-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <FolderOpen className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">找不到相關資料</h3>
              <p className="text-slate-400 text-xs">
                目前【{activeCategoryInfo.name}】頁籤下尚無符合條件的條目。
              </p>
            </div>
            <button
              onClick={() => {
                setItemForEditing(null);
                setIsEditModalOpen(true);
              }}
              className="button-primary text-xs mx-auto"
            >
              <Plus className="w-4 h-4" />
              新增第一筆【{activeCategoryInfo.name}】資料
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

      {/* Cloud Sync & Backup Modal */}
      <CloudSyncModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        onImportJSON={handleImportJSON}
        onResetDefault={handleResetDefault}
      />
    </div>
  );
}
