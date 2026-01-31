import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence, } from 'framer-motion';
import { Plus, Edit, Trash2, Image as ImageIcon, X, Upload } from 'lucide-react';
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

  const bulkUploadMutation = useMutation({
    mutationFn: async (products) => {
      let uploadedCount = 0;
      let failedCount = 0;

      for (const product of products) {
        try {
          await api.post('/admin/products', product);
          uploadedCount++;
        } catch (error) {
          failedCount++;
          console.error(`Failed to upload ${product.name}:`, error);
        }
      }

      if (failedCount > 0) {
        throw new Error(`Uploaded ${uploadedCount} products but ${failedCount} failed`);
      }

      return { uploadedCount, failedCount };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['adminProducts']);
      toast.success(`Successfully uploaded ${data.uploadedCount} products!`);
      setShowBulkUpload(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to bulk upload products');
    }
  });

  const handleBulkUpload = async (products) => {
    return new Promise((resolve, reject) => {
      bulkUploadMutation.mutate(products, {
        onSuccess: () => resolve(),
        onError: reject,
      });
    });
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
          headers: {
            'Content-Type': 'multipart/form-data'
          }
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

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-gray-800">Products Management</h1>
        <div className="flex gap-3">
          <Button 
            onClick={() => setShowBulkUpload(true)} 
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <Upload className="h-5 w-5" />
            <span>Bulk Upload</span>
          </Button>
          <Button onClick={() => setShowModal(true)} className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add Product</span>
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data?.products?.map((product) => (
          <motion.div
            key={product._id}
            layout
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative overflow-hidden bg-gray-100 h-64">
              <ProductImage
                src={product.images?.[0]?.url}
                alt={product.name}
                className="group-hover:scale-110 transition-transform duration-500"
                aspectRatio="h-full"
              />
              {product.featured && (
                <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                  Featured
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.category}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-primary">{formatCurrency(product.price)}</span>
                <span className="text-sm text-gray-500">Stock: {product.stock}</span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(product)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Delete this product?')) {
                      deleteMutation.mutate(product._id);
                    }
                  }}
                  className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {data?.products?.length === 0 && (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600">No products found</h3>
          <p className="text-gray-500 mt-2">Start by adding your first eco-friendly product!</p>
          <Button onClick={() => setShowModal(true)} className="mt-6" variant="outline">
            Add Product
          </Button>
        </div>
      )}

      {/* Product Form Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Input
                  label="Product Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Price (₹)"
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                  <Input
                    label="Original Price (₹)"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    >
                      {PRODUCT_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="Stock"
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>

                <Input
                  label="Tags (comma separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="eco-friendly, sustainable, organic"
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Featured Product
                  </label>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <Upload className={`h-12 w-12 ${uploading ? 'text-gray-400' : 'text-gray-500'} mb-2`} />
                      <span className="text-sm text-gray-600">
                        {uploading ? 'Uploading...' : 'Click to upload images'}
                      </span>
                    </label>
                  </div>

                  {/* Image Previews */}
                  {imagePreview.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {imagePreview.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" className="flex-1" loading={createMutation.isPending || updateMutation.isPending}>
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Upload Modal */}
      <BulkUploadModal 
        isOpen={showBulkUpload} 
        onClose={() => setShowBulkUpload(false)}
        onUpload={handleBulkUpload}
      />
    </div>
  );
};

export default AdminProducts;
