import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import WebSocketService from './services/WebSocketService.js';
import './config/passport.js';

// Import models first to ensure schemas are registered
import './models/Service.js';
import './models/Doctor.js';
import './models/Clinic.js';
import './models/Pharmacy.js';
import './models/User.js';
import './models/Order.js';
import './models/Notification.js';
import './models/LinkedMainMember.js';
import './models/Medication.js';
import './models/InventoryTransaction.js';
import './models/Settings.js';

// Import routes after models
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';
import pharmacyRoutes from './routes/pharmacies.js';
import linkedMainMemberRoutes from './routes/linkedMainMembers.js';
import notificationRoutes from './routes/notifications.js';
import imageRoutes from './routes/images.js';
import patientRoutes from './routes/patients.js';
import inventoryRoutes from './routes/inventory.js';
import settingsRoutes from './routes/settings.js';
import userRoutes from './routes/users.js';
import clinicRoutes from './routes/clinics.js';
import doctorRoutes from './routes/doctors.js';
import deliveryRoutes from './routes/deliveries.js';
import deliveryZoneRoutes from './routes/deliveryZones.js';

dotenv.config();
console.log('Environment loaded, starting server initialization...');

const app = express();

// Basic Middleware setup
console.log('Setting up middleware...');
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Enhanced CORS configuration
const allowedOrigins = [];
// Add localhost origins for ports 5000-6000
for (let port = 5000; port <= 6000; port++) {
  allowedOrigins.push(`http://localhost:${port}`);
}

// Add additional origins from environment variable if present
if (process.env.CLIENT_URL) {
  allowedOrigins.push(...process.env.CLIENT_URL.split(','));
}

const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Content-Disposition', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400
};

// Apply CORS configuration
app.use(cors(corsOptions));

// Increase payload limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(passport.initialize());
console.log('Middleware setup complete');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/pharmacies', pharmacyRoutes);
app.use('/api/linked-members', linkedMainMemberRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/users/patients', patientRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/delivery-zones', deliveryZoneRoutes); // Note the hyphen in 'delivery-zones'

// MongoDB Connection with retry mechanism
console.log('Setting up MongoDB connection...');
const connectDB = async (retryCount = 0) => {
  const maxRetries = 3;
  const retryDelay = 3000;

  try {
    console.log(`MongoDB connection attempt ${retryCount + 1} of ${maxRetries}`);
    
    const sanitizedUrl = process.env.DB_CONNECTION.replace(
      /(mongodb\+srv:\/\/|mongodb:\/\/)[^@]+@/,
      '$1*****:*****@'
    );
    console.log('Attempting to connect to:', sanitizedUrl);

    await mongoose.connect(process.env.DB_CONNECTION, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      retryReads: true
    });

    console.log('MongoDB Connected Successfully');
    return true;

  } catch (error) {
    console.error('MongoDB connection error:', {
      name: error.name,
      message: error.message,
      code: error.code
    });

    if (retryCount < maxRetries - 1) {
      console.log(`Retrying connection in ${retryDelay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return connectDB(retryCount + 1);
    } else {
      console.error('Max retry attempts reached. Could not connect to MongoDB.');
      return false;
    }
  }
};

// Connection Event Listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error encountered:', err);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
  });
});

// Server Initialization
async function startServer() {
  try {
    await connectDB();
    const port = process.env.PORT || 3000;
    
    // Create HTTP server
    const server = createServer(app);
    
    // Initialize WebSocket
    WebSocketService.initialize(server, allowedOrigins);
    
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log('WebSocket server initialized');
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Start the server
console.log('Initiating server startup sequence...');
startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Graceful Shutdown
const gracefulShutdown = async () => {
  console.log('Initiating graceful shutdown...');
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
    }
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

export default app;