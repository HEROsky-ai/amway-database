'use client';

import React, { useState, useEffect } from 'react';
import { DatabaseItem, CategoryType, CATEGORIES, QAItem } from '@/lib/types';
import { X, Plus, Trash2, Save, Layers, Tag, Sparkles, HelpCircle } from 'lucide-react';

interface EditItemModalProps {
  item: DatabaseItem | null; // null mode = create new
  defaultCategory?: CategoryType;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: DatabaseItem) => void;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  item,
  defaultCategory = 'nutrition',
  isOpen,
  onClose,
  onSave,
}) => {
  const [category, setCategory] = useState<CategoryType>(defaultCategory);
  const [subcategory, setSubcategory] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [highlights, setHighlights] = useState<string[]>(['']);
  const [qaList, setQaList] = useState<QAItem[]>([{ question: '', answer: '' }]);

  useEffect(() => {
    if (item) {
      setCategory(item.category);
      setSubcategory(item.subcategory || '');
      setTitle(item.title || '');
      setSummary(item.summary || '');
      setContent(item.content || '');
      setTagsStr(item.tags ? item.tags.join(', ') : '');
      setHighlights(item.highlights && item.highlights.length > 0 ? item.highlights : ['']);
      setQaList(item.qa && item.qa.length > 0 ? item.qa : [{ question: '', answer: '' }]);
    } else {
      setCategory(defaultCategory);
      setSubcategory('');
      setTitle('');
      setSummary('');
      setContent('');
      setTagsStr('');
      setHighlights(['']);
      setQaList([{ question: '', answer: '' }]);
    }
  }, [item, defaultCategory, isOpen]);

  if (!isOpen) return null;

  const handleAddHighlight = () => {
    setHighlights([...highlights, '']);
  };

  const handleUpdateHighlight = (index: number, val: string) => {
    const copy = [...highlights];
    copy[index] = val;
    setHighlights(copy);
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleAddQA = () => {
    setQaList([...qaList, { question: '', answer: '' }]);
  };

  const handleUpdateQA = (index: number, field: 'question' | 'answer', val: string) => {
    const copy = [...qaList];
    copy[index][field] = val;
    setQaList(copy);
  };

  const handleRemoveQA = (index: number) => {
    setQaList(qaList.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('請填寫產品或內容標題');
      return;
    }

    const cleanedTags = tagsStr
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const cleanedHighlights = highlights.map((h) => h.trim()).filter((h) => h.length > 0);
    const cleanedQA = qaList.filter((q) => q.question.trim() && q.answer.trim());

    const savedItem: DatabaseItem = {
      id: item ? item.id : `item-${Date.now()}`,
      title: title.trim(),
      category,
      subcategory: subcategory.trim() || '通用資訊',
      tags: cleanedTags,
      summary: summary.trim(),
      content: content.trim(),
      highlights: cleanedHighlights,
      qa: cleanedQA,
      isFavorite: item ? item.isFavorite : false,
      updatedAt: new Date().toISOString(),
    };

    onSave(savedItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="glass-modal w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden text-white my-auto">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Save className="w-5 h-5 text-emerald-400" />
            <span>{item ? '編輯資料條目' : '新增資料條目'}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-sm">
          
          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-400" />
                所屬四大分頁 *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.description.slice(0, 15)}...)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                子分類標題 (如: 核心保養/機型比較)
              </label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="例如：基礎營養 / 故障排除 / 90天起步"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              標題名稱 *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：Double X 綜合營養片 (核心全面防護)"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              一句話摘要 / 核心簡介
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="簡短一句話說明重點，方便卡片預覽"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Detailed Content */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              詳細說明與完整內容 (支援換行與列舉)
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="輸入產品詳細成分、規格、使用方法或溝通心法..."
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 resize-y"
            />
          </div>

          {/* Highlights */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <span>關鍵亮點清單</span>
              </label>
              <button
                type="button"
                onClick={handleAddHighlight}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> 新增亮點
              </button>
            </div>

            <div className="space-y-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-5">{i + 1}.</span>
                  <input
                    type="text"
                    value={h}
                    onChange={(e) => handleUpdateHighlight(i, e.target.value)}
                    placeholder="輸入一條產品或事業亮點..."
                    className="flex-1 px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-white text-xs"
                  />
                  {highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(i)}
                      className="p-2 text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Q&A Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>常見問題與解答 (Q&A 答辯庫)</span>
              </label>
              <button
                type="button"
                onClick={handleAddQA}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> 新增 QA
              </button>
            </div>

            <div className="space-y-3">
              {qaList.map((qa, idx) => (
                <div key={idx} className="p-3 bg-slate-900/80 rounded-xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-cyan-400">QA #{idx + 1}</span>
                    {qaList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQA(idx)}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> 刪除
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={qa.question}
                    onChange={(e) => handleUpdateQA(idx, 'question', e.target.value)}
                    placeholder="問題，例如：孕婦可以食用嗎？"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-white/10 rounded-lg text-white text-xs placeholder-slate-500"
                  />
                  <textarea
                    rows={2}
                    value={qa.answer}
                    onChange={(e) => handleUpdateQA(idx, 'answer', e.target.value)}
                    placeholder="完整答辯內容..."
                    className="w-full px-3 py-1.5 bg-slate-950 border border-white/10 rounded-lg text-white text-xs placeholder-slate-500 resize-y"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-indigo-400" />
              標籤 (用逗號隔開)
            </label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="例如：Double X, 綜合維生素, 抗氧化, 明星商品"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="button-secondary text-xs"
            >
              取消
            </button>
            <button
              type="submit"
              className="button-primary text-xs"
            >
              <Save className="w-4 h-4" />
              儲存資料
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
