import type { User, Order, Stats } from '../types';

export const mockUsers: Record<string, { user: User; password: string }> = {
  'admin@pharmacy.com': {
    user: {
      _id: '1',
      name: 'Admin User',
      email: 'admin@pharmacy.com',
      role: 'admin',
      isActive: true,
      phoneNumber: '+1234567890',
      isRegistrationComplete: true,
      firstName: 'Admin',
      surname: 'User',
      medicalAidProvider: 'Discovery Health',
      medicalAidNumber: 'DH123456',
      scheme: 'Executive Plan'
    },
    password: 'admin123'
  },
  'staff@pharmacy.com': {
    user: {
      _id: '2',
      name: 'Staff User',
      email: 'staff@pharmacy.com',
      role: 'pharmacyStaff',
      pharmacy: 'pharmacy1',
      isActive: true,
      phoneNumber: '+1234567891',
      isRegistrationComplete: true,
      firstName: 'Staff',
      surname: 'User'
    },
    password: 'staff123'
  },
  'delivery@pharmacy.com': {
    user: {
      _id: '3',
      name: 'Delivery Officer',
      email: 'delivery@pharmacy.com',
      role: 'deliveryOfficer',
      isActive: true,
      phoneNumber: '+1234567892',
      isRegistrationComplete: true,
      firstName: 'Delivery',
      surname: 'Officer'
    },
    password: 'delivery123'
  }
};

export const mockOrders: Order[] = [
  {
    _id: '1',
    user: mockUsers['admin@pharmacy.com'].user,
    orderNumber: 'RX-2024-001',
    orderType: 'PRESCRIPTION_REFILL',
    scriptNumber: 'SCRIPT001',
    scriptValue: 150.00,
    medications: [
      {
        name: 'Amoxicillin',
        quantity: 30,
        instructions: 'Take one capsule three times daily'
      },
      {
        name: 'Ibuprofen',
        quantity: 20,
        instructions: 'Take as needed for pain'
      }
    ],
    prescriptionFor: 'Main Member',
    isEmergencyOrder: false,
    deliveryMethod: 'Delivery',
    deliveryAddress: {
      type: 'Home',
      address: '123 Main St, City, State 12345'
    },
    status: 'PENDING',
    deliverySchedule: '9:30 AM - 11:00 AM',
    extraNotes: 'Please call before delivery',
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
    prescriptionImages: [
      {
        data: 'base64string',
        contentType: 'image/jpeg'
      }
    ]
  },
  {
    _id: '2',
    user: {
      _id: '4',
      firstName: 'Jane',
      surname: 'Smith',
      email: 'jane@example.com',
      phoneNumber: '+1234567893',
      role: 'customer',
      isActive: true,
      isRegistrationComplete: true,
      medicalAidProvider: 'Bonitas',
      medicalAidNumber: 'BON789012',
      scheme: 'Standard Plan',
      medicalAidCardFront: {
        data: 'base64string',
        contentType: 'image/jpeg'
      },
      medicalAidCardBack: {
        data: 'base64string',
        contentType: 'image/jpeg'
      }
    },
    orderNumber: 'RX-2024-002',
    orderType: 'NEW_PRESCRIPTION',
    medications: [
      {
        name: 'Metformin',
        quantity: 60,
        instructions: 'Take one tablet twice daily with meals'
      }
    ],
    prescriptionFor: 'Main Member',
    isEmergencyOrder: true,
    deliveryMethod: 'Pickup',
    pickupPharmacy: 'pharmacy1',
    status: 'PROCESSING',
    createdAt: '2024-03-09T15:30:00Z',
    updatedAt: '2024-03-09T16:00:00Z'
  },
  {
    _id: '3',
    user: {
      _id: '5',
      firstName: 'Bob',
      surname: 'Johnson',
      email: 'bob@example.com',
      phoneNumber: '+1234567894',
      role: 'customer',
      isActive: true,
      isRegistrationComplete: true
    },
    orderNumber: 'OTC-2024-001',
    orderType: 'OVER_THE_COUNTER',
    medications: [
      {
        name: 'Vitamin C',
        quantity: 100,
        instructions: 'Take one tablet daily'
      },
      {
        name: 'Zinc Supplements',
        quantity: 50,
        instructions: 'Take one tablet daily'
      }
    ],
    prescriptionFor: 'Main Member',
    isEmergencyOrder: false,
    deliveryMethod: 'Delivery',
    deliveryAddress: {
      type: 'Work',
      address: '456 Business Ave, City, State 12345'
    },
    status: 'OUT_FOR_DELIVERY',
    deliverySchedule: '1:30 PM - 3:00 PM',
    AssignedDeliveryOfficer: mockUsers['delivery@pharmacy.com'].user._id,
    createdAt: '2024-03-08T09:00:00Z',
    updatedAt: '2024-03-08T09:30:00Z'
  },
  {
    _id: '4',
    user: {
      _id: '6',
      firstName: 'Sarah',
      surname: 'Williams',
      email: 'sarah@example.com',
      phoneNumber: '+1234567895',
      role: 'customer',
      isActive: true,
      isRegistrationComplete: true,
      medicalAidProvider: 'Momentum',
      medicalAidNumber: 'MOM456789',
      scheme: 'Premium Plan'
    },
    orderNumber: 'RX-2024-003',
    orderType: 'PRESCRIPTION_REFILL',
    scriptNumber: 'SCRIPT003',
    scriptValue: 300.00,
    medications: [
      {
        name: 'Insulin',
        quantity: 5,
        instructions: 'As prescribed'
      }
    ],
    prescriptionFor: 'Main Member',
    isEmergencyOrder: false,
    deliveryMethod: 'Pickup',
    pickupPharmacy: 'pharmacy1',
    status: 'READY_FOR_PICKUP',
    createdAt: '2024-03-07T14:00:00Z',
    updatedAt: '2024-03-07T14:30:00Z'
  },
  {
    _id: '5',
    user: {
      _id: '7',
      firstName: 'Michael',
      surname: 'Brown',
      email: 'michael@example.com',
      phoneNumber: '+1234567896',
      role: 'customer',
      isActive: true,
      isRegistrationComplete: true
    },
    orderNumber: 'OTC-2024-002',
    orderType: 'OVER_THE_COUNTER',
    medications: [
      {
        name: 'Pain Relief Gel',
        quantity: 1,
        instructions: 'Apply as needed'
      }
    ],
    prescriptionFor: 'Main Member',
    isEmergencyOrder: false,
    deliveryMethod: 'Delivery',
    deliveryAddress: {
      type: 'Home',
      address: '789 Residential St, City, State 12345'
    },
    status: 'COMPLETED',
    deliverySchedule: '4:30 PM - 6:00 PM',
    createdAt: '2024-03-06T16:00:00Z',
    updatedAt: '2024-03-06T18:00:00Z'
  }
];

export const mockStats: Stats = {
  totalOrders: 150,
  pendingOrders: 45,
  processingOrders: 30,
  outForDelivery: 25,
  completedOrders: 40,
  cancelledOrders: 10
};