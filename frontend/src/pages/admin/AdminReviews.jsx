import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Star, MessageSquare, User, Package, Calendar, Search, Filter, MoreHorizontal, Quote } from 'lucide-react';
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
    refetchInterval: 10000,
  });

  const deleteMutation = useMutation({
    mutationFn: ({ productId, reviewId }) => api.delete(`/admin/reviews/${productId}/${reviewId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminReviews']);
      toast.success('Feedback purged from system');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Purge failed');
    }
  });

  const handleDelete = (productId, reviewId) => {
    if (window.confirm('Permanent deletion of this feedback item?')) {
      deleteMutation.mutate({ productId, reviewId });
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
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
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Sentiments Hub</h1>
          <p className="text-gray-500 font-medium mt-1">Monitor community feedback and quality signals.</p>
        </div>

        <div className="bg-white/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-gray-100 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span className="text-xl font-black text-gray-900">4.8</span>
          </div>
          <span className="text-gray-300">|</span>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{data?.total || 0} Total Reviews</span>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatePresence>
          {data?.reviews?.map((review, index) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl group hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
            >
              <Quote className="absolute -top-6 -right-6 w-32 h-32 text-gray-50 opacity-[0.03] rotate-12" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center font-black text-gray-400 border border-gray-100">
                      {review.userName?.[0] || 'A'}
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900">{review.userName || 'Anonymous Member'}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-2">Verified</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(review.productId, review._id)}
                    className="p-3 bg-red-50 text-red-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-8">
                  <p className="text-gray-700 leading-relaxed font-medium italic">
                    "{review.comment || 'No comment provided for this rating.'}"
                  </p>
                </div>

                <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Package className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-xs font-black text-gray-900 uppercase tracking-tighter max-w-[150px] truncate">
                      {review.productName}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {data?.reviews?.length === 0 && (
          <div className="lg:col-span-2 py-32 bg-white rounded-[3rem] border border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
              <MessageSquare className="h-10 w-10 text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Silence is Golden</h3>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2 px-8">No community sentiments have been recorded in the system yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
