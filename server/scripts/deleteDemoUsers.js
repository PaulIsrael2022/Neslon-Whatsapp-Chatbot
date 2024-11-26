import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const deleteDemoUsers = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log('Connected to MongoDB');

    // Delete demo users
    await User.deleteMany({
      email: { $in: ['clinic@demo.com', 'doctor@demo.com'] }
    });
    
    console.log('Demo users deleted successfully');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error deleting demo users:', error);
    process.exit(1);
  }
};

deleteDemoUsers();
