import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trash2, Star } from 'lucide-react';
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
    },
    refetchInterval: 5000, // Real-time updates
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
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Reviews Management</h1>
        <div className="text-sm text-gray-600">
          Total Reviews: {data?.total || 0}
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 gap-4">
        {data?.reviews?.map((review) => (
          <motion.div
            key={review._id}
            layout
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{review.productName}</h3>
                    <p className="text-sm text-gray-600">
                      by {review.userName || review.user?.name || 'Anonymous'}
                    </p>
                  </div>
                  {renderStars(review.rating)}
                </div>

                {review.comment && (
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                )}

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  {review.user?.email && (
                    <span>• {review.user.email}</span>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(review.productId, review._id)}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}

        {data?.reviews?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No reviews found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
