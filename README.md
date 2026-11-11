# Inventory & Order Management System (IOMS)

## Overview
A comprehensive Inventory & Order Management System built with a monorepo architecture, combining both frontend and backend in a single GitHub repository.

## Tech Stack
- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + TypeScript + Express + Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** JWT + bcryptjs
- **Testing:** Vitest (frontend), Jest (backend)
- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions

## Repository Structure
This is a monorepo containing:

```
Inventory-Order-Management-System/
├── .github/
│   └── workflows/
│       └── ci-cd.yml              # CI/CD pipeline
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── config/                # Configuration
│   │   ├── controllers/           # Route handlers
│   │   ├── middleware/            # Express middleware
│   │   ├── models/                # Database models
│   │   ├── routes/                # API routes
│   │   ├── services/              # Business logic
│   │   ├── types/                 # Shared TypeScript types
│   │   └── app.ts                 # Application entry point
│   ├── Dockerfile
│   ├── .env.example
│   ├── jest.config.js
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/                   # API client
│   │   ├── components/            # Reusable UI components
│   │   ├── context/               # React Context
│   │   ├── pages/                 # Page components
│   │   ├── styles/                # Global styles
│   │   ├── test/                  # Test setup
│   │   └── App.tsx                # Application entry point
│   ├── Dockerfile
│   ├── .env.example
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
├── docs/                          # Project documentation
├── infra/                         # Infrastructure configurations
├── scripts/                       # Helper scripts
├── docker-compose.yml             # Local development orchestration
├── .gitignore
├── LICENSE
└── README.md
```

## Features by Milestone

### M1 - Project Setup & Architecture
- Repository structure and configuration
- Frontend (React + TypeScript + Vite) initialization
- Backend (Node.js + Express + TypeScript) initialization
- Database connection setup with Prisma

### M2 - Authentication & User Management
- User registration and login
- JWT token generation and verification
- Password hashing with bcryptjs
- Protected routes and role-based access
- User profile management

### M3 - Dashboard & Layout
- Responsive dashboard with statistics cards
- Sidebar navigation
- Recent activity and low-stock indicators
- Dashboard summary APIs

### M4 - Product & Category Management
- Product CRUD operations with SKU/barcode validation
- Category management
- Product listing with search, filtering, and pagination
- Product details and image handling

### M5 - Inventory & Stock Management
- Stock-in and stock-out operations with database transactions
- Stock adjustment with validation
- Stock movement history
- Low-stock alerts and prevention of negative stock

### M6 - Supplier & Purchase Management
- Supplier CRUD management
- Purchase order creation with line items
- Purchase status management (PENDING, APPROVED, RECEIVED, CANCELLED)
- Goods receiving with automatic stock updates

### M7 - Customer & Order Management
- Customer CRUD management
- Sales order creation with line items
- Order processing with stock deduction on confirmation
- Order status management (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
- Transaction handling for critical operations

### M8 - Reports & Analytics
- Sales reports with charts and date filters
- Purchase reports with charts
- Inventory valuation reports
- Dashboard summary with key metrics
- Export functionality (JSON, CSV, PDF)

### M9 - Notifications & System Settings
- Notification interface with read/unread status
- Low-stock notifications
- Order status notifications
- System configuration management
- User preferences (theme, language, notification settings)

### M10 - Testing, Optimization & Deployment
- Frontend component testing with Vitest
- Backend API testing with Jest
- Database migration validation
- Integration testing
- Security checks
- Performance optimization
- Docker containerization
- CI/CD pipeline with GitHub Actions

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile (protected)

### Products
- `GET /api/products` - List products (search, filter, paginate)
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `GET /api/categories/:id` - Get category details
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Inventory
- `POST /api/inventory/stock-in` - Stock in
- `POST /api/inventory/stock-out` - Stock out
- `POST /api/inventory/adjust` - Stock adjustment
- `GET /api/inventory/movements` - Stock movement history
- `GET /api/inventory/low-stock` - Low stock alerts

### Suppliers
- `GET /api/suppliers` - List suppliers
- `POST /api/suppliers` - Create supplier
- `GET /api/suppliers/:id` - Get supplier details
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Purchase Orders
- `GET /api/purchase-orders` - List purchase orders
- `POST /api/purchase-orders` - Create purchase order
- `GET /api/purchase-orders/:id` - Get purchase order details
- `PUT /api/purchase-orders/:id/status` - Update status
- `POST /api/purchase-orders/:id/receive` - Receive goods

### Customers
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get customer details
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Sales Orders
- `GET /api/sales-orders` - List sales orders
- `POST /api/sales-orders` - Create sales order
- `GET /api/sales-orders/:id` - Get sales order details
- `PUT /api/sales-orders/:id/status` - Update status
- `POST /api/sales-orders/:id/cancel` - Cancel order

### Reports
- `GET /api/reports/sales` - Sales report
- `GET /api/reports/purchases` - Purchase report
- `GET /api/reports/inventory` - Inventory report
- `GET /api/reports/dashboard-summary` - Dashboard summary

### Notifications
- `GET /api/notifications` - List notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `POST /api/notifications` - Create notification

### System Config
- `GET /api/config` - List configurations
- `GET /api/config/:key` - Get configuration
- `POST /api/config` - Create configuration
- `PUT /api/config/:key` - Update configuration

### User Preferences
- `GET /api/preferences` - Get user preferences
- `PUT /api/preferences` - Update preferences

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- Docker and Docker Compose (optional)

### Local Development

#### 1. Clone the repository
```bash
git clone <repository-url>
cd Inventory-Order-Management-System
```

#### 2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

#### 3. Set up environment variables
```bash
# Backend
cp .env.example .env
# Edit backend/.env with your configuration

# Frontend
cp .env.example .env
# Edit frontend/.env with your configuration
```

#### 4. Set up the database
```bash
cd backend
npx prisma migrate dev --init
npx prisma generate
```

#### 5. Start development servers
```bash
# From root directory - start both
# Or start individually:
cd backend && npm run dev    # Backend on port 3000
cd frontend && npm run dev    # Frontend on port 5173
```

### Using Docker Compose
```bash
docker-compose up --build
```
This will start PostgreSQL, backend (port 3000), and frontend (port 5173).

### Running Tests

#### Backend tests
```bash
cd backend
npm test
```

#### Frontend tests
```bash
cd frontend
npm test
```

## Git Branching Strategy
- `main`: Production-ready code (protected)
- `develop`: Development integration branch (protected)
- `feature/M*`: Feature branches for each milestone
- Feature branches created from `develop`, merged via Pull Request

## GitHub Milestones
The project is divided into 10 milestones:
1. M1 - Project Setup & Architecture
2. M2 - Authentication & User Management
3. M3 - Dashboard & Layout
4. M4 - Product & Category Management
5. M5 - Inventory & Stock Management
6. M6 - Supplier & Purchase Management
7. M7 - Customer & Order Management
8. M8 - Reports & Analytics
9. M9 - Notifications & System Settings
10. M10 - Testing, Optimization & Deployment

## Commit Message Standards
Follow Conventional Commits:
- `feat:` new functionality
- `fix:` bug fixes
- `docs:` documentation changes
- `refactor:` code improvements
- `test:` testing changes
- `chore:` configuration and maintenance

Example: `feat: implement authentication API`

## Security
- Never commit `.env` files with secrets
- Use environment variables for configuration
- JWT tokens for API authentication
- Password hashing with bcryptjs
- Protected routes with JWT verification
- Database transactions for critical operations

## License
MIT