&lt;template>
  <div class="order-list">
    <!-- Loading state -->
    <div v-if="orderStore.loading" class="loading-state">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p class="text-gray-600">Loading orders...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="orderStore.error" class="error-state">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ orderStore.error }}
      </div>
    </div>

    <!-- Orders list -->
    <div v-else class="orders-container">
      <!-- Filters -->
      <div class="filters mb-4 flex gap-4">
        <select v-model="filters.status" class="form-select" @change="handleFilterChange">
          <option value="">All Statuses</option>
          <option v-for="status in orderStatuses" :key="status" :value="status">
            {{ formatStatus(status) }}
          </option>
        </select>

        <select v-model="filters.orderType" class="form-select" @change="handleFilterChange">
          <option value="">All Types</option>
          <option value="PRESCRIPTION_REFILL">Prescription Refill</option>
          <option value="NEW_PRESCRIPTION">New Prescription</option>
          <option value="OVER_THE_COUNTER">Over The Counter</option>
        </select>

        <input 
          type="text" 
          v-model="filters.search" 
          placeholder="Search orders..." 
          class="form-input"
          @input="handleSearchDebounced"
        >
      </div>

      <!-- Orders grid -->
      <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="order in orderStore.orders" 
          :key="order._id" 
          class="order-card bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          :class="{'border-l-4': order.isEmergencyOrder}"
          :style="{ borderColor: order.isEmergencyOrder ? '#dc2626' : 'transparent' }"
        >
          <!-- Order header -->
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="font-semibold text-lg">#{{ order.orderNumber }}</h3>
              <p class="text-sm text-gray-600">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div 
              class="status-badge px-3 py-1 rounded-full text-sm"
              :class="getStatusClass(order.status)"
            >
              {{ formatStatus(order.status) }}
            </div>
          </div>

          <!-- Order details -->
          <div class="mb-3">
            <p class="text-sm text-gray-700">
              <span class="font-medium">Type:</span> {{ formatOrderType(order.orderType) }}
            </p>
            <p class="text-sm text-gray-700">
              <span class="font-medium">Category:</span> {{ formatOrderCategory(order.orderCategory) }}
            </p>
            <p class="text-sm text-gray-700" v-if="order.medications?.length">
              <span class="font-medium">Medications:</span> {{ order.medications.length }}
            </p>
          </div>

          <!-- Assigned info -->
          <div class="text-sm text-gray-700">
            <p v-if="order.assignedPharmacy">
              <span class="font-medium">Pharmacy:</span> {{ order.assignedPharmacy.name }}
            </p>
            <p v-if="order.AssignedDeliveryOfficer">
              <span class="font-medium">Delivery Officer:</span> 
              {{ `${order.AssignedDeliveryOfficer.firstName} ${order.AssignedDeliveryOfficer.surname}` }}
            </p>
          </div>

          <!-- Action buttons -->
          <div class="mt-4 flex gap-2">
            <button 
              @click="viewOrderDetails(order)"
              class="btn-primary text-sm py-1 px-3"
            >
              View Details
            </button>
            <button 
              v-if="canUpdateStatus(order)"
              @click="updateOrderStatus(order)"
              class="btn-secondary text-sm py-1 px-3"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="orderStore.totalPages > 1" class="pagination mt-4 flex justify-center gap-2">
        <button 
          class="btn-secondary px-3 py-1"
          :disabled="orderStore.currentPage === 1"
          @click="changePage(orderStore.currentPage - 1)"
        >
          Previous
        </button>
        <span class="px-3 py-1">
          Page {{ orderStore.currentPage }} of {{ orderStore.totalPages }}
        </span>
        <button 
          class="btn-secondary px-3 py-1"
          :disabled="orderStore.currentPage === orderStore.totalPages"
          @click="changePage(orderStore.currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Order details modal -->
    <OrderDetailsModal 
      v-if="selectedOrder"
      :order="selectedOrder"
      @close="selectedOrder = null"
    />

    <!-- Status update modal -->
    <OrderStatusModal
      v-if="orderToUpdate"
      :order="orderToUpdate"
      @close="orderToUpdate = null"
      @update="handleStatusUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useOrderStore } from '../stores/orders';
import { useAuthStore } from '../stores/auth';
import OrderDetailsModal from './OrderDetailsModal.vue';
import OrderStatusModal from './OrderStatusModal.vue';
import debounce from 'lodash/debounce';

const orderStore = useOrderStore();
const authStore = useAuthStore();

const selectedOrder = ref(null);
const orderToUpdate = ref(null);
const filters = ref({
  status: '',
  orderType: '',
  search: ''
});

const orderStatuses = [
  'PENDING',
  'PROCESSING',
  'READY_FOR_PICKUP',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'COMPLETED'
];

// Load initial data
onMounted(() => {
  loadOrders();
});

// Watch for filter changes
watch(filters, () => {
  orderStore.currentPage = 1;
  loadOrders();
}, { deep: true });

// Load orders with current filters
async function loadOrders() {
  const queryParams = {
    page: orderStore.currentPage,
    ...filters.value
  };
  await orderStore.loadOrders(queryParams);
}

// Handle filter changes
function handleFilterChange() {
  loadOrders();
}

// Debounced search handler
const handleSearchDebounced = debounce(() => {
  loadOrders();
}, 300);

// Page change handler
function changePage(page: number) {
  orderStore.currentPage = page;
  loadOrders();
}

// Format helpers
function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
}

function formatOrderType(type: string) {
  return type.replace(/_/g, ' ').toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
}

function formatOrderCategory(category: string) {
  return category.replace(/_/g, ' ').toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
}

// Status badge styling
function getStatusClass(status: string) {
  const classes = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'PROCESSING': 'bg-blue-100 text-blue-800',
    'READY_FOR_PICKUP': 'bg-purple-100 text-purple-800',
    'OUT_FOR_DELIVERY': 'bg-indigo-100 text-indigo-800',
    'DELIVERED': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800',
    'COMPLETED': 'bg-green-100 text-green-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
}

// Action handlers
function viewOrderDetails(order: any) {
  selectedOrder.value = order;
}

function updateOrderStatus(order: any) {
  orderToUpdate.value = order;
}

// Permission check
function canUpdateStatus(order: any) {
  const role = authStore.user?.role;
  return ['admin', 'pharmacyStaff', 'deliveryOfficer'].includes(role);
}

async function handleStatusUpdate(orderId: string, newStatus: string) {
  try {
    // Update will be handled by WebSocket
    orderToUpdate.value = null;
  } catch (error) {
    console.error('Error updating order status:', error);
  }
}
</script>

<style scoped>
.order-list {
  @apply p-4;
}

.loading-state {
  @apply flex flex-col items-center justify-center space-y-2 py-8;
}

.error-state {
  @apply py-4;
}

.form-select {
  @apply rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50;
}

.form-input {
  @apply rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50;
}

.btn-primary {
  @apply bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50;
}

.order-card {
  @apply relative overflow-hidden;
}

.status-badge {
  @apply text-xs font-semibold;
}
</style>
