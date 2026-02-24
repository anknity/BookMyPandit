import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

// CRITICAL: Load env variables BEFORE importing local routes
dotenv.config();

import winston from 'winston';

import authRoutes from './routes/authRoutes.js';
import pujaRoutes from './routes/pujaRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import panditRoutes from './routes/panditRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import astrologyRoutes from './routes/astrologyRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { getBanner } from './controllers/bannerController.js';

// Logger
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, _res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pujas', pujaRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/pandits', panditRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/astrology', astrologyRoutes);
app.use('/api/user', userRoutes);
app.get('/api/banner', getBanner); // public – no auth

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error('Unhandled error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Users and Pandits join a shared room based on their session id
    socket.on('join_chat', (roomId) => {
        socket.join(roomId);
        logger.info(`Socket ${socket.id} joined room ${roomId}`);
    });

    // Pandits join their personal inbox room to listen for new chats
    socket.on('join_inbox', (panditId) => {
        const inboxRoom = `pandit_inbox_${panditId}`;
        socket.join(inboxRoom);
        logger.info(`Socket ${socket.id} joined inbox ${inboxRoom}`);
    });

    // Relay messages instantly to everyone in the room (Ephemeral, no DB)
    socket.on('send_message', (data) => {
        // Send to the specific chat room
        io.to(data.roomId).emit('receive_message', data);

        // If it's from a user, also alert the pandit's inbox so they can join
        if (data.sender === 'user' && data.targetPanditId) {
            io.to(`pandit_inbox_${data.targetPanditId}`).emit('incoming_chat', {
                roomId: data.roomId,
                userId: data.userId,
                userName: data.userName,
                userLocation: data.userLocation,
                userAvatar: data.userAvatar,
                firstMessage: data.text
            });
        }
    });

    // Relay unlock signals after successful payment
    socket.on('unlock_chat', (data) => {
        io.to(data.roomId).emit('chat_unlocked', data);
    });

    // WebRTC signaling for the Audio Call feature
    socket.on('call_signal', (data) => {
        socket.to(data.roomId).emit('call_signal', data);
    });

    socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    logger.info(`🚀 PanditJi Backend running on port ${PORT}`);
});

export default app;
