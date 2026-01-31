import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import ProductCard from '../components/product/ProductCard';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const [removingItemId, setRemovingItemId] = useState(null);

  const handleRemoveFromWishlist = async (productId) => {
    setRemovingItemId(productId);
    try {
      await removeFromWishlist(productId);
    } finally {
      setRemovingItemId(null);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product._id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-teal to-green">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-teal to-green">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <Heart className="h-24 w-24 text-green mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your wishlist yet.
            </p>
            <Link to="/shop">
              <Button size="lg">
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-teal to-green">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Your Wishlist</h1>
                <p className="text-gray-600">
                  {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
                </p>
              </div>
              <Link to="/shop">
                <Button variant="outline">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative group"
                >
                  <ProductCard product={product} />
                  
                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    disabled={removingItemId === product._id}
                    className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors z-10"
                  >
                    {removingItemId === product._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </button>
                  
                  <div className="mt-4 flex space-x-2">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1"
                      size="sm"
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Wishlist;