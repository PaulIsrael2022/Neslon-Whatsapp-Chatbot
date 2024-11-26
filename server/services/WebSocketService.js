import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

class WebSocketService {
    constructor() {
        this.io = null;
        this.connectedUsers = new Map(); // userId -> socket
    }

    initialize(server, allowedOrigins) {
        this.io = new Server(server, {
            cors: {
                origin: function(origin, callback) {
                    // Allow requests with no origin
                    if (!origin) return callback(null, true);
                    
                    if (allowedOrigins.indexOf(origin) !== -1) {
                        callback(null, true);
                    } else {
                        callback(new Error('Not allowed by CORS'));
                    }
                },
                methods: ["GET", "POST"],
                credentials: true,
                allowedHeaders: ["Authorization", "Content-Type"]
            },
            allowEIO3: true,
            transports: ['websocket', 'polling']
        });

        // Authentication middleware
        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token;
                if (!token) {
                    return next(new Error('Authentication error'));
                }

                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                socket.user = decoded;
                next();
            } catch (error) {
                next(new Error('Authentication error'));
            }
        });

        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.user.role);

            // Store user connection
            this.connectedUsers.set(socket.user._id, socket);

            // Join role-based room
            socket.join(socket.user.role);

            // Join pharmacy room if user is pharmacy staff
            if (socket.user.role === 'pharmacyStaff' && socket.user.pharmacy) {
                socket.join(`pharmacy:${socket.user.pharmacy}`);
            }

            socket.on('disconnect', () => {
                this.connectedUsers.delete(socket.user._id);
                console.log('Client disconnected:', socket.user.role);
            });
        });
    }

    // Emit order update to relevant users
    emitOrderUpdate(order, type = 'update') {
        if (!this.io) return;

        const event = {
            type,
            order
        };

        // Send to admin users
        this.io.to('admin').emit('orderUpdate', event);

        // Send to assigned pharmacy staff
        if (order.assignedPharmacy) {
            this.io.to(`pharmacy:${order.assignedPharmacy}`).emit('orderUpdate', event);
        }

        // Send to assigned delivery officer
        if (order.AssignedDeliveryOfficer) {
            const deliveryOfficerSocket = this.connectedUsers.get(order.AssignedDeliveryOfficer.toString());
            if (deliveryOfficerSocket) {
                deliveryOfficerSocket.emit('orderUpdate', event);
            }
        }

        // Send to order owner (customer)
        if (order.user) {
            const customerSocket = this.connectedUsers.get(order.user.toString());
            if (customerSocket) {
                customerSocket.emit('orderUpdate', event);
            }
        }
    }

    // Emit status update to relevant users
    emitStatusUpdate(orderId, status, updatedBy) {
        if (!this.io) return;

        const event = {
            type: 'statusUpdate',
            data: {
                orderId,
                status,
                updatedBy
            }
        };

        // Broadcast to all connected clients who have access to this order
        this.io.emit('statusUpdate', event);
    }

    // Emit error to specific user
    emitError(userId, error) {
        const socket = this.connectedUsers.get(userId);
        if (socket) {
            socket.emit('error', { message: error });
        }
    }
}

export default new WebSocketService();
