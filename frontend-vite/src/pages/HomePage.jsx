import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

const CountdownTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date();
    const difference = new Date(endTime) - now;
    if (difference <= 0) return 'Deal ended';
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  return <div className="text-xs text-orange-600 font-medium">⏳ {timeLeft}</div>;
};

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await axios.get('/api/banners');
        setBanners(data.filter((b) => b.isActive));
      } catch (err) {
        console.warn('Banners not available:', err.message);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setIndex((prev) => (prev + 1) % banners.length),
    onSwipedRight: () => setIndex((prev) => (prev - 1 + banners.length) % banners.length),
    trackMouse: true,
  });

  if (banners.length === 0) return null;

  return (
    <div {...swipeHandlers} className="relative w-full max-h-72 overflow-hidden rounded-xl mb-8">
      <AnimatePresence>
        <motion.a
          key={banners[index]._id}
          href={banners[index].link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={banners[index].image}
            alt="Promo Banner"
            className="w-full h-72 object-cover rounded-xl"
          />
        </motion.a>
      </AnimatePresence>
      <button
        onClick={() => setIndex((prev) => (prev - 1 + banners.length) % banners.length)}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 dark:bg-gray-800 p-2 rounded-full shadow"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setIndex((prev) => (prev + 1) % banners.length)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 dark:bg-gray-800 p-2 rounded-full shadow"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setIndex(idx)}
            className={`w-3 h-3 rounded-full ${idx === index ? 'bg-primary' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [flashDeals, setFlashDeals] = useState([]);
  const [activeCoupon, setActiveCoupon] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          featuredRes,
          homepageRes,
          couponRes,
        ] = await Promise.all([
          axios.get('/api/products/featured'),
          axios.get('/api/homepage'),
          axios.get('/api/coupons/active'),
        ]);
        setProducts(featuredRes.data.products || []);
        setSettings(homepageRes.data.settings || {});
        setTestimonials(homepageRes.data.testimonials || []);
        setFeaturedCategories(homepageRes.data.featuredCategories || []);
        setFlashDeals(homepageRes.data.flashDeals || []);
        setActiveCoupon(couponRes.data || null);
      } catch (err) {
        console.error('Homepage data fetch failed:', err.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-background-primary dark:bg-background-dark">
      <div className="px-6 md:px-20 pt-6">
        {activeCoupon && (
          <div className="bg-orange-100 text-orange-800 font-semibold text-center py-3 mb-4 rounded-lg shadow">
            🎁 Use code <span className="font-bold">{activeCoupon.code}</span> to get {activeCoupon.discount}% off!
          </div>
        )}
        <BannerCarousel />
      </div>

      {flashDeals.length > 0 && (
        <section className="py-16 px-6 md:px-20 bg-red-50 dark:bg-background-dark border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400 mb-8">
              Flash Deals 🔥
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {flashDeals.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="group rounded-card overflow-hidden shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 bg-white dark:bg-background-darkSecondary border border-red-300"
                >
                  <img
                    src={product.images?.[0] || '/images/placeholder.png'}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:opacity-90"
                  />
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-text-primary dark:text-white truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      KSh {product.price.toLocaleString()}
                      {product.originalPrice && (
                        <span className="line-through text-xs text-secondary ml-2">
                          KSh {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </p>
                    <div className="mt-2 text-xs text-red-500 font-semibold uppercase">
                      Limited time offer!
                    </div>
                    <CountdownTimer endTime={product.flashDealEndsAt || new Date(Date.now() + 3600000)} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
