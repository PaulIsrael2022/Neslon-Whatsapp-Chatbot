export interface User {
  _id: string;
  name?: string;
  email?: string;
  role: 'customer' | 'admin' | 'pharmacyStaff' | 'pharmacyAdmin' | 'deliveryOfficer' | 'deliveryCoordinator' | 'doctor';
  pharmacy?: string | Pharmacy;
  clinic?: string | Clinic;
  linkedMainMember?: string | LinkedMainMember;
  isActive: boolean;
  sessionStartTime?: Date;
  unreadMessages: number;
  phoneNumber: string;
  firstName?: string;
  middleName?: string;
  surname?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
  memberType?: 'Principal Member' | 'Dependent' | 'Unspecified' | 'PrivateClient' | '';
  selectedPharmacy?: string | Pharmacy;
  hasSeenWelcomeMessage: boolean;
  medicalAidProvider?: string;
  medicalAidNumber?: string;
  scheme?: string;
  dependentNumber?: string;
  isRegistrationComplete: boolean;
  lastInteraction?: Date;
  addresses?: {
    home: Array<{
      address: string;
      isSaved: boolean;
    }>;
    work: Array<{
      address: string;
      isSaved: boolean;
    }>;
  };
  medicalAidCardFront?: {
    data: Buffer;
    contentType: string;
  };
  medicalAidCardBack?: {
    data: Buffer;
    contentType: string;
  };
  preferences?: {
    notificationPreference: 'SMS' | 'WhatsApp' | 'Email';
    language: 'English' | 'Setswana';
  };
  adminInitiated?: boolean;
  termsAccepted: boolean;
  dependents?: Array<{
    dependentNumber: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: Date;
    id: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  _id: string;
  user: User;
  orderNumber: string;
  orderType: 'PRESCRIPTION_REFILL' | 'NEW_PRESCRIPTION' | 'OVER_THE_COUNTER';
  orderCategory?: 'WHATSAPP_REQUEST' | 'PHARMACY_PICKUP' | 'CUSTOMER_PICKUP';
  scriptNumber?: string;
  scriptValue?: number;
  medications: Array<{
    name: string;
    quantity: number;
    instructions?: string;
  }>;
  prescriptionImages?: Array<{
    data: Buffer;
    contentType: string;
    filename?: string;
  }>;
  prescriptionFor: 'Main Member' | 'Dependent Member' | 'Main & Dependent';
  pharmacyId?: string | Pharmacy;
  linkedMainMember?: string | LinkedMainMember;
  AssignedDeliveryOfficer?: string | User;
  isEmergencyOrder: boolean;
  dependent?: {
    dependentNumber: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: Date;
    id: string;
  };
  deliveryMethod: 'Delivery' | 'Pickup';
  deliveryAddress?: {
    type: 'Work' | 'Home';
    address: string;
  };
  pickupPharmacy?: string | Pharmacy;
  assignedStaff?: string | User;
  assignedPharmacy?: string | Pharmacy;
  extraNotes?: string;
  status: OrderStatus;
  statusUpdates: Array<{
    status: OrderStatus;
    note?: string;
    updatedBy: string | User;
    timestamp: Date;
  }>;
  deliverySchedule?: string;
  invoice?: {
    invoiceNumber: string;
    items: Array<{
      description: string;
      quantity: number;
      price: number;
    }>;
    total: number;
    generatedAt: Date;
    sentViaWhatsApp: boolean;
  };
  notifications: Array<{
    type: 'SMS' | 'WhatsApp' | 'Email';
    message: string;
    sentAt: Date;
    status: 'PENDING' | 'SENT' | 'FAILED';
    error?: string;
  }>;
  whatsappNotifications?: Array<{
    type: string;
    message: string;
    sentAt: Date;
    status: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 
  | 'PENDING'
  | 'PROCESSING'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'COMPLETED';

export interface Stats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  outForDelivery: number;
  completedOrders: number;
  cancelledOrders: number;
}

export interface Service {
  _id: string;
  name: string;
  description: string;
  category: 'Consultation' | 'Procedure' | 'Test' | 'Other';
  duration?: number;
  price: number;
  isActive: boolean;
  requiredDocuments?: string[];
  prerequisites?: string[];
  clinic?: string | Clinic;
  doctors?: string[] | Doctor[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  licenseNumber: string;
  services: string[] | Service[];
  clinic?: string | Clinic;
  isActive: boolean;
  contactInfo: {
    email: string;
    phone: string;
  };
  availability: Array<{
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }>;
  consultationFee: number;
  rating: number;
  reviews?: Array<{
    user: string | User;
    rating: number;
    comment: string;
    date: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Clinic {
  _id: string;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  website?: string;
  openingHours?: {
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };
  isActive: boolean;
  isPartner: boolean;
  doctors: string[] | Doctor[];
  services: string[] | Service[];
  specialties: string[];
  facilities: string[];
  location?: {
    type: string;
    coordinates: [number, number];
  };
  images?: Array<{
    url: string;
    caption: string;
  }>;
  rating?: number;
  reviews?: Array<{
    user: string | User;
    rating: number;
    comment: string;
    date: string;
  }>;
  insurance?: Array<{
    provider: string;
    planTypes: string[];
  }>;
  emergencyContact?: {
    name: string;
    phone: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Pharmacy {
  _id: string;
  name: string;
  address: string;
  phoneNumber: string;
  openingHours?: string;
  isActive: boolean;
  isPartner: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LinkedMainMember {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  medicalAidNumber: string;
  dateOfBirth: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Delivery {
  _id: string;
  order: string | Order;
  deliveryOfficer: string | User;
  coordinator: string | User;
  zone: string | DeliveryZone;
  deliveryAddress: {
    type: 'Home' | 'Work';
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  specialInstructions?: string;
  deliverySchedule: string;
  status: 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'ARRIVED' | 'DELIVERED' | 'FAILED' | 'CANCELLED';
  startTime?: string;
  completionTime?: string;
  estimatedArrival?: string;
  actualArrival?: string;
  deliveryAttempts: Array<{
    attemptTime: string;
    status: 'SUCCESS' | 'FAILED';
    reason?: string;
    notes?: string;
  }>;
  proofOfDelivery?: {
    signature?: {
      data: string;
      contentType: string;
    };
    photo?: {
      data: string;
      contentType: string;
    };
    receivedBy: string;
    timestamp: string;
  };
  trackingUpdates: Array<{
    status: string;
    location: {
      lat: number;
      lng: number;
      address: string;
    };
    timestamp: string;
    notes?: string;
  }>;
  feedback?: {
    rating: number;
    comment: string;
    timestamp: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryZone {
  _id: string;
  name: string;
  description?: string;
  areas: string[];
  boundaries?: {
    type: 'Polygon';
    coordinates: number[][];
  };
  basePrice: number;
  pricePerKm: number;
  minimumOrder: number;
  maxDistance: number;
  estimatedTime?: {
    min: number;
    max: number;
  };
  isActive: boolean;
  restrictions?: {
    maxWeight?: number;
    maxItems?: number;
    excludedItems?: string[];
  };
  deliverySchedule: {
    monday: DeliveryScheduleDay;
    tuesday: DeliveryScheduleDay;
    wednesday: DeliveryScheduleDay;
    thursday: DeliveryScheduleDay;
    friday: DeliveryScheduleDay;
    saturday: DeliveryScheduleDay;
    sunday: DeliveryScheduleDay;
  };
  assignedDrivers: Array<{
    driver: string | User;
    priority: number;
  }>;
  stats: {
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    averageDeliveryTime: number;
    customerRating: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface DeliveryScheduleDay {
  available: boolean;
  slots: Array<{
    time: string;
    maxDeliveries: number;
  }>;
}

export interface Settings {
  pharmacyAddress?: string;
  defaultLanguage: "English" | "Setswana";
  sessionTimeout: number;
  enableOrderNotifications: boolean;
  newFlowEnabled: boolean;
  
  passwordRequirements: {
    requireStrongPassword: boolean;
    minLength: number;
    requireNumbers: boolean;
    requireSymbols: boolean;
  };
  passwordExpiry: number;
  enable2FA: boolean;
  accessLogging: boolean;
  currencySymbol: string;

  businessInfo: {
    name?: string;
    registrationNumber?: string;
    vatNumber?: string;
    taxNumber?: string;
    address?: string;
    phone?: string;
    email?: string;
  };

  bankingInfo: {
    bankName?: string;
    accountNumber?: string;
    branchCode?: string;
    swiftCode?: string;
  };

  invoiceSettings: {
    autoGenerate: boolean;
    autoSend: boolean;
    prefix: string;
    nextNumber: number;
  };

  integrations: {
    whatsapp: {
      enabled: boolean;
      apiKey?: string;
      phoneNumberId?: string;
    };
    email: {
      enabled: boolean;
      host?: string;
      port?: number;
      secure?: boolean;
      user?: string;
      password?: string;
    };
    payment: {
      enabled: boolean;
      provider?: string;
      apiKey?: string;
      secretKey?: string;
    };
  };

  notificationPreferences: {
    orderNotifications: boolean;
    deliveryUpdates: boolean;
    notificationChannels: {
      push: boolean;
      email: boolean;
      sms: boolean;
    };
  };

  syncSettings: {
    autoSync: boolean;
    frequency: '5min' | '15min' | '30min' | '1hour' | 'manual';
    lastSync?: Date;
  };

  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    pages: number;
  };
}

export interface OrderFilters {
  search?: string;
  status?: OrderStatus;
  orderType?: string;
  orderCategory?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface PharmacyFilters {
  search?: string;
  isActive?: boolean;
  isPartner?: boolean;
  page?: number;
  limit?: number;
}

export interface NotificationFilters {
  type?: string;
  status?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export interface ChatMessage {
  _id: string;
  sender: 'user' | 'admin';
  content: string;
  timestamp: Date;
  category: string;
}

export interface Medication {
  _id: string;
  name: string;
  description?: string;
  type: 'PRESCRIPTION' | 'OVER_THE_COUNTER';
  quantity: number;
  minimumQuantity: number;
  unit: 'TABLETS' | 'CAPSULES' | 'ML' | 'MG' | 'PIECES';
  price: number;
  manufacturer?: string;
  expiryDate?: string;
  batchNumber?: string;
  location?: string;
  pharmacy: string | Pharmacy;
  instructions?: string;
  sideEffects?: string[];
  contraindications?: string[];
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  lastRestockDate?: string;
  createdBy: string | User;
  updatedBy?: string | User;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryTransaction {
  _id: string;
  medication: string | Medication;
  type: 'RESTOCK' | 'DISPENSE' | 'ADJUSTMENT' | 'RETURN' | 'EXPIRED';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  order?: string | Order;
  batchNumber?: string;
  expiryDate?: string;
  cost?: number;
  supplier?: string;
  performedBy: string | User;
  pharmacy: string | Pharmacy;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}