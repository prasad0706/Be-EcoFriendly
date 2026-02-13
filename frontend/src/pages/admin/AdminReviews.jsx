import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Star, MessageSquare, Package, Calendar, Quote } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';

const AdminReviews = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['adminReviews'],
    queryFn: async () => {
      const res = await api.get('/admin/reviews?limit=100');
      return res.data.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: ({ productId, reviewId }) => api.delete(`/admin/reviews/${productId}/${reviewId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminReviews']);
      toast.success('Review deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    }
  });

  const handleDelete = (productId, reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteMutation.mutate({ productId, reviewId });
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) return <Loading />;

  return (
    <div className="pb-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Reviews</h1>
          <p className="text-gray-500 font-medium">Monitor and manage customer feedback.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl px-6 py-3 shadow-sm flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span className="text-xl font-bold text-gray-900">{data?.averageRating || 0}</span>
          </div>
          <div className="w-px h-6 bg-gray-100" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{data?.total || 0} Total Reviews</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {data?.reviews?.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
            >
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center font-bold text-gray-400 border border-gray-100">
                      {review.userName?.[0] || 'A'}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{review.userName || 'Anonymous Customer'}</h3>
                      <div className="mt-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(review.productId, review._id)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <Quote className="h-6 w-6 text-gray-100 mb-2" />
                  <p className="text-gray-700 font-medium leading-relaxed">
                    {review.comment || 'No comment provided.'}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-2 text-primary">
                    <Package className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-tight truncate max-w-[200px]">
                      {review.productName}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {data?.reviews?.length === 0 && (
          <div className="lg:col-span-2 py-24 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
            <MessageSquare className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No reviews found</h3>
            <p className="text-gray-500 mt-1">There are no customer reviews to display yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
