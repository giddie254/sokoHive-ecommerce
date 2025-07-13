import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addItem } from '../redux/slices/cartSlice';
import { updateWishlist } from '../redux/slices/authSlice';
import axios from 'axios';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import noImage from '@/assets/no-image.png'; // ✅ Local fallback image

const ProductCard = ({ product }) => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addItem({ product, size: product.sizes?.[0], quantity: 1, price: product.price }));
  };

  const handleWishlist = async () => {
    if (!user) return;
    try {
      const isInWishlist = user.wishlist.some((item) => item._id === product._id);
      const method = isInWishlist ? 'delete' : 'post';
      const response = await axios[method](
        `/api/wishlist/${product._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(updateWishlist({ wishlist: response.data }));
    } catch (err) {
      console.log(err);
    }
  };

  const isInWishlist = user?.wishlist?.some((item) => item._id === product._id);

  // ✅ Determine a valid image URL or fallback
  const isValidImage = (url) =>
    url &&
    !url.includes('via.placeholder') &&
    !url.includes('yourdomain.com/images/placeholder');

  const imageUrl = isValidImage(product.images?.[0]) ? product.images[0] : noImage;

  return (
    <div className="group relative rounded-card overflow-hidden shadow-card bg-white dark:bg-background-darkSecondary hover:shadow-lg transition duration-300">
      {/* Product Image */}
      <Link to={`/product/${product._id}`}>
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = noImage;
          }}
        />
      </Link>

      {/* Low Stock Tag */}
      {product.stock <= product.lowStockThreshold && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
          Low Stock
        </div>
      )}

      {/* Wishlist Icon */}
      {user && (
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-1.5 bg-white dark:bg-background-dark rounded-full shadow hover:scale-110 transition"
        >
          <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-primary text-primary' : 'text-gray-400'}`} />
        </button>
      )}

      {/* Info Block */}
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-base font-semibold text-text-primary dark:text-white truncate mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-secondary dark:text-text-darkSecondary mb-2">{product.brand}</p>
        </Link>

        {/* Price + Ratings */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-primary dark:text-primary-light">
            KSh {product.price.toLocaleString()}
          </span>
          <div className="flex items-center text-yellow-500 text-xs">
            <Star className="w-4 h-4 fill-yellow-400" />
            <span className="ml-1">4.5</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-button text-sm font-medium transition bg-primary text-white hover:bg-primary-light disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;


