import { Server } from 'socket.io';

class SocketService {
    constructor() {
        this.io = null;
        this.connectedUsers = new Map(); // Store user ID -> socket ID mapping
    }

    initialize(server) {
        this.io = new Server(server, {
            cors: {
                origin: process.env.CLIENT_URL || "http://localhost:5173",
                methods: ["GET", "POST"]
            }
        });

        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            // Handle user authentication
            socket.on('authenticate', async (userData) => {
                const userId = userData.userId;
                const userRole = userData.role;
                
                // Store user connection info
                this.connectedUsers.set(userId, {
                    socketId: socket.id,
                    role: userRole
                });

                // Join role-based room
                socket.join(userRole);
                
                // Join user-specific room
                socket.join(`user:${userId}`);
            });

            socket.on('disconnect', () => {
                // Remove user from connected users on disconnect
                for (const [userId, data] of this.connectedUsers.entries()) {
                    if (data.socketId === socket.id) {
                        this.connectedUsers.delete(userId);
                        break;
                    }
                }
            });
        });
    }

    // Emit order updates based on user roles
    emitOrderUpdate(order, updateType) {
        if (!this.io) return;

        const event = {
            type: updateType,
            order: order
        };

        // Emit to specific roles based on the order
        this.io.to('admin').emit('orderUpdate', event);
        
        // Emit to pharmacy staff if assigned
        if (order.assignedPharmacy) {
            this.io.to(`pharmacy:${order.assignedPharmacy}`).emit('orderUpdate', event);
        }

        // Emit to delivery officer if assigned
        if (order.AssignedDeliveryOfficer) {
            this.io.to(`user:${order.AssignedDeliveryOfficer}`).emit('orderUpdate', event);
        }

        // Emit to customer
        if (order.user) {
            this.io.to(`user:${order.user}`).emit('orderUpdate', event);
        }
    }

    // Emit status updates
    emitStatusUpdate(orderId, status, updatedBy) {
        if (!this.io) return;
        
        const event = {
            type: 'statusUpdate',
            orderId,
            status,
            updatedBy
        };

        this.io.emit('statusUpdate', event);
    }
}

export default new SocketService();
