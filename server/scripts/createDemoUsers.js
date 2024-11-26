import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Clinic from '../models/Clinic.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const createDemoUsers = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log('Connected to MongoDB');

    // Create a demo clinic
    const demoClinic = await Clinic.create({
      name: 'Demo Clinic',
      address: '123 Health Street',
      phoneNumber: '+1234567890',
      email: 'demo@clinic.com',
      website: 'www.democlinic.com',
      isActive: true,
      isPartner: true,
      specialties: ['General Practice', 'Pediatrics'],
      facilities: ['Lab', 'X-Ray'],
      location: {
        type: 'Point',
        coordinates: [25.9692, -24.6282] // Gaborone coordinates
      }
    });

    // Create demo clinic user
    const demoClinicUser = new User({
      name: 'Demo Clinic Admin',
      email: 'clinic@demo.com',
      password: 'clinic123',
      role: 'clinic',
      clinic: demoClinic._id,
      phoneNumber: '+1234567891',
      isActive: true
    });

    await demoClinicUser.save();
    console.log('Demo clinic user created successfully');

    // Create demo doctor user
    const demoDoctorUser = new User({
      name: 'Dr. Demo',
      email: 'doctor@demo.com',
      password: 'doctor123',
      role: 'doctor',
      clinic: demoClinic._id,
      phoneNumber: '+1234567892',
      isActive: true
    });

    await demoDoctorUser.save();
    console.log('Demo doctor user created successfully');

    console.log('\nDemo Users Created:');
    console.log('Clinic Admin:');
    console.log('Email: clinic@demo.com');
    console.log('Password: clinic123');
    console.log('\nDoctor:');
    console.log('Email: doctor@demo.com');
    console.log('Password: doctor123');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error creating demo users:', error);
    process.exit(1);
  }
};

createDemoUsers();
