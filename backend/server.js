// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import http from 'http'; // ✅ changed from require to import
import { Server } from 'socket.io'; // ✅ ES module import

// Models & DB
import connectDB from './config/db.js';
import Order from './models/orderModel.js';
import User from './models/User.js';

// Routes
import productRoutes from './routes/productRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import homepageRoutes from './routes/homepageRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import activityLogRoutes from './routes/activityLogRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import publicSettingsRoutes from './routes/publicSettingsRoutes.js';

// Error handling
import { notFound, errorHandler } from './utils/errorHandler.js';

dotenv.config();
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/admin/settings', settingRoutes);
app.use('/api/admin/activity-logs', activityLogRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/public', publicSettingsRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use(notFound);
app.use(errorHandler);

// ----------------- SOCKET.IO SETUP -----------------
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const userSocketMap = {};

const emitRealtimeMetrics = async () => {
  try {
    const orders = await Order.find({});
    const revenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const users = await User.countDocuments();
    const metrics = {
      orders: orders.length,
      revenue,
      users,
      activeUsers: Object.keys(userSocketMap).length,
    };
    io.emit('realtimeMetrics', metrics);
  } catch (err) {
    console.error('Realtime emit error:', err.message);
  }
};

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('No token'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Authentication failed'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.userId;
  userSocketMap[userId] = socket.id;
  console.log(`✅ Admin connected: ${userId}`);

  app.set('io', io);
  app.set('userSocketMap', userSocketMap);

  io.emit('activeAdmins', Object.keys(userSocketMap).length);

  const interval = setInterval(() => emitRealtimeMetrics(), 10000);

  socket.on('disconnect', () => {
    delete userSocketMap[userId];
    clearInterval(interval);
    console.log(`❌ Admin disconnected: ${userId}`);
    io.emit('activeAdmins', Object.keys(userSocketMap).length);
  });
});

// ---------------------------------------------------

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
