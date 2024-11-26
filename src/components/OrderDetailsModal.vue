&lt;template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="text-xl font-semibold">Order Details #{{ order.orderNumber }}</h2>
        <button @click="$emit('close')" class="close-button">
          <span class="sr-only">Close</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <!-- Order Status -->
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">Status</h3>
            <span 
              class="status-badge px-3 py-1 rounded-full"
              :class="getStatusClass(order.status)"
            >
              {{ formatStatus(order.status) }}
            </span>
          </div>
          
          <!-- Status Timeline -->
          <div class="mt-4 space-y-3">
            <div 
              v-for="(update, index) in order.statusUpdates" 
              :key="index"
              class="flex items-start space-x-3"
            >
              <div class="flex-shrink-0">
                <div class="h-2 w-2 rounded-full bg-primary mt-2"></div>
              </div>
              <div class="flex-grow">
                <p class="text-sm font-medium">{{ formatStatus(update.status) }}</p>
                <p class="text-xs text-gray-500">
                  {{ formatDate(update.timestamp) }}
                  {{ update.note ? `- ${update.note}` : '' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Information -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">Customer Information</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Name</p>
              <p class="font-medium">{{ order.user?.firstName }} {{ order.user?.surname }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Phone</p>
              <p class="font-medium">{{ order.user?.phoneNumber }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Email</p>
              <p class="font-medium">{{ order.user?.email }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Medical Aid</p>
              <p class="font-medium">{{ order.user?.medicalAidProvider || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <!-- Order Information -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">Order Information</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Order Type</p>
              <p class="font-medium">{{ formatOrderType(order.orderType) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Category</p>
              <p class="font-medium">{{ formatOrderCategory(order.orderCategory) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Created At</p>
              <p class="font-medium">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Emergency Order</p>
              <p class="font-medium">{{ order.isEmergencyOrder ? 'Yes' : 'No' }}</p>
            </div>
          </div>
        </div>

        <!-- Medications -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">Medications</h3>
          <div class="space-y-2">
            <div 
              v-for="(med, index) in order.medications" 
              :key="index"
              class="bg-gray-50 p-3 rounded-md"
            >
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-medium">{{ med.name }}</p>
                  <p class="text-sm text-gray-600">Quantity: {{ med.quantity }}</p>
                </div>
                <p class="text-sm text-gray-600">{{ med.instructions }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Delivery Information -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">Delivery Information</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Method</p>
              <p class="font-medium">{{ order.deliveryMethod }}</p>
            </div>
            <div v-if="order.deliveryAddress">
              <p class="text-sm text-gray-600">Address Type</p>
              <p class="font-medium">{{ order.deliveryAddress.type }}</p>
            </div>
            <div v-if="order.deliveryAddress" class="col-span-2">
              <p class="text-sm text-gray-600">Address</p>
              <p class="font-medium">{{ order.deliveryAddress.address }}</p>
            </div>
            <div v-if="order.deliverySchedule">
              <p class="text-sm text-gray-600">Schedule</p>
              <p class="font-medium">{{ order.deliverySchedule }}</p>
            </div>
          </div>
        </div>

        <!-- Assignment Information -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">Assignment Information</h3>
          <div class="grid grid-cols-2 gap-4">
            <div v-if="order.assignedPharmacy">
              <p class="text-sm text-gray-600">Assigned Pharmacy</p>
              <p class="font-medium">{{ order.assignedPharmacy.name }}</p>
            </div>
            <div v-if="order.AssignedDeliveryOfficer">
              <p class="text-sm text-gray-600">Delivery Officer</p>
              <p class="font-medium">
                {{ order.AssignedDeliveryOfficer.firstName }} 
                {{ order.AssignedDeliveryOfficer.surname }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button 
          @click="$emit('close')"
          class="btn-secondary"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
});

defineEmits(['close']);

function formatDate(date: string) {
  return new Date(date).toLocaleString();
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
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50;
}

.modal-content {
  @apply bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto;
}

.modal-header {
  @apply flex justify-between items-center p-4 border-b;
}

.modal-body {
  @apply p-4;
}

.modal-footer {
  @apply flex justify-end gap-2 p-4 border-t;
}

.close-button {
  @apply text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50;
}
</style>
