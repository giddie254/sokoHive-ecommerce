// src/pages/admin/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  PackageIcon,
  ShoppingCartIcon,
  UsersIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

import ProductSalesChart from '../components/ProductSalesChart';
import RevenueChart from '../components/RevenueChart';
import OrdersChart from '../components/OrdersChart';
import TopSellingProducts from '../components/TopSellingProducts';
import { io } from 'socket.io-client';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
const token = user?.token;

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentSales: [],
    topProducts: [],
  });

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);


const socket = io();

useEffect(() => {
  socket.on('newOrder', (order) => {
    toast.success(`New order ${order._id} received`);
    fetchStats(); // or update state directly
  });
}, []);


  const statCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: <PackageIcon className="w-6 h-6 text-primary" />,
      link: '/admin/products',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: <ShoppingCartIcon className="w-6 h-6 text-primary" />,
      link: '/admin/orders',
    },
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: <UsersIcon className="w-6 h-6 text-primary" />,
      link: '/admin/users',
    },
    {
      label: 'Total Revenue',
      value: `KSh ${stats.totalRevenue.toLocaleString()}`,
      icon: <TrendingUpIcon className="w-6 h-6 text-primary" />,
      link: '#',
    },
  ];

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold text-text-primary dark:text-white">Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link
            to={card.link}
            key={card.label}
            className="card p-4 flex items-center justify-between hover:shadow-md transition rounded-xl"
          >
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
              <h3 className="text-xl font-semibold text-text-primary dark:text-white mt-1">{card.value}</h3>
            </div>
            <div className="bg-primary/10 p-2 rounded-full">{card.icon}</div>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="space-y-10">
        <div className="grid md:grid-cols-2 gap-6">
          <ProductSalesChart />
          <RevenueChart />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <OrdersChart />
          <TopSellingProducts />
        </div>
      </div>

      {/* Recent Sales */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4 text-text-primary dark:text-white">Recent Sales</h2>
        <div className="overflow-auto rounded border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentSales?.map((order) => (
                <tr key={order._id} className="border-t dark:border-gray-700">
                  <td className="px-4 py-2">{order.user?.name || 'Guest'}</td>
                  <td className="px-4 py-2">KSh {order.totalPrice.toLocaleString()}</td>
                  <td className="px-4 py-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {stats.recentSales?.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                    No recent sales
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Rated Products */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4 text-text-primary dark:text-white">Top Rated Products</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.topProducts?.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="border rounded p-2 shadow-sm hover:shadow transition"
            >
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-full h-28 object-cover rounded"
              />
              <p className="text-sm font-medium mt-1 text-text-primary dark:text-white truncate">
                {product.name}
              </p>
              <p className="text-xs text-secondary">⭐ {product.rating.toFixed(1)}</p>
            </Link>
          ))}
          {stats.topProducts?.length === 0 && (
            <p className="text-sm text-gray-500">No top products found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


