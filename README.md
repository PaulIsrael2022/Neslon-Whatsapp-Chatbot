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
- `Clinic.js` - Defines the clinic data structure, including services, staff, and operating hours.
- `Delivery.js` - Models delivery information, including tracking, status updates, and delivery officer assignments.
- `DeliveryZone.js` - Structures delivery zones with pricing, boundaries, and service availability.
- `Doctor.js` - Manages doctor profiles, specializations, and clinic associations.
- `InventoryTransaction.js` - Tracks medication inventory movements, including stock updates and transfers.
- `LinkedMainMember.js` - Manages medical aid member associations and dependent relationships.
- `Medication.js` - Defines medication details, including dosage, pricing, and stock levels.
- `Notification.js` - Structures notification templates and delivery preferences.
- `Order.js` - Models order information, including medications, delivery details, and status tracking.
- `Pharmacy.js` - Defines pharmacy profiles, inventory, and service capabilities.
- `Service.js` - Structures medical services, including pricing and availability.
- `Settings.js` - Models system settings and configuration options.
- `User.js` - Manages user profiles, roles, and authentication details.

#### Routes (`/server/routes`)
- `auth.js` - Defines authentication endpoints for login, registration, and token management.
- `clinics.js` - Implements clinic management API endpoints.
- `deliveries.js` - Handles delivery-related API endpoints, including tracking and updates.
- `deliveryZones.js` - Manages delivery zone API endpoints.
- `doctors.js` - Implements doctor management API endpoints.
- `images.js` - Handles image upload and retrieval endpoints.
- `inventory.js` - Manages inventory-related API endpoints.
- `linkedMainMembers.js` - Handles medical aid member relationship endpoints.
- `notifications.js` - Implements notification management endpoints.
- `orders.js` - Manages order processing and tracking endpoints.
- `patients.js` - Handles patient management API endpoints.
- `pharmacies.js` - Implements pharmacy management endpoints.
- `settings.js` - Manages system settings API endpoints.
- `users.js` - Handles user management API endpoints.

#### Scripts (`/server/scripts`)
- `seed.js` - Database seeding script that initializes the system with default data, including test users and configurations.

#### Services (`/server/services`)
- `NotificationService.js` - Implements notification delivery logic for various channels (email, SMS, WhatsApp).
- `WhatsAppService.js` - Handles WhatsApp Business API integration for messaging and notifications.

#### Utils (`/server/utils`)
- `imageUtils.js` - Provides utility functions for image processing, including resizing and optimization.

### Source Directory (`/src`)

#### Components (`/src/components`)
- `Auth/` - Authentication-related components including login, registration, and password reset.
- `Dashboard/` - Dashboard components for data visualization and quick actions.
- `Header/` - Application header components including navigation and user menu.
- `Layout.tsx` - Main application layout component managing the overall UI structure.
- `OrderDetail/` - Components for displaying and managing order details.
- `Pagination.tsx` - Reusable pagination component for list views.
- `ProtectedRoute.tsx` - Route protection component implementing access control.
- `Sidebar.tsx` - Navigation sidebar component with menu items.
- `common/` - Shared components used throughout the application.

#### Context (`/src/context`)
- `AuthContext.tsx` - Authentication context provider managing user state and auth functions.

#### Hooks (`/src/hooks`)
- `useSettings.ts` - Custom hook for accessing and managing system settings.

#### Pages (`/src/pages`)
- `Accounting/` - Financial management and reporting pages.
- `Clinics/` - Clinic management and service configuration pages.
- `Dashboard/` - Main dashboard and analytics pages.
- `Deliveries/` - Delivery management and tracking pages.
- `ErrorPages/` - Error handling and display pages.
- `Inventory/` - Inventory management and stock control pages.
- `Orders/` - Order management and processing pages.
- `Patients/` - Patient record management pages.
- `Pharmacies/` - Pharmacy management and inventory pages.
- `Reports/` - Reporting and analytics pages.
- `Settings/` - System configuration and settings pages.
- `Support/` - Customer support and ticket management pages.

#### Services (`/src/services`)
- `api.ts` - API service configuration and request handling.
- `settings.ts` - Settings management service for system configuration.

#### Types (`/src/types`)
- `index.ts` - TypeScript type definitions for the entire application.

## Key Features

- **User Authentication and Authorization**
  - JWT-based authentication
  - Role-based access control
  - Secure password management

- **Order Management System**
  - Prescription processing
  - Order tracking
  - Status updates
  - Invoice generation

- **Inventory Tracking**
  - Stock management
  - Automated reordering
  - Batch tracking
  - Expiry management

- **Delivery Management**
  - Route optimization
  - Real-time tracking
  - Delivery zone management
  - Driver assignment

- **Patient Records Management**
  - Medical history
  - Prescription tracking
  - Medical aid integration
  - Document storage

- **Pharmacy Network Management**
  - Inventory synchronization
  - Inter-pharmacy transfers
  - Performance monitoring

- **Clinic Management**
  - Appointment scheduling
  - Service management
  - Staff coordination

- **Communication Integration**
  - WhatsApp notifications
  - Email communications
  - SMS alerts
  - In-app messaging

## Technology Stack

- **Frontend**
  - React 18 with TypeScript
  - Tailwind CSS for styling
  - Vite for build tooling
  - React Router for navigation
  - Context API for state management

- **Backend**
  - Node.js with Express
  - MongoDB for data storage
  - Mongoose ODM
  - JWT authentication
  - Passport.js for auth strategies

- **Infrastructure**
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
   - Configure the following required variables:
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
