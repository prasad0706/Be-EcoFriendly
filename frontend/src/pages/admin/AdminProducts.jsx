import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Image as ImageIcon, X, Upload, Search, Filter, LayoutGrid, List, Package,Leaf } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { formatCurrency } from '../../utils/currency';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
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
    <div className="pb-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
          <p className="text-gray-500 font-medium">Add, edit, or remove items from your store.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowBulkUpload(true)}
            className="flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Import Products</span>
          </Button>

          <Button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
          />
        </div>

        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-bold text-gray-700 min-w-[180px]"
          >
            <option value="All">All Categories</option>
            {PRODUCT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <div className="flex p-1 bg-gray-50 rounded-xl border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-gray-400'}`}
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-400'}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Product List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProducts?.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all"
              >
                <div className="relative h-48 bg-gray-50 overflow-hidden">
                  <ProductImage
                    src={product.images?.[0]?.url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm text-gray-600 hover:text-primary transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => window.confirm('Delete this product?') && deleteMutation.mutate(product._id)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{product.category}</p>
                  <h3 className="font-bold text-gray-900 line-clamp-1 mb-3">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {product.stock} in stock
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Impact Stats</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts?.map(product => (
                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <img src={product.images?.[0]?.url} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-400 font-medium">#{product._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{formatCurrency(product.price)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-xs font-black text-gray-900">{product.netSavings || 0}kg CO2</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-xs font-black text-gray-900">{product.waterSaved || 0}L Water</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent" />
                        <span className="text-xs font-black text-gray-900">{product.treesEquivalent || 0} Trees</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleEdit(product)} className="p-2 text-gray-400 hover:text-primary transition-colors">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button onClick={() => deleteMutation.mutate(product._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
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

      {/* Product Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Product Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Organic Tote Bag"
                  />

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                      placeholder="Describe the product..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Sale Price"
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                    <Input
                      label="Original Price"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-bold text-gray-700"
                      >
                        {PRODUCT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <Input
                      label="Stock Quantity"
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>

                  <Input
                    label="Tags (Optional, separated by comma)"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="eco, organic, local"
                  />

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <p className="font-bold text-gray-900">Featured Product</p>
                      <p className="text-xs text-gray-500 font-medium">Show this product on the home page</p>
                    </div>
                    <input
                      type="checkbox"
                      className="w-6 h-6 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                  </div>

                  {/* Ecological Impact (LCA) Section */}
                  <div className="p-6 bg-mint/10 border border-primary/20 rounded-[2rem] space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                       <Leaf className="h-5 w-5 text-primary" />
                       <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Life Cycle Analysis (CO2e)</h3>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                       {[
                         { label: 'Raw Materials', key: 'rawMaterials' },
                         { label: 'Manufacturing', key: 'manufacturing' },
                         { label: 'Transportation', key: 'transportation' },
                         { label: 'Usage', key: 'usage' },
                         { label: 'Disposal', key: 'disposal' }
                       ].map(field => (
                         <div key={field.key}>
                           <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">{field.label}</label>
                           <input
                             type="number"
                             step="0.01"
                             className="w-full px-4 py-2 bg-white border border-gray-100 rounded-xl focus:ring-1 focus:ring-primary font-bold text-sm"
                             value={formData.lca?.[field.key] || 0}
                             onChange={(e) => setFormData({
                               ...formData,
                               lca: { ...(formData.lca || {}), [field.key]: parseFloat(e.target.value) || 0 }
                             })}
                           />
                         </div>
                       ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Product Images</label>
                    <div className="relative p-8 border-2 border-dashed border-gray-200 rounded-2xl hover:border-primary/50 transition-colors text-center">
                      <input
                        type="file" multiple accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={uploading}
                      />
                      <Upload className={`h-8 w-8 mx-auto mb-2 ${uploading ? 'text-primary animate-bounce' : 'text-gray-400'}`} />
                      <p className="text-sm font-bold text-gray-700">
                        {uploading ? 'Uploading...' : 'Click or drag images to upload'}
                      </p>
                    </div>

                    {imagePreview.length > 0 && (
                      <div className="grid grid-cols-4 gap-4 mt-6">
                        {imagePreview.map((url, index) => (
                          <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                            <img src={url} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </form>
              </div>

              <div className="px-8 py-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
                > Discard </button>
                <Button
                  form="product-form"
                  type="submit"
                  loading={createMutation.isPending || updateMutation.isPending}
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
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
