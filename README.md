# HP Fund Medication Delivery Service

A comprehensive medication delivery management system built with React, Node.js, and MongoDB. This system facilitates the management of medication orders, deliveries, and patient records while integrating with medical aid providers and communication services.

## Project Structure

### Root Directory
- `index.html` - The main HTML entry point that serves as the template for the React application. Contains essential meta tags and the root element where the React application is mounted.
- `package.json` - Defines project dependencies, scripts, and configuration. Includes both development and production dependencies, as well as custom scripts for building, testing, and running the application.
- `tsconfig.json` - TypeScript configuration file that specifies compiler options and project settings. Ensures type safety and consistent JavaScript compilation across the project.
- `vite.config.ts` - Configuration file for the Vite build tool. Defines build settings, development server options, and plugin configurations.
- `tailwind.config.js` - Tailwind CSS configuration file that customizes the framework's settings, including theme extensions, plugins, and content paths.

### Server Directory (`/server`)
- `.env` - Environment configuration file containing sensitive information such as database credentials, API keys, and service configurations.
- `server.js` - The main Express.js server entry point that initializes the application, sets up middleware, connects to MongoDB, and defines API routes.
- `package.json` - Server-specific dependencies and scripts, including database drivers, authentication libraries, and utility packages.

#### Config (`/server/config`)
- `passport.js` - Implements authentication strategies using Passport.js. Configures local and JWT strategies for user authentication and session management.

#### Controllers (`/server/controllers`)
- `clinicController.js` - Handles clinic-related business logic, including clinic registration, updates, and service management.
- `deliveryController.js` - Manages delivery operations, including assignment, tracking, and status updates.
- `deliveryZoneController.js` - Controls delivery zone definitions, pricing, and coverage area management.
- `pharmacyController.js` - Handles pharmacy operations, inventory management, and prescription processing.
- `settingsController.js` - Manages system-wide settings, configurations, and preferences.

#### Jobs (`/server/jobs`)
- `notificationScheduler.js` - Implements scheduled tasks for sending notifications, reminders, and automated messages using cron jobs.

#### Middleware (`/server/middleware`)
- `auth.js` - Authentication middleware that verifies user tokens, handles authorization, and manages user sessions.
- `imageUpload.js` - Processes and validates image uploads, including resizing, compression, and storage management.

#### Models (`/server/models`)
- Various model files defining data structures and schemas for different entities in the system.

#### Routes (`/server/routes`)
- Various route files implementing API endpoints for different features.

#### Scripts (`/server/scripts`)
- `seed.js` - Database seeding script that initializes the system with default data.

#### Services (`/server/services`)
- `NotificationService.js` - Implements notification delivery logic for various channels.
- `WhatsAppService.js` - Handles WhatsApp Business API integration.
- `WebSocketService.js` - Manages real-time communication.

### Source Directory (`/src`)

#### Components (`/src/components`)
- Various React components organized by feature and functionality.

#### Context (`/src/context`)
- `AuthContext.tsx` - Authentication context provider managing user state.

#### Hooks (`/src/hooks`)
- Custom React hooks for shared functionality.

#### Pages (`/src/pages`)
Various page components including:
- Dashboard
- Orders
- Patients
- Inventory
- Deliveries
- Support
- Reports
- Settings
- UserSettings (New)
  - BaseSettings.tsx - Common settings for all users
  - PharmacySettings.tsx - Pharmacy-specific settings
  - DeliverySettings.tsx - Delivery officer settings
  - CustomerSettings.tsx - Customer-specific settings
  - ClinicSettings.tsx - Clinic settings
  - DoctorSettings.tsx - Doctor-specific settings

## Key Features

### User Settings and Preferences
- **Role-Based Settings**
  - Each user role has specific settings and preferences
  - Customizable interface based on user type
  - Secure access control for sensitive settings

- **Common Settings (All Users)**
  - Profile information management
  - Password changes
  - Notification preferences
  - Language preferences
  - Contact information updates

- **Role-Specific Settings**
  - **Pharmacy Staff/Admin**
    - Pharmacy profile management
    - Operating hours
    - Delivery zone settings
    - Inventory preferences
  
  - **Delivery Officers**
    - Vehicle information
    - Availability status
    - Preferred delivery zones
    - Notification preferences
  
  - **Customers**
    - Delivery address management
    - Medical aid information
    - Prescription preferences
    - Communication preferences
  
  - **Clinics**
    - Clinic profile management
    - Operating hours
    - Service management
    - Staff settings
  
  - **Doctors**
    - Professional information
    - Availability schedule
    - Prescription settings
    - Patient communication preferences

### User Authentication and Authorization
- JWT-based authentication
- Role-based access control
- Secure password management

### Order Management System
- Prescription processing
- Order tracking
- Status updates
- Invoice generation

### Inventory Tracking
- Stock management
- Automated reordering
- Batch tracking
- Expiry management

### Delivery Management
- Route optimization
- Real-time tracking
- Delivery zone management
- Driver assignment

### Patient Records Management
- Medical history
- Prescription tracking
- Medical aid integration
- Document storage

### Pharmacy Network Management
- Inventory synchronization
- Inter-pharmacy transfers
- Performance monitoring

### Clinic Management
- Appointment scheduling
- Service management
- Staff coordination

### Communication Integration
- WhatsApp notifications
- Email communications
- SMS alerts
- In-app messaging

## Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Vite for build tooling
- React Router for navigation
- Context API for state management

### Backend
- Node.js with Express
- MongoDB for data storage
- Mongoose ODM
- JWT authentication
- Passport.js for auth strategies

