import WhatsAppService from './WhatsAppService.js';
import EmailService from './EmailService.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

class NotificationService {
    constructor() {
        // Flag to control notification sending
        this.isEnabled = false;
        
        this.statusMessages = {
            PENDING: 'Your order has been received and is being processed',
            CONFIRMED: 'Your order has been confirmed',
            ASSIGNED_TO_PHARMACY: 'Your order has been assigned to a pharmacy',
            PROCESSING: 'Your order is being processed by the pharmacy',
            READY_FOR_DELIVERY: 'Your order is ready for delivery',
            OUT_FOR_DELIVERY: 'Your order is out for delivery',
            DELIVERED: 'Your order has been delivered successfully',
            CANCELLED: 'Your order has been cancelled'
        };
    }

    async createNotification(data) {
        try {
            // Set system user as sender if not provided
            if (!data.sender) {
                const systemUser = await User.findOne({ role: 'admin' });
                if (!systemUser) {
                    throw new Error('System user not found');
                }
                data.sender = systemUser._id;
            }

            // Convert type to uppercase
            if (data.type) {
                data.type = data.type.toUpperCase();
            }

            const notification = new Notification({
                type: data.type,
                sender: data.sender,
                recipients: data.recipients.map(recipient => ({
                    user: recipient,
                    status: 'PENDING'
                })),
                message: data.message,
                subject: data.subject,
                media: data.media,
                scheduledFor: data.scheduledFor || new Date(),
                isRecurring: data.isRecurring || false,
                recurringPattern: data.recurringPattern,
                metadata: data.metadata,
                template: data.template,
                priority: data.priority || 'MEDIUM',
                tags: data.tags,
            });

            await notification.save();
            
            if (!this.isEnabled) {
                console.log('Notifications are disabled. Notification created but not sent:', {
                    id: notification._id,
                    type: notification.type,
                    recipients: notification.recipients.length
                });
                return notification;
            }
            
            if (!data.scheduledFor || data.scheduledFor <= new Date()) {
                await this.sendNotification(notification);
            }

            return notification;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }

    async sendNotification(notification) {
        try {
            if (!this.isEnabled) {
                console.log('Notifications are disabled. Would have sent notification:', {
                    id: notification._id,
                    type: notification.type,
                    recipients: notification.recipients.length
                });
                return notification;
            }

            const promises = notification.recipients.map(async (recipient) => {
                if (recipient.status !== 'PENDING') return;

                try {
                    const user = await this.getUserDetails(recipient.user);
                    
                    if (notification.type === 'EMAIL') {
                        await this.sendEmail(notification, user);
                    } else if (notification.type === 'WHATSAPP') {
                        await this.sendWhatsApp(notification, user);
                    }

                    recipient.status = 'SENT';
                    recipient.deliveredAt = new Date();
                } catch (error) {
                    recipient.status = 'FAILED';
                    recipient.failureReason = error.message;
                    console.error(`Failed to send notification to ${recipient.user}:`, error);
                }
            });

            await Promise.all(promises);
            await notification.save();

            return notification;
        } catch (error) {
            console.error('Error sending notification:', error);
            throw error;
        }
    }

    async sendEmail(notification, user) {
        if (!this.isEnabled) {
            console.log('Email notifications are disabled. Would have sent email to:', user.email);
            return;
        }

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: notification.subject || 'MedDelivery Notification',
            text: notification.message
        };

        if (notification.media) {
            mailOptions.attachments = [{
                filename: notification.media.filename,
                content: notification.media.data,
                contentType: notification.media.contentType
            }];
        }

        await EmailService.sendMail(mailOptions);
    }

    async sendWhatsApp(notification, user) {
        if (!this.isEnabled) {
            console.log('WhatsApp notifications are disabled. Would have sent WhatsApp to:', user.phoneNumber);
            return;
        }

        await WhatsAppService.sendMessage(
            user.phoneNumber,
            notification.message,
            notification.media
        );
    }

    async getUserDetails(userId) {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');
        return user;
    }

    async sendOrderStatusNotification(order, sender) {
        try {
            if (!order.user?.phoneNumber) return;

            const message = this.getOrderStatusMessage(order);
            const notification = {
                type: 'WHATSAPP',
                sender: sender || (await User.findOne({ role: 'admin' }))._id,
                message,
                recipients: [order.user._id],
                metadata: {
                    orderId: order._id,
                    orderNumber: order.orderNumber,
                    status: order.status
                },
                tags: ['order_status']
            };

            const result = await this.createNotification(notification);

            // Add to order's notification history
            order.notifications.push({
                type: 'WHATSAPP',
                message,
                sentAt: new Date(),
                status: this.isEnabled ? 'SENT' : 'PENDING',
                error: this.isEnabled ? undefined : 'Notifications are disabled'
            });
            await order.save();

            return result;
        } catch (error) {
            console.error('Error sending order status notification:', error);
            throw error;
        }
    }

