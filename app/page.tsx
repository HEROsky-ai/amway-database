'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DatabaseItem, CategoryType, CATEGORIES } from '@/lib/types';
import { loadItems, saveItems, exportDataJSON } from '@/lib/db';
import { Header } from '@/components/Header';
import { TabNavigation } from '@/components/TabNavigation';
import { SearchBar } from '@/components/SearchBar';
import { NoteCard } from '@/components/NoteCard';
import { InlineDetailPanel } from '@/components/InlineDetailPanel';
import { EditItemModal } from '@/components/EditItemModal';
import { Plus, Cloud, CloudOff, Loader2 } from 'lucide-react';

type SyncStatus = 'idle' | 'loading' | 'synced' | 'local-only' | 'error';

export default function HomePage() {
  const [items, setItems] = useState<DatabaseItem[]>([]);
  const [activeTab, setActiveTab] = useState<CategoryType>('nutrition');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<DatabaseItem | null>(null);
  const [itemForEditing, setItemForEditing] = useState<DatabaseItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('loading');
  const detailRef = useRef<HTMLDivElement>(null);

  // 初次載入
  useEffect(() => {
    setSyncStatus('loading');
    loadItems().then((loaded) => {
      setItems(loaded);
      setSyncStatus(loaded.length > 0 ? 'synced' : 'idle');
    }).catch(() => {
      setSyncStatus('local-only');
    });
  }, []);

  const handleTabChange = (tab: CategoryType) => {
    setActiveTab(tab);
    setSelectedItem(null);
  };

  const itemCounts = useMemo(() => {
    const counts: Record<CategoryType, number> = {
      nutrition: 0, water: 0, air: 0, business: 0,
    };
    items.forEach((item) => { counts[item.category]++; });
    return counts;
  }, [items]);

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

  const persistItems = async (newItems: DatabaseItem[]) => {
    setItems(newItems);
    setSyncStatus('loading');
    const ok = await saveItems(newItems);
    setSyncStatus(ok ? 'synced' : 'local-only');
  };

  const handleSaveItem = (savedItem: DatabaseItem) => {
    const exists = items.some((i) => i.id === savedItem.id);
    const updated = exists
      ? items.map((i) => (i.id === savedItem.id ? savedItem : i))
      : [savedItem, ...items];
    persistItems(updated);
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
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
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

  // 雲端同步狀態指示
  const SyncBadge = () => {
    const styles: React.CSSProperties = {
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 12, padding: '3px 10px', borderRadius: 20,
      fontWeight: 600, userSelect: 'none',
    };
    if (syncStatus === 'loading') return (
      <span style={{ ...styles, background: '#dbeafe', color: '#1d4ed8' }}>
        <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> 同步中...
      </span>
    );
    if (syncStatus === 'synced') return (
      <span style={{ ...styles, background: '#dcfce7', color: '#15803d' }}>
        <Cloud size={12} /> 已雲端存檔
      </span>
    );
    if (syncStatus === 'local-only') return (
      <span style={{ ...styles, background: '#fef3c7', color: '#92400e', cursor: 'pointer' }}
        title="Supabase 尚未設定完成，資料只存在本機。點此了解如何設定。">
        <CloudOff size={12} /> 僅本機存檔
      </span>
    );
    return null;
  };

  return (
    <>
      <Header
        onAddNew={() => { setItemForEditing(null); setIsEditModalOpen(true); }}
        onExport={() => exportDataJSON(items)}
        totalCount={items.length}
        syncBadge={<SyncBadge />}
      />

      <div className="app-shell">
        <TabNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          itemCounts={itemCounts}
        />

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={(q) => { setSearchQuery(q); setSelectedItem(null); }}
        />

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
                {searchQuery ? '試試其他關鍵字' : '點下方按鈕新增你的第一筆資料'}
              </div>
              {!searchQuery && (
                <button className="btn btn-green"
                  onClick={() => { setItemForEditing(null); setIsEditModalOpen(true); }}>
                  <Plus size={14} /> 新增資料
                </button>
              )}
              {syncStatus === 'local-only' && !searchQuery && (
                <p style={{ fontSize: 13, color: '#92400e', marginTop: 12, padding: '8px 16px',
                  background: '#fef3c7', borderRadius: 8, maxWidth: 400 }}>
                  ⚠️ 雲端資料庫尚未設定完成。請先到 Supabase 執行建表 SQL，
                  否則資料只存在此瀏覽器。
                </p>
              )}
            </div>
          )}

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

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

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
