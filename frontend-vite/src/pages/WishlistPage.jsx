import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import noImage from '@/assets/no-image.png';

const WishlistPage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user || !user.token) return;

      try {
        const { data } = await axios.get('/api/wishlist', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        setWishlist(data);
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  if (!isAuthenticated) {
    return <div className="p-6 text-center text-red-500">Please log in to view your wishlist.</div>;
  }

  if (loading) {
    return <div className="p-6 text-center">Loading your wishlist...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <p className="text-gray-600">No items in your wishlist yet.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <li key={product._id} className="border p-4 rounded shadow">
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.images?.[0] || noImage}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded mb-2"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = noImage;
                  }}
                />
                <h2 className="text-lg font-bold truncate">{product.name}</h2>
                <p className="text-sm text-gray-600">KSh {product.price.toLocaleString()}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WishlistPage;
