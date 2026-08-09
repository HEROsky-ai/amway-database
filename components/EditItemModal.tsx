'use client';

import React, { useEffect, useState } from 'react';
import { CATEGORIES, CategoryType, DatabaseItem, QAItem } from '@/lib/types';
import { HelpCircle, Image as ImageIcon, Layers, Plus, Save, Sparkles, Trash2, X } from 'lucide-react';

const text = {
  edit: '\u7de8\u8f2f\u7b46\u8a18',
  add: '\u65b0\u589e\u7b46\u8a18',
  intro: '\u4ee5\u6458\u8981\u3001\u8a73\u7d30\u5167\u5bb9\u3001\u91cd\u9ede\u8207 Q&A \u7d44\u6210\u4e00\u5247\u597d\u641c\u5c0b\u7684\u7b46\u8a18\u3002',
  close: '\u95dc\u9589',
  category: '\u5206\u985e',
  subcategory: '\u5b50\u5206\u985e',
  subcategoryPlaceholder: '\u4f8b\u5982\uff1aDouble X\u3001eSpring\u3001\u9080\u7d04\u8a71\u8853',
  title: '\u6a19\u984c',
  titlePlaceholder: '\u8f38\u5165\u9019\u7b46\u7b46\u8a18\u7684\u4e3b\u984c',
  summary: '\u4e00\u53e5\u8a71\u6458\u8981',
  summaryPlaceholder: '\u7528\u4e00\u53e5\u8a71\u8aaa\u660e\u9019\u7b46\u7b46\u8a18\u9069\u5408\u54ea\u500b\u60c5\u5883',
  content: '\u8a73\u7d30\u5167\u5bb9',
  contentPlaceholder: '\u8f38\u5165\u5b8c\u6574\u8aaa\u660e\u3001\u8a71\u8853\u3001\u6d41\u7a0b\u6216\u6ce8\u610f\u4e8b\u9805',
  imageText: '\u5716\u7247\u6587\u5b57',
  imageTextPlaceholder: '\u5982\u679c\u5716\u7247\u4e0a\u6709\u6587\u5b57\uff0c\u8acb\u8cbc\u5728\u9019\u88e1\uff0c\u641c\u5c0b\u6642\u6703\u4e00\u8d77\u627e\u5230',
  highlights: '\u91cd\u9ede\u6574\u7406',
  addHighlight: '\u65b0\u589e\u91cd\u9ede',
  highlightPlaceholder: '\u8f38\u5165\u4e00\u500b\u53ef\u76f4\u63a5\u8907\u88fd\u4f7f\u7528\u7684\u91cd\u9ede',
  qa: 'Q&A',
  addQa: '\u65b0\u589e Q&A',
  questionPlaceholder: '\u9867\u5ba2\u53ef\u80fd\u6703\u554f\u7684\u554f\u984c',
  answerPlaceholder: '\u5efa\u8b70\u56de\u7b54',
  remove: '\u79fb\u9664',
  cancel: '\u53d6\u6d88',
  save: '\u5132\u5b58\u7b46\u8a18',
  missingTitle: '\u8acb\u5148\u8f38\u5165\u7b46\u8a18\u6a19\u984c\u3002',
  general: '\u4e00\u822c\u7b46\u8a18',
};

interface EditItemModalProps {
  item: DatabaseItem | null;
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
  const [imageText, setImageText] = useState('');
  const [highlights, setHighlights] = useState<string[]>(['']);
  const [qaList, setQaList] = useState<QAItem[]>([{ question: '', answer: '' }]);

  useEffect(() => {
    if (!isOpen) return;

    if (item) {
      setCategory(item.category);
      setSubcategory(item.subcategory || '');
      setTitle(item.title || '');
      setSummary(item.summary || '');
      setContent(item.content || '');
      setImageText(item.imageText || '');
      setHighlights(item.highlights?.length ? item.highlights : ['']);
      setQaList(item.qa?.length ? item.qa : [{ question: '', answer: '' }]);
      return;
    }

    setCategory(defaultCategory);
    setSubcategory('');
    setTitle('');
    setSummary('');
    setContent('');
    setImageText('');
    setHighlights(['']);
    setQaList([{ question: '', answer: '' }]);
  }, [defaultCategory, isOpen, item]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      window.alert(text.missingTitle);
      return;
    }

