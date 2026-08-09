'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { EditItemModal } from '@/components/EditItemModal';
import { Header } from '@/components/Header';
import { ItemCard } from '@/components/ItemCard';
import { ItemDetailModal } from '@/components/ItemDetailModal';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { TabNavigation } from '@/components/TabNavigation';
import { exportDataJSON, loadItems, saveItems } from '@/lib/db';
import { INITIAL_ITEMS } from '@/lib/initialData';
import { CategoryType, DatabaseItem } from '@/lib/types';
import { FolderOpen, Plus } from 'lucide-react';

const text = {
  emptyTitle: '\u76ee\u524d\u6c92\u6709\u7b26\u5408\u689d\u4ef6\u7684\u7b46\u8a18',
  emptyCopy: '\u8acb\u8abf\u6574\u641c\u5c0b\u689d\u4ef6\uff0c\u6216\u65b0\u589e\u4e00\u7b46\u5e38\u7528\u8cc7\u6599\u3002',
  add: '\u65b0\u589e\u7b46\u8a18',
};

export default function HomePage() {
  const [items, setItems] = useState<DatabaseItem[]>(INITIAL_ITEMS);
  const [activeTab, setActiveTab] = useState<CategoryType>('nutrition');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<DatabaseItem | null>(null);
  const [itemForEditing, setItemForEditing] = useState<DatabaseItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    loadItems().then((loaded) => {
      if (loaded.length > 0) setItems(loaded);
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
      counts[item.category] += 1;
    });
    return counts;
  }, [items]);

  const filteredItems = useMemo(() => {
    const keyword = searchQuery.toLowerCase().trim();

    return items.filter((item) => {
      if (item.category !== activeTab) return false;
      if (showOnlyFavorites && !item.isFavorite) return false;
      if (!keyword) return true;

      const searchable = [
        item.title,
        item.subcategory,
        item.summary,
        item.content,
        item.imageText || '',
        item.imageUrl || '',
        ...item.tags,
        ...(item.highlights || []),
        ...(item.links || []).flatMap((link) => [link.label, link.url]),
        ...(item.qa || []).flatMap((qa) => [qa.question, qa.answer]),
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(keyword);
    });
  }, [activeTab, items, searchQuery, showOnlyFavorites]);

  useEffect(() => {
    if (selectedItemForDetail && selectedItemForDetail.category !== activeTab) {
      setSelectedItemForDetail(null);
    }
  }, [activeTab, selectedItemForDetail]);

  const handlePersistItems = (nextItems: DatabaseItem[]) => {
    setItems(nextItems);
    saveItems(nextItems);
  };

  const handleSaveItem = (savedItem: DatabaseItem) => {
    const exists = items.some((item) => item.id === savedItem.id);
    const nextItems = exists
      ? items.map((item) => (item.id === savedItem.id ? savedItem : item))
      : [savedItem, ...items];
    handlePersistItems(nextItems);
    setSelectedItemForDetail(savedItem);
  };

  const handleDeleteItem = (id: string) => {
    handlePersistItems(items.filter((item) => item.id !== id));
    if (selectedItemForDetail?.id === id) setSelectedItemForDetail(null);
  };

  const handleToggleFavorite = (id: string) => {
    const nextItems = items.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite, updatedAt: new Date().toISOString() } : item
    );
    handlePersistItems(nextItems);
    const selected = nextItems.find((item) => item.id === selectedItemForDetail?.id);
    if (selected) setSelectedItemForDetail(selected);
  };

  return (
    <div className="app-shell">
      <Header
        onAddNew={() => {
          setItemForEditing(null);
          setIsEditModalOpen(true);
        }}
        onExport={() => exportDataJSON(items)}
        totalCount={items.length}
      />

      <TabNavigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedItemForDetail(null);
        }}
        itemCounts={itemCounts}
      />

      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showOnlyFavorites={showOnlyFavorites}
        onToggleFavorites={() => setShowOnlyFavorites((prev) => !prev)}
        totalFilteredCount={filteredItems.length}
      />

      <main className="container note-workspace">
        <ItemDetailModal
          item={selectedItemForDetail}
          onClose={() => setSelectedItemForDetail(null)}
          onEdit={(itemToEdit) => {
            setItemForEditing(itemToEdit);
            setIsEditModalOpen(true);
          }}
        />

        {filteredItems.length > 0 ? (
          <div className="grid-list">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                isSelected={selectedItemForDetail?.id === item.id}
                onSelect={setSelectedItemForDetail}
                onEdit={(selected) => {
                  setItemForEditing(selected);
                  setIsEditModalOpen(true);
                }}
                onDelete={handleDeleteItem}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FolderOpen size={42} />
            <p className="empty-title">{text.emptyTitle}</p>
            <p className="empty-copy">{text.emptyCopy}</p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setItemForEditing(null);
                setIsEditModalOpen(true);
              }}
            >
              <Plus size={17} />
              <span>{text.add}</span>
            </button>
          </div>
        )}
      </main>

      <EditItemModal
        item={itemForEditing}
        defaultCategory={activeTab}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveItem}
      />
    </div>
  );
}