    async sendDeliveryAssignmentNotification(order, deliveryOfficer, sender) {
        try {
            const message = `New delivery assignment: Order ${order.orderNumber}. Please check your dashboard for details.`;
            const notification = {
                type: 'WHATSAPP',
                sender: sender || (await User.findOne({ role: 'admin' }))._id,
                message,
                recipients: [deliveryOfficer._id],
                metadata: {
                    orderId: order._id,
                    orderNumber: order.orderNumber
                },
                tags: ['delivery_assignment']
            };

            const result = await this.createNotification(notification);

            // Add to order's notification history
            order.notifications.push({
                type: 'WHATSAPP',
                message,
                sentAt: new Date(),
                status: this.isEnabled ? 'SENT' : 'PENDING',
                error: this.isEnabled ? undefined : 'Notifications are disabled'
            });
            await order.save();

            return result;
        } catch (error) {
            console.error('Error sending delivery assignment notification:', error);
            throw error;
        }
    }

    async sendPharmacyAssignmentNotification(order, sender) {
        try {
            const pharmacyStaff = await User.find({
                pharmacy: order.assignedPharmacy,
                role: 'pharmacyStaff',
                isActive: true
            });

            const message = `New order assignment: Order ${order.orderNumber}. Please check your dashboard for details.`;
            const notification = {
                type: 'WHATSAPP',
                sender: sender || (await User.findOne({ role: 'admin' }))._id,
                message,
                recipients: pharmacyStaff.map(staff => staff._id),
                metadata: {
                    orderId: order._id,
                    orderNumber: order.orderNumber,
                    pharmacyId: order.assignedPharmacy
                },
                tags: ['pharmacy_assignment']
            };

            const result = await this.createNotification(notification);

            // Add to order's notification history
            order.notifications.push({
                type: 'WHATSAPP',
                message,
                sentAt: new Date(),
                status: this.isEnabled ? 'SENT' : 'PENDING',
                error: this.isEnabled ? undefined : 'Notifications are disabled'
            });
            await order.save();

            return result;
        } catch (error) {
            console.error('Error sending pharmacy assignment notification:', error);
            throw error;
        }
    }

    async sendCustomNotification(order, type, message, sender) {
        try {
            const notification = {
                type: type.toUpperCase(),
                sender: sender || (await User.findOne({ role: 'admin' }))._id,
                message,
                recipients: [order.user._id],
                metadata: {
                    orderId: order._id,
                    orderNumber: order.orderNumber
                },
                tags: ['custom']
            };

            const result = await this.createNotification(notification);

            // Add to order's notification history
            order.notifications.push({
                type: type.toUpperCase(),
                message,
                sentAt: new Date(),
                status: this.isEnabled ? 'SENT' : 'PENDING',
                error: this.isEnabled ? undefined : 'Notifications are disabled'
            });
            await order.save();

            return result;
        } catch (error) {
            console.error('Error sending custom notification:', error);
            throw error;
        }
    }

    getOrderStatusMessage(order) {
        const baseMessage = this.statusMessages[order.status];
        const orderDetails = `Order #${order.orderNumber}`;
        return `${orderDetails}: ${baseMessage}`;
    }

    async getNotifications(filters = {}) {
        try {
            const query = {};

            if (filters.type) query.type = filters.type;
            if (filters.status) query['recipients.status'] = filters.status;
            if (filters.userId) query['recipients.user'] = filters.userId;
            if (filters.startDate) query.createdAt = { $gte: new Date(filters.startDate) };
            if (filters.endDate) query.createdAt = { ...query.createdAt, $lte: new Date(filters.endDate) };

            const notifications = await Notification.find(query)
                .populate('sender', 'name email')
                .populate('recipients.user', 'name email phoneNumber')
                .sort({ createdAt: -1 });

            return notifications;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    }

    async processScheduledNotifications() {
        if (!this.isEnabled) {
            console.log('Scheduled notifications are disabled');
            return;
        }

        try {
            const now = new Date();
            const pendingNotifications = await Notification.find({
                scheduledFor: { $lte: now },
                'recipients.status': 'PENDING'
            });

            for (const notification of pendingNotifications) {
                await this.sendNotification(notification);

                if (notification.isRecurring && notification.recurringPattern) {
                    await this.scheduleNextRecurrence(notification);
                }
            }
        } catch (error) {
            console.error('Error processing scheduled notifications:', error);
            throw error;
        }
    }

    async scheduleNextRecurrence(notification) {
        try {
            const nextSchedule = this.calculateNextSchedule(
                notification.scheduledFor,
                notification.recurringPattern
            );

            if (nextSchedule && (!notification.recurringPattern.endDate || nextSchedule <= notification.recurringPattern.endDate)) {
                const newNotification = new Notification({
                    ...notification.toObject(),
                    _id: undefined,
                    scheduledFor: nextSchedule,
                    recipients: notification.recipients.map(r => ({
                        user: r.user,
                        status: 'PENDING'
                    })),
                    createdAt: undefined,
                    updatedAt: undefined
                });

                await newNotification.save();
            }
        } catch (error) {
            console.error('Error scheduling next recurrence:', error);
            throw error;
        }
    }

    calculateNextSchedule(currentSchedule, pattern) {
        const next = new Date(currentSchedule);

        switch (pattern.frequency) {
            case 'DAILY':
                next.setDate(next.getDate() + pattern.interval);
                break;
            case 'WEEKLY':
                next.setDate(next.getDate() + (pattern.interval * 7));
                break;
            case 'MONTHLY':
                next.setMonth(next.getMonth() + pattern.interval);
                break;
            case 'YEARLY':
                next.setFullYear(next.getFullYear() + pattern.interval);
                break;
        }

        return next;
    }
}

export default new NotificationService();