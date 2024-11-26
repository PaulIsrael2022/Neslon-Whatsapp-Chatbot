import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    role: {
      type: String,
      enum: [
        "customer",
        "admin",
        "pharmacyStaff",
        "pharmacyAdmin",
        "deliveryOfficer",
        "deliveryCoordinator",
        "doctor"
      ],
      default: "customer",
    },
    pharmacy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmacy",
      required: function () {
        return this.role === "pharmacyStaff" || this.role === "pharmacyAdmin";
      },
    },
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: function () {
        return this.role === "doctor";
      },
    },
    linkedMainMember: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LinkedMainMember",
      default: null,
    },
    isActive: { type: Boolean, default: true },
    sessionStartTime: { type: Date },
    unreadMessages: { type: Number, default: 0 },
    phoneNumber: { type: String, unique: true, required: true },
    firstName: { type: String, default: null },
    middleName: { type: String, default: null },
    surname: { type: String, default: null },
    dateOfBirth: { type: Date, default: null },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER", null],
      default: null,
    },
    memberType: {
      type: String,
      enum: ["Principal Member", "Dependent", "Unspecified", "PrivateClient",''],
      default: "Unspecified"
      // required: function () {
      //   return this.medicalAidProvider !== "Private Client";
      // },
    },
    selectedPharmacy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmacy",
      default: null,
    },
    hasSeenWelcomeMessage: { type: Boolean, default: false },
    medicalAidProvider: { type: String, default: null },
    medicalAidNumber: { type: String, default: null },
    scheme: { type: String, default: null },
    dependentNumber: { type: String, default: null },
    isRegistrationComplete: { type: Boolean, default: false },
    lastInteraction: { type: Date, default: Date.now },
    addresses: {
      home: [
        {
          address: String,
          isSaved: { type: Boolean, default: false },
        },
      ],
      work: [
        {
          address: String,
          isSaved: { type: Boolean, default: false },
        },
      ],
    },
    medicalAidCardFront: {
      data: Buffer,
      contentType: String,
    },
    medicalAidCardBack: {
      data: Buffer,
      contentType: String,
    },
    preferences: {
      notificationPreference: {
        type: String,
        enum: ["SMS", "WhatsApp", "Email"],
        default: "WhatsApp",
      },
      language: {
        type: String,
        enum: ["English", "Setswana"],
        default: "English",
      },
    },
    conversationState: {
      currentFlow: { type: String, default: null },
      currentStep: { type: String, default: null },
      data: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: () => new Map(),
      },
      lastUpdated: { type: Date, default: Date.now },
      navigationStack: [String],
      navigationStackRegistrationSteps: { type: [Number], default: [] },
    },
    adminInitiated: { type: Boolean, default: false },
    termsAccepted: { type: Boolean, default: false },
    dependents: [
      {
        dependentNumber: { type: String, required: true },
        firstName: { type: String, required: true },
        middleName: { type: String },
        lastName: { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
        id: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

export default User;