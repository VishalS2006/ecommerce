import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Check,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { productService } from '../../services/productService';
import { StockBadge } from '../../components/common/Badge';
import { TableSkeleton } from '../../components/common/Skeleton';
import { useToast } from '../../context/ToastContext';

export const AdminProductsPage = () => {
  const { success, error, warning } = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const initialForm = {
    name: '',
    sku: '',
    brand: '',
    category: '',
    price: '',
    discount: 0,
    stock: 10,
    shortDescription: '',
    description: '',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
    isFeatured: false,
    isDealOfDay: false,
    isBestSeller: false,
    active: true
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await adminService.getProducts({
        keyword: search,
        category: categoryFilter,
        page,
        limit: 12
      });
      if (res.success) {
        setProducts(res.products || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      console.error('Failed to load admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, categoryFilter, page]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await productService.getCategories();
        if (res.success) setCategories(res.categories || []);
      } catch (err) {
        console.warn('Categories error:', err);
      }
    };
    fetchCats();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      ...initialForm,
      category: categories[0]?._id || ''
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingId(prod._id);
    setFormData({
      name: prod.name,
      sku: prod.sku,
      brand: prod.brand,
      category: prod.category?._id || prod.category,
      price: prod.price,
      discount: prod.discount || 0,
      stock: prod.stock,
      shortDescription: prod.shortDescription || '',
      description: prod.description || '',
      images: prod.images && prod.images.length > 0 ? prod.images : [''],
      isFeatured: !!prod.isFeatured,
      isDealOfDay: !!prod.isDealOfDay,
      isBestSeller: !!prod.isBestSeller,
      active: prod.active !== undefined ? prod.active : true
    });
    setModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.brand || !formData.price || !formData.description) {
      warning('Please fill in all required product fields');
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await adminService.updateProduct(editingId, formData);
        success('Product updated successfully');
      } else {
        await adminService.createProduct(formData);
        success('New product created successfully');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      error(err.customMessage || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminService.deleteProduct(id);
      success('Product deleted');
      fetchProducts();
    } catch (err) {
      error(err.customMessage || 'Failed to delete product');
    }
  };

  const handleInlineStockUpdate = async (id, currentVal, delta) => {
    const nextVal = Math.max(0, currentVal + delta);
    try {
      await adminService.updateStock(id, nextVal);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, stock: nextVal } : p))
      );
    } catch (err) {
      error('Failed to update stock');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Product Catalog Management
          </h2>
          <p className="text-xs text-slate-400">
            Total of {totalCount} items listed in your store
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by name, SKU, or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={8} cols={6} />
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No products found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Image and Name */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                          alt={p.name}
                          className="w-11 h-11 object-cover rounded-xl bg-slate-100 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <span className="font-bold text-slate-900 block truncate" title={p.name}>
                            {p.name}
                          </span>
                          <span className="text-[11px] text-slate-400">{p.brand}</span>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-600 text-xs">
                      {p.sku}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">
                      {p.category?.name || 'Unassigned'}
                    </td>

                    {/* Price and discount */}
                    <td className="py-3.5 px-4">
                      <span className="font-black text-slate-900">${p.discountPrice || p.price}</span>
                      {p.discount > 0 && (
                        <span className="block text-[11px] text-rose-500 font-bold">
                          {p.discount}% OFF
                        </span>
                      )}
                    </td>

                    {/* Stock with quick buttons */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleInlineStockUpdate(p._id, p.stock, -1)}
                          className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-xs"
                        >
                          -
                        </button>
                        <span className="font-bold text-slate-800 w-8 text-center">{p.stock}</span>
                        <button
                          type="button"
                          onClick={() => handleInlineStockUpdate(p._id, p.stock, 1)}
                          className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-xs"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Active Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          p.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {p.active ? 'Active' : 'Draft'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Price ($) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">SKU (Optional)</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if blank"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.images[0] || ''}
                  onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Short Tagline Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-brand-600 rounded"
                  />
                  <span>Featured Product</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDealOfDay}
                    onChange={(e) => setFormData({ ...formData, isDealOfDay: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded"
                  />
                  <span>Deal of the Day</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>Published & Active</span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
