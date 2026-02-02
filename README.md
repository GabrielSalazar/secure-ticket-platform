# 🎫 SecureTicket Platform

> A modern, secure platform for buying and selling event tickets with built-in fraud prevention and user authentication.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.2-2D3748)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-green)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com/)

**Live Demo:** [https://secure-ticket-platform.vercel.app](https://secure-ticket-platform.vercel.app)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Walkthrough](#-walkthrough)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## ✨ Features

### 🔐 Authentication & Security
- **Supabase Authentication** - Secure user registration and login
- **Protected Routes** - Client-side and server-side route protection
- **Session Management** - Automatic session refresh and validation
- **Password Security** - Encrypted password storage

### 🎟️ Ticket Management
- **Sell Tickets** - List your event tickets for sale
- **Browse Events** - Discover available events and tickets
- **User Dashboard** - Manage your tickets and sales
- **Real-time Updates** - Live ticket availability

### 💼 User Features
- **Personal Dashboard** - View statistics and manage listings
- **Sales Tracking** - Monitor your ticket sales
- **Event Details** - Comprehensive event information
- **Responsive Design** - Works on all devices

### 🎨 Modern UI/UX
- **Glassmorphism Design** - Modern, premium aesthetics
- **Smooth Animations** - Framer Motion powered transitions
- **Dark Mode Ready** - Beautiful dark theme
- **Accessible** - WCAG compliant components

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling
- **[Shadcn UI](https://ui.shadcn.com/)** - Reusable component library
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icon set

### Backend
- **[Prisma](https://www.prisma.io/)** - Type-safe ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[Supabase](https://supabase.com/)** - Authentication & database hosting
- **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** - Serverless API endpoints

### DevOps
- **[Vercel](https://vercel.com/)** - Deployment platform
- **[Git](https://git-scm.com/)** - Version control
- **[ESLint](https://eslint.org/)** - Code linting

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** or **yarn**
- **PostgreSQL** database (or Supabase account)
- **Git**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/GabrielSalazar/secure-ticket-platform.git
cd secure-ticket-platform
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database Connection
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/DATABASE?pgbouncer=true"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_ANON_KEY"
```

4. **Set up the database**

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database (optional)
npm run seed
```

5. **Run the development server**

```bash
npm run dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
ticket-resale-platform/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeding script
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── events/        # Event management
│   │   │   └── tickets/       # Ticket operations
│   │   ├── dashboard/         # User dashboard
│   │   ├── events/            # Event pages
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── sell/              # Sell tickets page
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── events/            # Event components
│   │   ├── layout/            # Layout components
│   │   └── ui/                # Shadcn UI components
│   ├── lib/
│   │   ├── supabase/          # Supabase client utilities
│   │   ├── db.ts              # Prisma client
│   │   └── utils.ts           # Utility functions
│   └── middleware.ts          # Next.js middleware
├── public/                    # Static assets
├── .env                       # Environment variables
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
└── package.json               # Dependencies
```

---

## 🎬 Walkthrough

### 1. User Registration & Login

#### Registration Flow
1. Navigate to `/register`
2. Fill in email, name, and password
3. System creates account in Supabase Auth
4. User data synced to PostgreSQL database
5. Automatic login and redirect to homepage

#### Login Flow
1. Navigate to `/login`
2. Enter email and password
3. Supabase validates credentials
4. Session created and stored in cookies
5. Redirect to dashboard or original page

### 2. Selling Tickets

#### Step-by-Step Process

**Access the Sell Page:**
- Click "Vender" in the header
- Or navigate to `/sell`
- **Protected Route:** Redirects to login if not authenticated

**Fill Out the Form:**
1. **Select Event** - Choose from available events
2. **Enter Price** - Set your ticket price (e.g., R$ 75.00)
3. **Section** - Specify seating section (e.g., "Pista Premium")
4. **Row** - Optional row number
5. **Seat** - Optional seat number

**Submit:**
- Click "Publicar Ingresso"
- System validates all fields
- Creates ticket in database
- Shows success message
- Redirects to event page

**API Call:**
```typescript
POST /api/tickets
{
  "eventId": "event-id",
  "price": 75.00,
  "section": "Pista Premium",
  "row": "A",
  "seat": "10"
}
```

### 3. User Dashboard

**Access:** Navigate to `/dashboard` (requires authentication)

**Features:**

**Statistics Cards:**
```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ Ingressos à Venda   │  │ Valor Total         │  │ Vendas Concluídas   │
│ 2                   │  │ R$ 200.00           │  │ 0                   │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

**Ticket List:**
- All your listed tickets
- Event name and date
- Price and status badge
- "Ver Evento" button to view event details

### 4. Browsing Events

**Events Page:** `/events`

**Features:**
- Grid layout of all events
- Event cards with:
  - Event image
  - Title and date
  - Location
  - Available tickets count
  - Starting price
  - "Ver Detalhes" button

**Event Details Page:** `/events/[id]`

**Shows:**
- Full event information
- All available tickets
- Seller information
- Purchase options (coming soon)

---

## 📡 API Documentation

### Authentication

#### POST `/api/auth/signup`
Register a new user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST `/api/auth/login`
Authenticate user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### POST `/api/auth/logout`
End user session

#### GET `/api/auth/me`
Get current authenticated user

---

### Events

#### GET `/api/events`
Get all events

**Response:**
```json
[
  {
    "id": "event-id",
    "title": "Summer Music Festival",
    "description": "The best music festival",
    "location": "Central Park, NY",
    "date": "2026-07-15T18:00:00Z",
    "organizer": {
      "name": "Event Organizer"
    },
    "_count": {
      "tickets": 5
    }
  }
]
```

#### GET `/api/events/[id]`
Get specific event with tickets

---

### Tickets

#### GET `/api/tickets`
Get tickets with optional filters

**Query Parameters:**
- `eventId` - Filter by event
- `sellerId` - Filter by seller

**Examples:**
```
GET /api/tickets?eventId=abc123
GET /api/tickets?sellerId=user-id
```

#### POST `/api/tickets`
Create a new ticket listing

**Request:**
```json
{
  "eventId": "event-id",
  "price": 75.00,
  "section": "VIP",
  "row": "A",
  "seat": "10"
}
```

**Response:**
```json
{
  "id": "ticket-id",
  "price": 75.00,
  "section": "VIP",
  "status": "AVAILABLE",
  "eventId": "event-id"
}
```

---

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository

3. **Configure Environment Variables**

Add these in Vercel Settings → Environment Variables:

```
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

4. **Deploy**
- Vercel will automatically deploy
- Your app will be live in 2-3 minutes!

### Deployment Checklist

- [x] Environment variables configured
- [x] Database accessible from Vercel
- [x] Prisma client generated in build
- [x] Middleware configured
- [x] API routes tested

---

## 🧪 Testing

We maintain a comprehensive End-to-End (E2E) test suite using **Playwright** in a separate repository to ensure the reliability and security of the platform.

**Test Repository:** [secure-ticket-platform-tests](https://github.com/GabrielSalazar/secure-ticket-platform-tests)

### Test Coverage
- **Authentication Flows**: Registration, Login, Logout, Session management
- **Critical Operations**: Ticket selling process, Event creation
- **Route Protection**: Security checks for protected pages
- **User Dashboard**: Data display and interaction
- **Navigation**: Site-wide navigation and responsiveness

To run the tests locally or against production, please refer to the [Test Repository README](https://github.com/GabrielSalazar/secure-ticket-platform-tests#readme).

---

## 🔒 Security Features

### Implemented
- ✅ Supabase Authentication
- ✅ Protected API routes
- ✅ Client-side route protection
- ✅ Session management
- ✅ Secure password hashing
- ✅ Environment variable protection

### Planned
- 🔄 Rate limiting
- 🔄 CSRF protection
- 🔄 Input sanitization
- 🔄 SQL injection prevention (via Prisma)
- 🔄 XSS protection

---

## 🗺️ Roadmap

### Phase 1: Core Features ✅
- [x] User authentication
- [x] Event listing
- [x] Ticket selling
- [x] User dashboard
- [x] Responsive design

### Phase 2: Enhanced Features ✅
- [x] Ticket purchasing system
- [x] Search and filters
- [x] Purchased tickets display
- [x] Sales tracking and analytics
- [ ] Payment integration
- [ ] File upload (ticket proofs)
- [ ] Email notifications

### Phase 3: Advanced Features 📋
- [ ] User reviews and ratings
- [ ] Chat system
- [ ] Mobile app
- [ ] Admin dashboard
- [ ] Analytics

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Gabriel Salazar**

- GitHub: [@GabrielSalazar](https://github.com/GabrielSalazar)
- Project: [secure-ticket-platform](https://github.com/GabrielSalazar/secure-ticket-platform)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Shadcn UI](https://ui.shadcn.com/) - Beautifully designed components
- [Vercel](https://vercel.com/) - Deployment platform

---

## 📞 Support

If you have any questions or need help, please:

1. Check the [documentation](#-walkthrough)
2. Open an [issue](https://github.com/GabrielSalazar/secure-ticket-platform/issues)
3. Contact the maintainer

---

**Made with ❤️ and Next.js**
