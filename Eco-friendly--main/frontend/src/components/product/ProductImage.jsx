import { useState } from 'react';
import { ImageIcon } from 'lucide-react';

const ProductImage = ({ src, alt, className = '', aspectRatio = 'aspect-square' }) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fallback image using placehold.co (more reliable than via.placeholder.com)
    const fallbackSrc = `https://placehold.co/600x600/f3f4f6/374151?text=${encodeURIComponent(alt || 'No Image')}`;

    const handleLoad = () => {
        setLoading(false);
    };

    const handleError = () => {
        setError(true);
        setLoading(false);
    };

    return (
        <div className={`relative overflow-hidden bg-gray-100 ${aspectRatio} ${className}`}>
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-4 text-center">
                    <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                    <span className="text-xs font-medium uppercase tracking-wider">No Image Available</span>
                </div>
            ) : (
                <img
                    src={src || fallbackSrc}
                    alt={alt}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'
                        }`}
                />
            )}
        </div>
    );
};

export default ProductImage;
