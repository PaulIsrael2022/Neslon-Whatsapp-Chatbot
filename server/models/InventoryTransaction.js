import mongoose from 'mongoose';

const inventoryTransactionSchema = new mongoose.Schema({
  medication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['RESTOCK', 'DISPENSE', 'ADJUSTMENT', 'RETURN', 'EXPIRED'],
    required: true,
    index: true
  },
  quantity: {
    type: Number,
    required: true
  },
  previousQuantity: {
    type: Number,
    required: true
  },
  newQuantity: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  batchNumber: String,
  expiryDate: Date,
  cost: {
    type: Number,
    min: 0
  },
  supplier: String,
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacy',
    required: true,
    index: true
  },
  notes: String
}, {
  timestamps: true
});

const InventoryTransaction = mongoose.model('InventoryTransaction', inventoryTransactionSchema);

export default InventoryTransaction;