    const savedItem: DatabaseItem = {
      id: item?.id || `item-${Date.now()}`,
      title: title.trim(),
      category,
      subcategory: subcategory.trim() || text.general,
      tags: item?.tags || [],
      summary: summary.trim(),
      content: content.trim(),
      imageText: imageText.trim(),
      highlights: highlights.map((h) => h.trim()).filter(Boolean),
      qa: qaList.filter((qa) => qa.question.trim() && qa.answer.trim()),
      links: item?.links || [],
      imageUrl: item?.imageUrl,
      isFavorite: item?.isFavorite || false,
      updatedAt: new Date().toISOString(),
    };

    onSave(savedItem);
    onClose();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{item ? text.edit : text.add}</h2>
            <p className="modal-subtitle">{text.intro}</p>
          </div>
          <button className="icon-btn" type="button" onClick={onClose} title={text.close}>
            <X size={20} />
          </button>
        </div>

        <form className="modal-body form-stack" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="label">
                <Layers size={16} color="var(--primary)" />
                {text.category}
              </label>
              <select className="select" value={category} onChange={(e) => setCategory(e.target.value as CategoryType)}>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="label">{text.subcategory}</label>
              <input className="field" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} placeholder={text.subcategoryPlaceholder} />
            </div>
          </div>

          <div className="form-group">
            <label className="label">{text.title} *</label>
            <input className="field" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder={text.titlePlaceholder} />
          </div>

          <div className="form-group">
            <label className="label">
              <Sparkles size={16} color="var(--amber)" />
              {text.summary}
            </label>
            <input className="field" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder={text.summaryPlaceholder} />
          </div>

          <div className="form-group">
            <label className="label">{text.content}</label>
            <textarea className="textarea" rows={6} value={content} onChange={(e) => setContent(e.target.value)} placeholder={text.contentPlaceholder} />
          </div>

          <div className="form-group">
            <label className="label">
              <ImageIcon size={16} color="var(--indigo)" />
              {text.imageText}
            </label>
            <textarea className="textarea" rows={3} value={imageText} onChange={(e) => setImageText(e.target.value)} placeholder={text.imageTextPlaceholder} />
          </div>

          <div className="section">
            <div className="form-row-between">
              <label className="label">{text.highlights}</label>
              <button className="btn-secondary" type="button" onClick={() => setHighlights([...highlights, ''])}>
                <Plus size={15} />
                <span>{text.addHighlight}</span>
              </button>
            </div>
            <div className="form-stack" style={{ marginTop: 10 }}>
              {highlights.map((highlight, index) => (
                <div className="inline-input-row" key={index}>
                  <span className="help-text">{index + 1}.</span>
                  <input
                    className="field"
                    value={highlight}
                    onChange={(e) => {
                      const next = [...highlights];
                      next[index] = e.target.value;
                      setHighlights(next);
                    }}
                    placeholder={text.highlightPlaceholder}
                  />
                  {highlights.length > 1 && (
                    <button className="icon-btn" type="button" onClick={() => setHighlights(highlights.filter((_, i) => i !== index))} title={text.remove}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <div className="form-row-between">
              <label className="label">
                <HelpCircle size={16} color="var(--cyan)" />
                {text.qa}
              </label>
              <button className="btn-secondary" type="button" onClick={() => setQaList([...qaList, { question: '', answer: '' }])}>
                <Plus size={15} />
                <span>{text.addQa}</span>
              </button>
            </div>
            <div className="form-stack" style={{ marginTop: 10 }}>
              {qaList.map((qa, index) => (
                <div className="repeat-box form-stack" key={index}>
                  <div className="form-row-between">
                    <strong className="help-text">QA #{index + 1}</strong>
                    {qaList.length > 1 && (
                      <button className="btn-danger" type="button" onClick={() => setQaList(qaList.filter((_, i) => i !== index))}>
                        <Trash2 size={15} />
                        <span>{text.remove}</span>
                      </button>
                    )}
                  </div>
                  <input
                    className="field"
                    value={qa.question}
                    onChange={(e) => {
                      const next = [...qaList];
                      next[index] = { ...next[index], question: e.target.value };
                      setQaList(next);
                    }}
                    placeholder={text.questionPlaceholder}
                  />
                  <textarea
                    className="textarea"
                    rows={3}
                    value={qa.answer}
                    onChange={(e) => {
                      const next = [...qaList];
                      next[index] = { ...next[index], answer: e.target.value };
                      setQaList(next);
                    }}
                    placeholder={text.answerPlaceholder}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer" style={{ margin: '6px -18px -18px' }}>
            <button className="btn-secondary" type="button" onClick={onClose}>
              {text.cancel}
            </button>
            <button className="btn-primary" type="submit">
              <Save size={17} />
              <span>{text.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
