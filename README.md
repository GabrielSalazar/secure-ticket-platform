# 🎫 SecureTicket Platform

> A modern, secure, and fully responsive platform for buying and selling event tickets with built-in fraud prevention, user authentication, and mobile-first design.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.2-2D3748)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-green)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com/)
[![Mobile Optimized](https://img.shields.io/badge/Mobile-Optimized-success)](https://github.com/GabrielSalazar/secure-ticket-platform)

**Live Demo:** [https://secure-ticket-platform.vercel.app](https://secure-ticket-platform.vercel.app)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Walkthrough](#-walkthrough)
- [API Documentation](#-api-documentation)
- [Mobile Responsiveness](#-mobile-responsiveness)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Contributing](#-contributing)

---

## ✨ Features

### 🔐 Authentication & Security
- **Supabase Authentication** - Secure user registration and login
- **Protected Routes** - Client-side and server-side route protection
- **Session Management** - Automatic session refresh and validation
- **Password Security** - Encrypted password storage
- **Unique Constraint Protection** - Prevents duplicate user creation errors

### 🎟️ Ticket Management
- **Sell Tickets** - List your event tickets for sale with detailed information
- **Browse Events** - Discover available events with search and filters
- **Purchase Tickets** - Complete ticket purchasing flow with transaction tracking
- **User Dashboard** - Comprehensive view of your tickets, sales, and purchases
- **Real-time Updates** - Live ticket availability and status changes
- **Transaction History** - Track all your purchases and sales

### 💼 User Features
- **Personal Dashboard** - View statistics, active listings, and sales
- **My Tickets** - Dedicated page for purchased tickets
- **My Sales** - Track your ticket sales and earnings
- **Sales Analytics** - Monitor performance with detailed statistics
- **Event Details** - Comprehensive event information with ticket listings
- **Share Events** - Share events via social media or copy link

### 🎨 Modern UI/UX
- **Glassmorphism Design** - Modern, premium aesthetics with gradient effects
- **Smooth Animations** - Framer Motion powered transitions
- **Dark Mode** - Beautiful dark theme enabled by default
- **Accessible** - WCAG compliant components with proper touch targets
- **Mobile-First** - Fully responsive design optimized for all devices
- **iPhone 14 Pro Max Optimized** - Tested and optimized for latest mobile devices

### 📱 Mobile Responsiveness
- **Viewport Optimization** - Proper meta tags for mobile scaling
- **Safe Area Support** - Respects notches and device cutouts
- **Touch-Friendly** - Minimum 44x44px touch targets
- **No Horizontal Scroll** - Content fits perfectly on all screen sizes
- **Responsive Typography** - Progressive font sizing for readability
- **Adaptive Layouts** - Components stack and resize intelligently

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling with custom design system
- **[Shadcn UI](https://ui.shadcn.com/)** - Reusable component library
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icon set

### Backend
- **[Prisma](https://www.prisma.io/)** - Type-safe ORM with PostgreSQL
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[Supabase](https://supabase.com/)** - Authentication & database hosting
- **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** - Serverless API endpoints

### DevOps & Testing
- **[Vercel](https://vercel.com/)** - Deployment platform with automatic CI/CD
- **[Playwright](https://playwright.dev/)** - End-to-end testing framework
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
│   ├── schema.prisma          # Database schema with User, Event, Ticket, Transaction models
│   └── seed.ts                # Database seeding script with sample events
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints (signup, login, logout, me)
│   │   │   ├── events/        # Event management (list, details)
│   │   │   ├── tickets/       # Ticket operations (create, list, filter)
│   │   │   └── transactions/  # Transaction handling (purchase tickets)
│   │   ├── dashboard/         # User dashboard with stats and listings
│   │   ├── events/            # Event browsing and details pages
│   │   │   └── [id]/          # Dynamic event detail page
│   │   ├── how-it-works/      # Information page about the platform
│   │   ├── login/             # Login page with Supabase auth
│   │   ├── register/          # Registration page
│   │   ├── sell/              # Sell tickets page with form
│   │   ├── my-tickets/        # Purchased tickets page
│   │   ├── my-sales/          # Sales tracking page
│   │   ├── globals.css        # Global styles with mobile optimizations
│   │   ├── layout.tsx         # Root layout with viewport config
│   │   └── page.tsx           # Homepage with hero and features
│   ├── components/
│   │   ├── events/            # Event components (share, purchase button)
│   │   ├── layout/            # Layout components (header, footer)
│   │   └── ui/                # Shadcn UI components (button, card, etc.)
│   ├── lib/
│   │   ├── supabase/          # Supabase client utilities
│   │   │   ├── client.ts      # Browser client
│   │   │   ├── server.ts      # Server client
│   │   │   └── middleware.ts  # Auth middleware
│   │   ├── db.ts              # Prisma client singleton
│   │   └── utils.ts           # Utility functions
│   └── middleware.ts          # Next.js middleware for auth
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
4. User data synced to PostgreSQL database via Prisma
5. Automatic login and redirect to homepage
6. **Error Handling**: Prevents duplicate email registration

#### Login Flow
1. Navigate to `/login`
2. Enter email and password
3. Supabase validates credentials
4. Session created and stored in cookies
5. Redirect to dashboard or original page
6. **Session Persistence**: Automatic refresh on page reload

### 2. Selling Tickets

#### Step-by-Step Process

**Access the Sell Page:**
- Click "Vender Ingressos" in the header
- Or navigate to `/sell`
- **Protected Route:** Redirects to login if not authenticated

**Fill Out the Form:**
1. **Select Event** - Choose from available events dropdown
2. **Enter Price** - Set your ticket price (e.g., R$ 75.00)
3. **Section** - Specify seating section (e.g., "Pista Premium")
4. **Row** - Optional row number
5. **Seat** - Optional seat number

**Submit:**
- Click "Publicar Ingresso"
- System validates all fields
- Creates ticket in database with status "AVAILABLE"
- Shows success toast notification
- Redirects to event details page

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

### 3. Purchasing Tickets

#### Purchase Flow
1. Browse events at `/events`
2. Click on event to view details
3. See all available tickets with seller info
4. Click "Comprar" button on desired ticket
5. Confirm purchase in dialog
6. Transaction created in database
7. Ticket status updated to "SOLD"
8. Redirect to "My Tickets" page

**Transaction Record:**
- Links buyer, seller, and ticket
- Records purchase price and timestamp
- Updates ticket availability

### 4. User Dashboard

**Access:** Navigate to `/dashboard` (requires authentication)

**Features:**

**Statistics Cards:**
```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ Ingressos à Venda   │  │ Valor Total         │  │ Vendas Concluídas   │
│ 2                   │  │ R$ 200.00           │  │ 5                   │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

**My Tickets for Sale:**
- All your active listings
- Event name, date, and location
- Price and status badge
- Quick actions (view event, edit, delete)

**My Purchased Tickets:**
- All tickets you've bought
- Event details and seat information
- Purchase date and price paid
- Seller information

### 5. Browsing Events

**Events Page:** `/events`

**Features:**
- **Search Bar** - Find events by name
- **Category Filter** - Filter by event type
- **Grid Layout** - Responsive card display
- **Event Cards** show:
  - Event image or placeholder
  - Title and formatted date
  - Location with icon
  - Available tickets count
  - Starting price
  - "Ver Detalhes" button

**Event Details Page:** `/events/[id]`

**Shows:**
- Full-width event banner
- Complete event information
- All available tickets in cards
- Seller verification badges
- Purchase buttons
- Share functionality
- Security information sidebar

### 6. My Tickets & My Sales

**My Tickets Page:** `/my-tickets`
- View all purchased tickets
- Filter by upcoming/past events
- See ticket details and QR codes (planned)
- Download tickets (planned)

**My Sales Page:** `/my-sales`
- Track all your sales
- View earnings and statistics
- See buyer information
- Monitor ticket status

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

**Error Handling:**
- Checks for existing users by both ID and email
- Prevents unique constraint violations
- Returns appropriate error messages

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

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe"
}
```

---

### Events

#### GET `/api/events`
Get all events with ticket counts

**Query Parameters:**
- `search` - Search by event name
- `category` - Filter by category

**Response:**
```json
[
  {
    "id": "event-id",
    "title": "Summer Music Festival",
    "description": "The best music festival",
    "location": "Central Park, NY",
    "date": "2026-07-15T18:00:00Z",
    "imageUrl": "https://example.com/image.jpg",
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
Get specific event with all tickets and seller information

**Response includes:**
- Full event details
- Array of available tickets
- Seller information for each ticket
- Ticket verification status

---

### Tickets

#### GET `/api/tickets`
Get tickets with optional filters

**Query Parameters:**
- `eventId` - Filter by event
- `sellerId` - Filter by seller
- `status` - Filter by status (AVAILABLE, SOLD, CANCELLED)

**Examples:**
```
GET /api/tickets?eventId=abc123
GET /api/tickets?sellerId=user-id
GET /api/tickets?status=AVAILABLE
```

#### POST `/api/tickets`
Create a new ticket listing (requires authentication)

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
  "row": "A",
  "seat": "10",
  "status": "AVAILABLE",
  "eventId": "event-id",
  "sellerId": "user-id"
}
```

---

### Transactions

#### POST `/api/transactions`
Purchase a ticket (requires authentication)

**Request:**
```json
{
  "ticketId": "ticket-id"
}
```

**Response:**
```json
{
  "id": "transaction-id",
  "ticketId": "ticket-id",
  "buyerId": "buyer-id",
  "sellerId": "seller-id",
  "price": 75.00,
  "createdAt": "2026-01-30T21:00:00Z"
}
```

**Side Effects:**
- Updates ticket status to "SOLD"
- Creates transaction record
- Links buyer and seller

---

## 📱 Mobile Responsiveness

### Optimizations Implemented

The platform is fully optimized for mobile devices, with special attention to iPhone 14 Pro Max (430x932px) and similar devices.

#### Core Improvements

**Viewport Configuration:**
```typescript
viewport: {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}
```

**Global CSS Enhancements:**
- Horizontal scroll prevention (`overflow-x: hidden`)
- Safe area insets for notched devices
- Minimum 44x44px touch targets
- Automatic text wrapping and overflow prevention
- Smooth scrolling behavior

#### Page-Specific Optimizations

**Home Page:**
- Progressive font sizing: `text-3xl sm:text-4xl md:text-5xl lg:text-6xl`
- Responsive padding: `px-6 md:px-8`
- Full-width buttons on mobile: `w-full sm:w-auto`
- Stats grid: 2 columns on mobile, 4 on desktop

**Event Details:**
- Stacked ticket cards on mobile
- Truncated text with ellipsis
- Responsive button sizing
- Optimized header height

**Header:**
- Reduced height on mobile: `h-14 md:h-16`
- Smaller logo: `h-7 w-7 md:h-8 md:w-8`
- Truncated user email display
- Responsive navigation spacing

**Forms (Login/Register):**
- Reduced padding on mobile: `p-6 md:p-8`
- Smaller headings: `text-xl md:text-2xl`
- Optimized input field sizes

### Testing on Mobile

**Recommended Testing:**
1. Use Chrome DevTools device emulation
2. Test on actual iPhone 14 Pro Max
3. Verify no horizontal scrolling
4. Check touch target sizes
5. Validate text readability

---

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**

```bash
git add .
git commit -m "feat: your feature description"
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
- [x] Mobile responsiveness verified

---

## 🧪 Testing

We maintain a comprehensive End-to-End (E2E) test suite using **Playwright** in a separate repository to ensure the reliability and security of the platform.

**Test Repository:** [secure-ticket-platform-tests](https://github.com/GabrielSalazar/secure-ticket-platform-tests)

### Test Coverage
- **Authentication Flows**: Registration, Login, Logout, Session management
- **Critical Operations**: Ticket selling, Ticket purchasing, Transaction creation
- **Route Protection**: Security checks for protected pages
- **User Dashboard**: Data display and interaction
- **Navigation**: Site-wide navigation and responsiveness
- **Mobile Testing**: Responsive design verification

To run the tests locally or against production, please refer to the [Test Repository README](https://github.com/GabrielSalazar/secure-ticket-platform-tests#readme).

---

## 🔒 Security Features

### Implemented
- ✅ Supabase Authentication with session management
- ✅ Protected API routes with user verification
- ✅ Client-side route protection via middleware
- ✅ Secure password hashing (Supabase)
- ✅ Environment variable protection
- ✅ Unique constraint validation
- ✅ SQL injection prevention (via Prisma ORM)
- ✅ XSS protection (React escaping)

### Planned
- 🔄 Rate limiting on API endpoints
- 🔄 CSRF protection tokens
- 🔄 Two-factor authentication (2FA)
- 🔄 Email verification
- 🔄 Advanced fraud detection

---

## 🗺️ Roadmap

### Phase 1: Core Features ✅
- [x] User authentication (Supabase)
- [x] Event listing and browsing
- [x] Ticket selling with form validation
- [x] User dashboard with statistics
- [x] Responsive design (mobile-first)

### Phase 2: Enhanced Features ✅
- [x] Ticket purchasing system
- [x] Search and filters for events
- [x] Purchased tickets display (My Tickets)
- [x] Sales tracking and analytics (My Sales)
- [x] Transaction management
- [x] Share event functionality
- [x] Mobile responsiveness optimization
- [ ] Payment integration (Stripe/PayPal)
- [ ] File upload (ticket proofs)
- [ ] Email notifications

### Phase 3: Advanced Features 📋
- [ ] User reviews and ratings
- [ ] In-app messaging system
- [ ] QR code ticket verification
- [ ] Mobile app (React Native)
- [ ] Admin dashboard
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Push notifications

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Commit Convention
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Build process or auxiliary tool changes

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

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Prisma](https://www.prisma.io/) - Next-generation ORM for Node.js
- [Shadcn UI](https://ui.shadcn.com/) - Beautifully designed components
- [Vercel](https://vercel.com/) - Platform for frontend developers
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Playwright](https://playwright.dev/) - Reliable end-to-end testing

---

## 📞 Support

If you have any questions or need help, please:

1. Check the [documentation](#-walkthrough)
2. Review the [API documentation](#-api-documentation)
3. Open an [issue](https://github.com/GabrielSalazar/secure-ticket-platform/issues)
4. Contact the maintainer

---

## 📊 Project Stats

- **Total Commits:** 50+
- **Lines of Code:** 10,000+
- **Components:** 30+
- **API Endpoints:** 15+
- **Pages:** 10+
- **Mobile Optimized:** ✅
- **Production Ready:** ✅

---

**Made with ❤️ and Next.js**
