import { defineStore } from 'pinia';
import { ref, onMounted, onUnmounted } from 'vue';
import { websocketService } from '../services/websocket';
import type { Order } from '../types/order';
import { useAuthStore } from './auth';

export const useOrderStore = defineStore('orders', () => {
    const orders = ref<Order[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const totalOrders = ref(0);

    // Load orders with pagination and filters
    async function loadOrders(page = 1, filters = {}) {
        try {
            loading.value = true;
            error.value = null;
            
            const queryParams = new URLSearchParams({
                page: page.toString(),
                ...filters
            });

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${useAuthStore().token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch orders');

            const data = await response.json();
            orders.value = data.orders;
            currentPage.value = data.currentPage;
            totalPages.value = data.totalPages;
            totalOrders.value = data.total;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
        } finally {
            loading.value = false;
        }
    }

    // Handle real-time order updates
    function handleOrderUpdate(event: any) {
        const { type, order } = event;
        
        if (type === 'created') {
            // Add new order to list if it matches current filters
            orders.value = [order, ...orders.value];
            totalOrders.value++;
        } else if (type === 'updated') {
            // Update existing order
            const index = orders.value.findIndex(o => o._id === order._id);
            if (index !== -1) {
                orders.value[index] = order;
            }
        }
    }

    // Handle real-time status updates
    function handleStatusUpdate(event: any) {
        const { orderId, status, updatedBy } = event;
        
        const order = orders.value.find(o => o._id === orderId);
        if (order) {
            order.status = status;
            order.statusUpdates.push({
                status,
                updatedBy,
                timestamp: new Date()
            });
        }
    }

    // Setup WebSocket listeners
    function setupWebSocket() {
        websocketService.connect();
        websocketService.addEventListener('orderUpdate', handleOrderUpdate);
        websocketService.addEventListener('statusUpdate', handleStatusUpdate);
    }

    // Cleanup WebSocket listeners
    function cleanupWebSocket() {
        websocketService.removeEventListener('orderUpdate', handleOrderUpdate);
        websocketService.removeEventListener('statusUpdate', handleStatusUpdate);
        websocketService.disconnect();
    }

    // Setup and cleanup WebSocket connection
    onMounted(() => {
        setupWebSocket();
    });

    onUnmounted(() => {
        cleanupWebSocket();
    });

    return {
        orders,
        loading,
        error,
        currentPage,
        totalPages,
        totalOrders,
        loadOrders
    };
});