### Infrastructure
- Local file storage with optimization
- WhatsApp Business API integration
- SMTP email service
- Image processing pipeline

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   cd server && npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Configure required variables:
     - Database connection string
     - JWT secret
     - SMTP settings
     - WhatsApp API credentials
     - Storage configuration

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the application:
   - Frontend: `http://localhost:5173`
   - API: `http://localhost:3000`

## Development Guidelines

1. **Code Organization**
   - Follow the established file structure
   - Keep components modular and reusable
   - Implement proper type definitions
   - Document complex logic

2. **Best Practices**
   - Write clean, maintainable code
   - Follow REST API conventions
   - Implement proper error handling
   - Add comprehensive logging

3. **Testing**
   - Write unit tests for critical functionality
   - Implement integration tests for API endpoints
   - Test across different browsers
   - Verify mobile responsiveness

4. **Security**
   - Follow security best practices
   - Implement proper input validation
   - Use secure authentication methods
   - Handle sensitive data appropriately

5. **Performance**
   - Optimize database queries
   - Implement proper caching
   - Minimize bundle size
   - Optimize image loading

6. **Documentation**
   - Document new features
   - Update API documentation
   - Maintain change logs
   - Document configuration requirements

## User Settings Module

### Overview
The User Settings module provides role-specific configuration options for different user types in the system. Each role has access to both common settings and specialized settings relevant to their function.

### Common Features (All Users)
- Profile information management
- Password change functionality
- Notification preferences
- Theme preferences
- Contact information updates

### Role-Specific Features

#### Pharmacy Staff/Admin
- Pharmacy profile management
- Operating hours configuration
- Delivery zone settings
- Inventory preferences
- Staff management
- Reporting preferences

#### Delivery Officers
- Vehicle information management
- Availability status updates
- Preferred delivery zones
- Real-time tracking preferences
- Delivery route optimization settings
- Communication preferences

#### Customers
- Multiple delivery address management
- Medical aid information
- Prescription preferences
- Communication preferences
- Order history settings
- Payment method management

#### Clinic Staff
- Clinic profile management
- Operating hours
- Service catalog management
- Staff scheduling preferences
- Patient communication settings
- Appointment booking rules

#### Doctors
- Professional profile management
- Consultation schedule
- Prescription templates
- Patient communication preferences
- Referral network settings
- Digital signature management

### Technical Implementation
- React components for each role-specific settings page
- Form validation and error handling
- Real-time updates using WebSocket
- Secure file upload for documents and images
- Role-based access control
- Settings persistence in MongoDB
- Audit logging for changes

### Security Considerations
- Authentication required for all settings changes
- Role-based access control for sensitive settings
- Validation of all user inputs
- Secure storage of sensitive information
- Audit trail of settings changes
- Session management and timeout

### Integration Points
- Authentication system
- File storage system
- Notification system
- Payment processing system
- Medical aid verification system
- Prescription management system

### Future Enhancements
- Two-factor authentication setup
- Advanced notification rules
- Custom theme builder
- Automated schedule optimization
- Integration with additional medical aid providers
- Enhanced reporting capabilities
- Mobile app preferences
- Accessibility settings
- Language preferences
- Privacy controls
   
-------------- Project Structure --------------
HP Fund Medication Delivery Service
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── server
│   ├── .env
│   ├── server.js
│   ├── package.json
│   ├── config
│   │   └── passport.js
│   ├── controllers
│   │   ├── clinicController.js
│   │   ├── deliveryController.js
│   │   ├── deliveryZoneController.js
│   │   ├── pharmacyController.js
│   │   └── settingsController.js
│   ├── jobs
│   │   └── notificationScheduler.js
│   ├── middleware
│   │   ├── auth.js
│   │   └── imageUpload.js
│   ├── models
│   │   ├── Clinic.js
│   │   ├── Delivery.js
│   │   ├── DeliveryZone.js
│   │   ├── Doctor.js
│   │   ├── InventoryTransaction.js
│   │   ├── LinkedMainMember.js
│   │   ├── Medication.js
│   │   ├── Notification.js
│   │   ├── Order.js
│   │   ├── Pharmacy.js
│   │   ├── Service.js
│   │   ├── Settings.js
│   │   └── User.js
│   ├── routes
│   │   ├── auth.js
│   │   ├── clinics.js
│   │   ├── deliveries.js
│   │   ├── deliveryZones.js
│   │   ├── doctors.js
│   │   ├── images.js
│   │   ├── inventory.js
│   │   ├── linkedMainMembers.js
│   │   ├── notifications.js
│   │   ├── orders.js
│   │   ├── patients.js
│   │   ├── pharmacies.js
│   │   ├── settings.js
│   │   └── users.js
│   ├── scripts
│   │   └── seed.js
│   ├── services
│   │   ├── NotificationService.js
│   │   └── WhatsAppService.js
│   └── utils
│       └── imageUtils.js
└── src
    ├── components
    │   ├── Auth
    │   ├── Dashboard
    │   ├── Header
    │   ├── Layout.tsx
    │   ├── OrderDetail
    │   ├── Pagination.tsx
    │   ├── ProtectedRoute.tsx
    │   ├── Sidebar.tsx
    │   └── common
    ├── context
    │   └── AuthContext.tsx
    ├── hooks
    │   └── useSettings.ts
    ├── pages
    │   ├── Accounting
    │   ├── Clinics
    │   ├── Dashboard
    │   ├── Deliveries
    │   ├── ErrorPages
    │   ├── Inventory
    │   ├── Orders
    │   ├── Patients
    │   ├── Pharmacies
    │   ├── Reports
    │   ├── Settings
    │   └── Support
    ├── services
    │   ├── api.ts
    │   └── settings.ts
    └── types
        └── index.ts
