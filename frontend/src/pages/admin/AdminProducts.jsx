import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Image as ImageIcon, X, Upload, Search, Filter, MoreHorizontal, LayoutGrid, List } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { formatCurrency } from '../../utils/currency';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import { Package } from 'lucide-react';
import ProductImage from '../../components/product/ProductImage';
import BulkUploadModal from '../../components/admin/BulkUploadModal';
import { PRODUCT_CATEGORIES } from '../../utils/constants';

const AdminProducts = () => {
  const [showModal, setShowModal] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Reusable Products',
    stock: '',
    featured: false,
    tags: '',
    images: []
  });
  const [imagePreview, setImagePreview] = useState([]);
  const [uploading, setUploading] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: async () => {
      const res = await api.get('/admin/products?limit=100');
      return res.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (productData) => api.post('/admin/products', productData),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProducts']);
      toast.success('Product created successfully');
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create product');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProducts']);
      toast.success('Product updated successfully');
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update product');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProducts']);
      toast.success('Product deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  });

  const handleBulkUpload = async (products) => {
    try {
      let uploadedCount = 0;
      for (const product of products) {
        await api.post('/admin/products', product);
        uploadedCount++;
      }
      queryClient.invalidateQueries(['adminProducts']);
      toast.success(`Successfully uploaded ${uploadedCount} products!`);
      setShowBulkUpload(false);
    } catch (error) {
      toast.error('Bulk upload partially failed');
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const uploadedImages = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        const res = await api.post('/admin/products/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedImages.push({
          url: res.data.data.url,
          publicId: res.data.data.fileId
        });
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...uploadedImages]
    }));
    setImagePreview(prev => [...prev, ...uploadedImages.map(img => img.url)]);
    setUploading(false);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: parseFloat(formData.originalPrice) || 0,
      stock: parseInt(formData.stock),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct._id, data: productData });
    } else {
      createMutation.mutate(productData);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || '',
      category: product.category,
      stock: product.stock,
      featured: product.featured,
      tags: product.tags?.join(', ') || '',
      images: product.images || []
    });
    setImagePreview(product.images?.map(img => img.url) || []);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: 'Reusable Products',
      stock: '',
      featured: false,
      tags: '',
      images: []
    });
    setImagePreview([]);
    setEditingProduct(null);
    setShowModal(false);
  };

  const filteredProducts = data?.products?.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-10 pb-10">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Product Catalog</h1>
          <p className="text-gray-500 font-medium mt-1">Manage and monitor your sustainable inventory.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900 shadow-inner' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-gray-100 text-gray-900 shadow-inner' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>

          <Button
            onClick={() => setShowBulkUpload(true)}
            className="flex items-center space-x-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-100 px-6 py-3 rounded-2xl shadow-sm font-bold transition-all"
          >
            <Upload className="h-5 w-5 text-blue-500" />
            <span>Import</span>
          </Button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-gray-900 text-white hover:bg-black px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-gray-900/20 transition-all hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5" />
            <span>New Product</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white/50 backdrop-blur-md rounded-[2rem] p-4 flex flex-col md:flex-row gap-4 border border-white shadow-xl shadow-gray-200/50">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search within catalog..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-gray-200 font-medium placeholder:text-gray-400 shadow-sm"
          />
        </div>

        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-6 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-gray-200 font-bold text-gray-700 shadow-sm appearance-none min-w-[200px]"
          >
            <option value="All">All Categories</option>
            {PRODUCT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      {/* Content View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {filteredProducts?.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative h-72 overflow-hidden bg-gray-50">
                  <ProductImage
                    src={product.images?.[0]?.url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    {product.featured && (
                      <span className="px-5 py-2 bg-yellow-400/90 backdrop-blur-md text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                        Featured
                      </span>
                    )}
                    <span className="px-5 py-2 bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg border border-black/5">
                      {product.category.split(' ')[0]}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 backdrop-blur-[2px]">
                    <button onClick={() => handleEdit(product)} className="p-4 bg-white text-gray-900 rounded-2xl hover:scale-110 transition-transform shadow-xl">
                      <Edit className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => window.confirm('Delete?') && deleteMutation.mutate(product._id)}
                      className="p-4 bg-red-500 text-white rounded-2xl hover:scale-110 transition-transform shadow-xl"
                    >
                      <Trash2 className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-primary-blue transition-colors line-clamp-1">{product.name}</h3>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-black text-gray-400 tracking-tighter mb-1">Price tag</span>
                      <span className="text-2xl font-black text-gray-900">{formatCurrency(product.price)}</span>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${product.stock > 10 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                      {product.stock} Units
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Identity</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Product Detail</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Value</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts?.map(product => (
                <tr key={product._id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <img src={product.images?.[0]?.url} className="w-16 h-16 rounded-2xl object-cover shadow-sm" alt="" />
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-400 font-bold mt-1">ID: #{product._id.slice(-8).toUpperCase()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-2 bg-gray-100 text-gray-600 text-[10px] font-black uppercase rounded-lg">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-gray-900">{formatCurrency(product.price)}</p>
                    <p className="text-xs text-gray-400 font-bold mt-1">{product.stock} in stock</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleEdit(product)} className="p-2.5 hover:bg-white rounded-xl text-gray-400 hover:text-gray-900 shadow-none hover:shadow-sm border border-transparent hover:border-gray-100 transition-all">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button onClick={() => deleteMutation.mutate(product._id)} className="p-2.5 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-600 border border-transparent hover:border-red-100 transition-all">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Form Modal - Glassmorphic Redesign */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 lg:p-10">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                    {editingProduct ? 'Configure Product' : 'Create Evolution'}
                  </h2>
                  <p className="text-gray-400 text-sm font-bold mt-1 uppercase tracking-widest">General information & settings</p>
                </div>
                <button onClick={resetForm} className="p-3 hover:bg-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-colors">
                  <X className="h-7 w-7" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-10 py-10">
                <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <Input
                      label="Public Title"
                      required
                      value={formData.name}
                      placeholder="e.g., Organic Cotton Tote Bag"
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                        Story Context (Description)
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={formData.description}
                        placeholder="Tell the story of this eco-friendly product..."
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] border-none focus:ring-2 focus:ring-gray-200 font-medium placeholder:text-gray-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <Input
                        label="Member Price"
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                      <Input
                        label="Comparative Value"
                        type="number"
                        step="0.01"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                          Collection Category
                        </label>
                        <select
                          required
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] border-none focus:ring-2 focus:ring-gray-200 font-bold text-gray-700 appearance-none"
                        >
                          {PRODUCT_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <Input
                        label="Available Units"
                        type="number"
                        required
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      />
                    </div>

                    <Input
                      label="Visual Tags (Comma Separated)"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="e.g., zero-waste, vegan, local"
                    />

                    <div className="p-6 bg-gray-900 rounded-[2rem] text-white flex items-center justify-between shadow-xl">
                      <div>
                        <p className="font-black text-sm">Featured Product</p>
                        <p className="text-[10px] text-white/50 font-bold uppercase mt-1">Display on main showcase</p>
                      </div>
                      <div className="relative inline-block w-12 h-6 rounded-full bg-white/20">
                        <input
                          type="checkbox"
                          className="SR-ONLY absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        />
                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.featured ? 'translate-x-6 bg-green-400' : ''}`} />
                      </div>
                    </div>

                    {/* Image Management */}
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                        Visual Assets
                      </label>
                      <div className="relative group overflow-hidden bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 p-8 hover:border-blue-400 transition-colors">
                        <input
                          type="file" multiple accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer z-20"
                          disabled={uploading}
                        />
                        <div className="flex flex-col items-center text-center">
                          <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
                            <Upload className={`h-8 w-8 ${uploading ? 'text-blue-500 animate-bounce' : 'text-gray-400'}`} />
                          </div>
                          <span className="text-sm font-black text-gray-900">
                            {uploading ? 'Processing Imagery...' : 'Drop Assets or Browse'}
                          </span>
                          <span className="text-xs font-bold text-gray-400 uppercase mt-1">Supports PNG, JPG (Max 5MB)</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mt-6">
                        {imagePreview.map((url, index) => (
                          <div key={index} className="relative group rounded-2xl overflow-hidden aspect-square ring-2 ring-transparent hover:ring-blue-400 transition-all">
                            <img src={url} className="w-full h-full object-cover" alt="" />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-500/90 backdrop-blur-md text-white rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="px-10 py-8 border-t border-gray-100 flex items-center justify-end space-x-4 bg-gray-50/50 shrink-0">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-4 text-gray-500 font-black text-sm uppercase tracking-widest hover:text-gray-900 transition-colors"
                >
                  Discard Changes
                </button>
                <button
                  form="product-form"
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-gray-900/10 hover:bg-black transition-all hover:-translate-y-0.5"
                >
                  {editingProduct ? 'Update Inventory' : 'Publish Product'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BulkUploadModal
        isOpen={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        onUpload={handleBulkUpload}
      />
    </div>
  );
};

export default AdminProducts;
