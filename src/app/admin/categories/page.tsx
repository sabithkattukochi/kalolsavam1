'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, X, CheckCircle2, AlertCircle, ArrowUpDown } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { dataStore } from '@/lib/data-store';
import { Category } from '@/types/database';

export default function CategoriesManagementPage() {
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    display_order: 1,
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const festival = dataStore.getActiveFestival();

  const refreshData = () => {
    setCategories(dataStore.getCategories());
  };

  useEffect(() => {
    setMounted(true);
    refreshData();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      display_order: categories.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image_url: cat.image_url || '',
      display_order: cat.display_order,
    });
    setIsModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        dataStore.updateCategory(editingCategory.id, {
          name: formData.name,
          slug: formData.slug.toLowerCase().trim().replace(/\s+/g, '-'),
          description: formData.description || null,
          image_url: formData.image_url || null,
          display_order: Number(formData.display_order),
        });
        setMessage({ type: 'success', text: `Category ${formData.name} updated.` });
      } else {
        dataStore.addCategory({
          festival_id: festival.id,
          name: formData.name,
          slug: formData.slug.toLowerCase().trim().replace(/\s+/g, '-'),
          description: formData.description || null,
          image_url: formData.image_url || null,
          display_order: Number(formData.display_order),
        });
        setMessage({ type: 'success', text: `Category ${formData.name} created.` });
      }
      setIsModalOpen(false);
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  const handleDeleteCategory = (cat: Category) => {
    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;
    try {
      dataStore.deleteCategory(cat.id);
      setMessage({ type: 'success', text: `Category ${cat.name} removed.` });
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Deletion failed';
      setMessage({ type: 'error', text: msg });
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <AdminSidebar currentRole="SUPER_ADMIN" />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Event Categories"
          description="Manage festival competitive arenas: Chithrolsavam, Sahithyolsavam, Stage Events, and custom sections"
        />

        <main className="flex-1 p-6 md:p-8 space-y-6">
          {message && (
            <div
              className={`p-4 rounded-2xl flex items-center justify-between border ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              }`}
            >
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                {message.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                )}
                <span>{message.text}</span>
              </div>
              <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white">Configured Categories</h2>
              <p className="text-xs text-slate-400">Total {categories.length} competition divisions</p>
            </div>

            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col justify-between space-y-6 transition-all hover:border-slate-700"
              >
                <div className="space-y-4">
                  {cat.image_url ? (
                    <div className="relative h-40 w-full rounded-2xl overflow-hidden">
                      <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 text-[10px] font-bold text-teal-400 border border-white/10">
                        Order #{cat.display_order}
                      </div>
                    </div>
                  ) : (
                    <div className="h-40 rounded-2xl bg-slate-950 flex items-center justify-center border border-slate-800 text-slate-400">
                      <Layers className="w-8 h-8" />
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-black text-white">{cat.name}</h3>
                    <p className="text-xs font-mono text-slate-400">slug: {cat.slug}</p>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2 line-clamp-3">
                      {cat.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">
                    Display: #{cat.display_order}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-blue-400 hover:border-blue-500/40 transition-all"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-rose-400 hover:border-rose-500/40 transition-all"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* CREATE / EDIT CATEGORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chithrolsavam"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      name,
                      slug: formData.slug || name.toLowerCase().replace(/\s+/g, '-'),
                    });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">URL Slug</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. chithrolsavam"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Display Order</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Cover Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Description</label>
                <textarea
                  rows={3}
                  placeholder="Enter details of events encompassed under this category..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold uppercase tracking-wider"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

