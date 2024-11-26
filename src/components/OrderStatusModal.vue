&lt;template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="text-xl font-semibold">Update Order Status</h2>
        <button @click="$emit('close')" class="close-button">
          <span class="sr-only">Close</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <div class="space-y-4">
          <!-- Current Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Current Status</label>
            <div 
              class="mt-1 px-3 py-2 rounded-md"
              :class="getStatusClass(order.status)"
            >
              {{ formatStatus(order.status) }}
            </div>
          </div>

          <!-- New Status -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">New Status</label>
            <select
              id="status"
              v-model="selectedStatus"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              required
            >
              <option value="">Select Status</option>
              <option 
                v-for="status in allowedStatuses" 
                :key="status" 
                :value="status"
              >
                {{ formatStatus(status) }}
              </option>
            </select>
          </div>

          <!-- Note -->
          <div>
            <label for="note" class="block text-sm font-medium text-gray-700">Note (Optional)</label>
            <textarea
              id="note"
              v-model="note"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              placeholder="Add a note about this status change..."
            ></textarea>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-4">
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
      </form>

      <div class="modal-footer">
        <button 
          type="button" 
          @click="$emit('close')"
          class="btn-secondary"
        >
          Cancel
        </button>
        <button 
          type="button"
          @click="handleSubmit"
          :disabled="!selectedStatus || loading"
          class="btn-primary"
          :class="{ 'opacity-50 cursor-not-allowed': !selectedStatus || loading }"
        >
          {{ loading ? 'Updating...' : 'Update Status' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'update']);

const authStore = useAuthStore();
const selectedStatus = ref('');
const note = ref('');
const loading = ref(false);
const error = ref('');

// Compute allowed status transitions based on user role and current status
const allowedStatuses = computed(() => {
  const role = authStore.user?.role;
  const currentStatus = props.order.status;
  
  const statusTransitions = {
    'admin': [
      'PENDING',
      'PROCESSING',
      'READY_FOR_PICKUP',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'CANCELLED',
      'COMPLETED'
    ],
    'pharmacyStaff': {
      'PENDING': ['PROCESSING', 'CANCELLED'],
      'PROCESSING': ['READY_FOR_PICKUP', 'CANCELLED'],
      'READY_FOR_PICKUP': ['PROCESSING', 'OUT_FOR_DELIVERY']
    },
    'deliveryOfficer': {
      'READY_FOR_PICKUP': ['OUT_FOR_DELIVERY'],
      'OUT_FOR_DELIVERY': ['DELIVERED', 'CANCELLED']
    }
  };

  if (role === 'admin') {
    return statusTransitions.admin;
  }

  return statusTransitions[role]?.[currentStatus] || [];
});

async function handleSubmit() {
  if (!selectedStatus.value) return;

  try {
    loading.value = true;
    error.value = '';

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${props.order._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        status: selectedStatus.value,
        note: note.value
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update order status');
    }

    // The actual update will be handled by WebSocket
    emit('update', props.order._id, selectedStatus.value);
    emit('close');
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred';
  } finally {
    loading.value = false;
  }
}

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').toLowerCase()
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
  @apply bg-white rounded-lg shadow-xl w-full max-w-lg;
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

.btn-primary {
  @apply bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50;
}
</style>
