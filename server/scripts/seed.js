// seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Sample user data matching the schema
const users = [
    {
        name: "System Admin",
        email: "admin@hpfund.com",
        password: "admin123",
        role: "admin",
        phoneNumber: "+26771000001",
        firstName: "System",
        surname: "Admin",
        isActive: true,
        isRegistrationComplete: true,
        termsAccepted: true,
        memberType: "Unspecified",
        preferences: {
            notificationPreference: "WhatsApp",
            language: "English"
        },
        memberfor: true,
        
    },
    {
        name: "Pharmacy Admin",
        email: "pharmacy@hpfund.com",
        password: "pharmacy123",
        role: "pharmacyAdmin",
        phoneNumber: "+26771000002",
        firstName: "Pharmacy",
        surname: "Admin",
        isActive: true,
        isRegistrationComplete: true,
        termsAccepted: true,
        memberType: "Unspecified",
        preferences: {
            notificationPreference: "WhatsApp",
            language: "English"
        }
    },
    {
        name: "Delivery Coordinator",
        email: "delivery@hpfund.com",
        password: "delivery123",
        role: "deliveryCoordinator",
        phoneNumber: "+26771000003",
        firstName: "Delivery",
        surname: "Coordinator",
        isActive: true,
        isRegistrationComplete: true,
        termsAccepted: true,
        memberType: "Unspecified",
        preferences: {
            notificationPreference: "WhatsApp",
            language: "English"
        }
    },
    {
        name: "Test Customer",
        email: "customer@example.com",
        password: "customer123",
        role: "customer",
        phoneNumber: "+26771000004",
        firstName: "Test",
        surname: "Customer",
        dateOfBirth: new Date('1990-01-01'),
        gender: "MALE",
        memberType: "Principal Member",
        medicalAidProvider: "Botswana Medical Aid",
        medicalAidNumber: "MED123456",
        isActive: true,
        isRegistrationComplete: true,
        termsAccepted: true,
        preferences: {
            notificationPreference: "WhatsApp",
            language: "English"
        },
        addresses: {
            home: [
                {
                    address: "123 Main St, Gaborone",
                    isSaved: true
                }
            ]
        }
    }
];

async function seedDatabase() {
    try {
        // Verify MongoDB connection string
        if (!process.env.DB_CONNECTION) {
            throw new Error('MongoDB connection string is not defined in .env file');
        }

        console.log('Connecting to MongoDB Atlas...');
        
        await mongoose.connect(process.env.DB_CONNECTION, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000
        });

        console.log('Connected to MongoDB Atlas successfully');

        // Import the User model
        const User = mongoose.model('User', new mongoose.Schema({
            name: String,
            email: String,
            password: String,
            role: {
                type: String,
                enum: ["customer", "admin", "pharmacyStaff", "pharmacyAdmin", "deliveryOfficer", "deliveryCoordinator", "doctor"]
            },
            phoneNumber: String,
            firstName: String,
            middleName: String,
            surname: String,
            dateOfBirth: Date,
            gender: {
                type: String,
                enum: ["MALE", "FEMALE", "OTHER", null]
            },
            memberType: {
                type: String,
                enum: ["Principal Member", "Dependent", "Unspecified", "PrivateClient"]
            },
            isActive: Boolean,
            isRegistrationComplete: Boolean,
            termsAccepted: Boolean,
            medicalAidProvider: String,
            medicalAidNumber: String,
            addresses: {
                home: [{
                    address: String,
                    isSaved: Boolean
                }],
                work: [{
                    address: String,
                    isSaved: Boolean
                }]
            },
            preferences: {
                notificationPreference: {
                    type: String,
                    enum: ["SMS", "WhatsApp", "Email"]
                },
                language: {
                    type: String,
                    enum: ["English", "Setswana"]
                }
            }
        }));

        // Clear existing users
        console.log('Clearing existing users...');
        await User.deleteMany({});
        console.log('Existing users cleared');

        // Hash passwords and prepare user data
        const hashedUsers = await Promise.all(users.map(async user => ({
            ...user,
            password: await bcrypt.hash(user.password, 10)
        })));

        // Insert new users
        console.log('Inserting new users...');
        const insertedUsers = await User.insertMany(hashedUsers);
        console.log(`Successfully inserted ${insertedUsers.length} users:`);
        
        // Log created users (without sensitive data)
        insertedUsers.forEach(user => {
            console.log({
                name: user.name,
                email: user.email,
                role: user.role,
                phoneNumber: user.phoneNumber,
                id: user._id
            });
        });

        console.log('Database seeding completed successfully');

    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    } finally {
        try {
            await mongoose.connection.close();
            console.log('Database connection closed');
        } catch (error) {
            console.error('Error closing database connection:', error);
        }
        process.exit(0);
    }
}

// Run seeding with error handling
seedDatabase().catch(error => {
    console.error('Fatal error during seeding:', error);
    process.exit(1);
});