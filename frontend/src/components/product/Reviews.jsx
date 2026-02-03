import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, ThumbsUp, Check, Image as ImageIcon, X, Camera, ShieldCheck, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const Reviews = ({ product }) => {
    const { isAuthenticated, user } = useAuth();
    const [activeTab, setActiveTab] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    const queryClient = useQueryClient();

    const reviews = product?.reviews || [];

    // Filter logic
    const filteredReviews = reviews.filter(review => {
        if (activeTab === 'with_photos') return review.images && review.images.length > 0;
        if (activeTab === '5_stars') return review.rating === 5;
        if (activeTab === 'verified') return review.verified;
        return true;
    });

    const uploadImageMutation = useMutation({
        mutationFn: async (file) => {
            const formData = new FormData();
            formData.append('image', file);
            const res = await api.post('/products/upload', formData);
            return res.data;
        },
        onSuccess: (data) => {
            setImages(prev => [...prev, data.data.url]);
            toast.success('Image uploaded!');
        },
        onError: () => toast.error('Failed to upload image')
    });

    const submitReviewMutation = useMutation({
        mutationFn: (data) => api.post(`/products/${product._id}/reviews`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['product', product._id]);
            toast.success('Review submitted successfully!');
            setShowForm(false);
            setComment('');
            setImages([]);
            setRating(5);
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Failed to submit review')
    });

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (images.length >= 3) {
            return toast.error('Maximum 3 images allowed');
        }

        setUploading(true);
        try {
            await uploadImageMutation.mutateAsync(file);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!comment.trim()) return toast.error('Please write a comment');

        submitReviewMutation.mutate({
            rating,
            comment,
            images
        });
    };

    return (
        <div className="py-16 border-t border-gray-100" id="reviews">
            <div className="flex flex-col md:flex-row gap-12">
                {/* Left Side: Stats & Filters */}
                <div className="w-full md:w-1/3 space-y-8">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Customer Feedback</h3>
                        <div className="flex items-baseline gap-4">
                            <span className="text-5xl font-black text-primary">{product.ratings?.average || 0}</span>
                            <div className="space-y-1">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-5 w-5 ${i < Math.round(product.ratings?.average || 0) ? 'fill-current' : 'text-gray-200'}`} />
                                    ))}
                                </div>
                                <p className="text-sm font-bold text-gray-400">{product.ratings?.count || 0} verified reviews</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-3xl p-2 flex flex-col gap-2">
                        {[
                            { id: 'all', label: 'All Reviews', icon: Filter },
                            { id: 'with_photos', label: 'With Photos', icon: ImageIcon },
                            { id: 'verified', label: 'Verified Buyers', icon: ShieldCheck },
                            { id: '5_stars', label: '5 Stars Only', icon: Star },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-3 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === tab.id
                                        ? 'bg-white text-gray-900 shadow-md transform scale-[1.02]'
                                        : 'text-gray-400 hover:bg-gray-100'
                                    }`}
                            >
                                <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-primary' : ''}`} />
                                <span>{tab.label}</span>
                                {tab.id === 'with_photos' && (
                                    <span className="ml-auto bg-gray-100 text-gray-400 text-xs py-1 px-2 rounded-lg">
                                        {reviews.filter(r => r.images?.length > 0).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-6 bg-gradient-to-br from-primary/5 to-primary-blue/5 rounded-3xl border border-primary/10">
                        <h4 className="font-bold text-gray-900 mb-2">Share your thoughts</h4>
                        <p className="text-sm text-gray-500 mb-6">Your feedback helps others make eco-friendly choices.</p>
                        <Button
                            onClick={() => {
                                if (!isAuthenticated) return toast.error('Please login to write a review');
                                setShowForm(!showForm);
                            }}
                            className="w-full py-4 text-sm font-black uppercase tracking-widest"
                        >
                            Write a Review
                        </Button>
                    </div>
                </div>

                {/* Right Side: Review List & Form */}
                <div className="flex-1">
                    <AnimatePresence>
                        {showForm && (
                            <motion.form
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                onSubmit={handleSubmit}
                                className="mb-12 bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-primary/5 overflow-hidden"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <h4 className="text-xl font-bold text-gray-900">Write a Review</h4>
                                    <button type="button" onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-50 rounded-full">
                                        <X className="h-5 w-5 text-gray-400" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setRating(star)}
                                                    className="focus:outline-none transition-transform hover:scale-110"
                                                >
                                                    <Star className={`h-8 w-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Your Review</label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            rows={4}
                                            className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 resize-none font-medium"
                                            placeholder="What did you like or dislike? How was the quality?"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Add Photos</label>
                                        <div className="flex gap-4">
                                            {images.map((img, i) => (
                                                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group">
                                                    <img src={img} alt="review" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                                                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="h-5 w-5 text-white" />
                                                    </button>
                                                </div>
                                            ))}
                                            {images.length < 3 && (
                                                <label className="w-20 h-20 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
                                                    {uploading ? (
                                                        <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
                                                    ) : (
                                                        <>
                                                            <Camera className="h-6 w-6 text-gray-400 group-hover:text-primary mb-1" />
                                                            <span className="text-[10px] font-bold text-gray-400 group-hover:text-primary">Add</span>
                                                        </>
                                                    )}
                                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                                                </label>
                                            )}
                                        </div>
                                    </div>

                                    <Button type="submit" loading={submitReviewMutation.isPending} className="w-full py-4 text-sm font-bold">
                                        Submit Review
                                    </Button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {/* List */}
                    <div className="space-y-8">
                        {filteredReviews.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-[3rem]">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <Star className="h-8 w-8 text-gray-300" />
                                </div>
                                <p className="text-gray-500 font-bold">No reviews found matching your criteria</p>
                            </div>
                        ) : (
                            filteredReviews.map((review) => (
                                <motion.div
                                    key={review._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-blue text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20">
                                                {review.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-gray-900">{review.name}</h5>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex text-yellow-500 text-xs">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-gray-300 font-bold">•</span>
                                                    <span className="text-xs text-gray-400 font-medium">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {review.verified && (
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-eco/10 text-green-eco rounded-full">
                                                <ShieldCheck className="h-3.5 w-3.5" />
                                                <span className="text-[10px] font-black uppercase tracking-wider">Verified Purchase</span>
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-gray-600 leading-relaxed mb-6 pl-16">
                                        {review.comment}
                                    </p>

                                    {review.images?.length > 0 && (
                                        <div className="flex gap-3 pl-16">
                                            {review.images.map((img, i) => (
                                                <div key={i} className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-100">
                                                    <img src={img} alt="review attachment" className="w-full h-full object-cover hover:scale-110 transition-transform" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reviews;
