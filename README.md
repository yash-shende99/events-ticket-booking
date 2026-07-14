<div align="center">
  <h1>🍿 CineVerse</h1>
  <p><strong>Advanced Ticketing & Event Management Platform</strong></p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
  ![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)
  ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
</div>

<br/>

CineVerse is a highly scalable, multi-tenant ticketing platform built with Next.js 15, MongoDB, and TailwindCSS. It features a complete tripartite architecture designed for Admins, Theatre/Event Organizers, and Customers, simulating the core engine of industry-leading platforms.

## 🚀 Live Demo & Environments

**Live Application URL:** [https://events-ticket-booking.vercel.app](https://events-ticket-booking.vercel.app) *(Update with your actual Vercel/Render URL)*

To experience the full system architecture, use the following pre-configured demo accounts:

1. **Admin / Superuser** (Full system control)
   - Email: `yashshende9999@gmail.com`
   - Password: `123456`
2. **Organizer** (Pre-loaded with 26 Movies & Events, Revenue Dashboards)
   - Email: `yash.22310893@viit.ac.in`
   - Password: `123456`
3. **Customer / User** (Booking flow, waitlists, checkout)
   - Email: `hvdpvd4@gmail.com`
   - Password: `123456`

## ✨ Key Technical Achievements

- 🎟️ **Unified Super Schema:** Supports both traditional Movie Screenings (with interactive seat mapping) and Live Events (with dynamic pricing tiers) seamlessly.
- ⚡ **High-Concurrency Seat Holding Engine:** Prevents double-booking using atomic database transactions and a strict 10-minute hold TTL via database-level expiry.
- 🤖 **Automated Waitlist Processing:** Automatically detects cancelled bookings, pulls the next user from the queue, and emails a time-limited (30 mins) priority checkout link.
- 📱 **Hardware-Integrated QR Validation:** Organizers can scan cryptographic Ticket QRs at the venue door using webcams or hardware barcode scanners for instant validation.
- 📊 **Real-time Analytics Dashboard:** Dynamic Recharts integration showing ticket sales trends, category-wise revenue distribution, and robust event performance comparisons.

## 1. System Architecture

The platform operates on a modernized **Next.js 15 App Router** architecture, leveraging React Server Components for highly optimized initial page loads (SEO-friendly) and Client Components for dynamic, real-time interactivity (Seat Map selection).

```mermaid
graph TD
    %% Core Infrastructure
    Client[Client Browser / Mobile App]
    CDN[Vercel Edge Network / CDN]
    Next[Next.js 15 Serverless Environment]
    DB[(MongoDB Atlas Cluster)]
    
    %% External Services
    Google[Google OAuth Provider]
    Stripe[Stripe / Razorpay Sandbox]
    Email[NodeMailer / Resend SMTP]

    %% Flow
    Client -->|HTTPS Requests| CDN
    CDN -->|Server Actions / API| Next
    Next <-->|Mongoose ODM| DB
    Next <-->|Auth Tokens| Google
    Next -->|Payment Intent| Stripe
    Next -->|Waitlist/Ticket Emails| Email
    
    subgraph Core Backend Engines
        SeatHold[Atomic Seat Hold Engine]
        Waitlist[Waitlist Auto-Assigner Daemon]
        QR[Cryptographic QR Validation]
    end
    
    Next --- SeatHold
    Next --- Waitlist
    Next --- QR
```

### Key Architectural Decisions:
- **Serverless API Routes:** Backend logic is deployed as stateless, horizontally scalable Serverless Functions on Vercel.
- **Optimistic UI Updates:** The React frontend utilizes optimistic state rendering to ensure the seat map feels instantaneous, verifying state asynchronously in the background.
- **Tripartite Authorization:** Middleware heavily protects `/admin/*` and `/organiser/*` routes, enforcing strict JWT claims to ensure tenant isolation.

---

## 2. Database Schema Overview (ER Diagram)

The database strictly enforces relational integrity within a NoSQL environment using Mongoose `ObjectIds` and `Populate` commands.

```mermaid
erDiagram
    USER ||--o{ BOOKING : makes
    USER ||--o{ WAITLIST : joins
    USER {
        ObjectId _id PK
        String name
        String email
        String role "admin | organiser | user"
        Array wishlistedMovies
        Array wishlistedEvents
    }

    USER ||--o{ VENUE_REQUEST : submits
    VENUE_REQUEST {
        ObjectId _id PK
        ObjectId organiserId FK
        String theaterName
        String city
        String status "PENDING | APPROVED | REJECTED"
    }

    THEATER ||--o{ SHOWTIME : hosts
    THEATER {
        ObjectId _id PK
        String name
        String city
        ObjectId organiserId FK
    }

    MOVIE ||--o{ SHOWTIME : has
    MOVIE {
        ObjectId _id PK
        String title
        String eventType "Movie | Event | Concert"
        Object basePricing "Custom Ticket Tiers"
        String trailerUrl
    }

    SHOWTIME ||--o{ SEAT : contains
    SHOWTIME ||--o{ BOOKING : booked_for
    SHOWTIME {
        ObjectId _id PK
        ObjectId movieId FK
        ObjectId theaterId FK
        Date date
        String time
    }

    SEAT {
        ObjectId _id PK
        ObjectId showtimeId FK
        String seatNumber
        String status "AVAILABLE | HELD | BOOKED"
        ObjectId heldBy FK
        Date holdExpiresAt
    }

    BOOKING ||--o{ TICKET : generates
    BOOKING {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId showtimeId FK
        Array seats
        Number totalPrice
        String status "CONFIRMED | CANCELLED"
        String qrCodeUrl
    }

    WAITLIST {
        ObjectId _id PK
        ObjectId showtimeId FK
        ObjectId userId FK
        String status "WAITING | OFFERED | EXPIRED | CONVERTED"
        Date offerExpiresAt
    }
```
    USER {
        ObjectId _id
        String name
        String email
        String role "admin | organiser | user"
    }

    THEATER ||--o{ MOVIE : hosts
    THEATER {
        ObjectId _id
        String name
        String city
        ObjectId organiserId
    }

    MOVIE ||--o{ SHOWTIME : has
    MOVIE {
        ObjectId _id
        String title
        String eventType "Movie | Event | Concert"
        Object basePricing "Custom Ticket Tiers"
    }

    SHOWTIME ||--o{ SEAT : contains
    SHOWTIME ||--o{ BOOKING : booked_for
    SHOWTIME {
        ObjectId _id
        ObjectId movieId
        ObjectId theaterId
        Date date
        String time
    }

    SEAT {
        ObjectId _id
        ObjectId showtimeId
        String seatNumber
        String status "AVAILABLE | HELD | BOOKED"
        ObjectId heldBy
        Date holdExpiresAt
    }

    BOOKING ||--o{ TICKET : generates
    BOOKING {
        ObjectId _id
        ObjectId userId
        ObjectId showtimeId
        Number amount
        String status "CONFIRMED | CANCELLED"
    }

    WAITLIST {
        ObjectId _id
        ObjectId showtimeId
        ObjectId userId
        String status "WAITING | OFFERED | EXPIRED | CONVERTED"
        Date offerExpiresAt
    }
```

---

## 3. High-Concurrency & Concurrency Explanation

### The Double-Booking Threat
In high-demand ticketing scenarios (e.g., a massive Marvel movie release or a Taylor Swift concert), it is common for thousands of users to view the exact same Seat Map simultaneously. If 100 users click on seat `A1` at the exact same millisecond, a standard dual-step database query (`find()` -> verify -> `save()`) creates a massive Race Condition. Multiple users will successfully bypass the verification step before the database commits the first save, resulting in catastrophic double-booking.

### The Solution: MongoDB Atomic Operations
We completely eliminate application-level race conditions by pushing the concurrency check directly to the database lock level using MongoDB's atomic `findOneAndUpdate` combined with strict conditional matching.

**The Execution Logic:**
```javascript
// Serverless API Action (/hold-seats)
const seat = await Seat.findOneAndUpdate(
  {
    _id: requestedSeatId,
    showtimeId: currentShowtimeId,
    status: "AVAILABLE", // CRITICAL: Strict exact-match condition
  },
  {
    $set: {
      status: "HELD",
      heldBy: currentUserId,
      holdExpiresAt: new Date(Date.now() + 10 * 60 * 1000) // Exactly 10 Minute TTL
    }
  },
  { new: true } // Return updated document if successful
);

if (!seat) {
    throw new Error("Seat already taken or held by another user.");
}
```

### How the Engine Works:
1. **Atomic Exclusivity:** MongoDB applies a document-level lock during `findOneAndUpdate`. If 100 threads execute this query simultaneously, the first thread locks the document, verifies `status: "AVAILABLE"`, and updates it to `HELD`. 
2. **Instant Rejection:** By the time the lock releases for the remaining 99 threads, the `status` is no longer `"AVAILABLE"`. The query condition fails, returning `null`, and the backend safely throws a "Seat Unavailable" exception. No double-bookings ever occur.
3. **Time-To-Live (TTL) Auto-Release:** Once a seat is marked as `HELD`, the user is granted exactly 10 minutes to complete the checkout/payment flow. The database relies on `holdExpiresAt`. If a user abandons the checkout, a background cleanup daemon (or dynamic read-time evaluator) seamlessly releases the seat back to the pool, triggering live UI updates for other customers.

---

## 4. Waitlist Auto-Assignment Flow

```mermaid
sequenceDiagram
    participant UserA (Booked)
    participant Database
    participant UserB (Waitlisted)
    
    UserA->>Database: Cancels Booking
    Database->>Database: Release Seats (BOOKED -> AVAILABLE)
    Database->>Database: Check Waitlist for this Showtime
    
    alt Waitlist has users in 'WAITING' status
        Database->>Database: Select UserB (First in line)
        Database->>Database: Update Waitlist Status to 'OFFERED'
        Database->>Database: Set offerExpiresAt (CurrentTime + 30 mins)
        Database-->>UserB: Trigger NodeMailer: "Priority Checkout Link"
        
        alt UserB clicks link & pays within 30 mins
            UserB->>Database: POST /checkout
            Database->>Database: Waitlist Status -> 'CONVERTED'
            Database->>Database: Seats -> BOOKED
        else UserB ignores email (30 mins pass)
            Database->>Database: Cron marks UserB 'EXPIRED'
            Database->>Database: Loops to UserC in waitlist
        end
    end
```

---

## 5. Setup & Local Development Guide

<details>
<summary><strong>🛠️ Click to expand setup instructions</strong></summary>

### Prerequisites
- Node.js 18+
- MongoDB instance (Atlas or local)
- Google Cloud Console account (for OAuth)

### Environment Variables (`.env.local`)
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster...
NEXTAUTH_SECRET=generate_a_random_secure_string
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Service (for QR & Waitlist)
EMAIL_SERVER_USER=your_email@gmail.com
EMAIL_SERVER_PASSWORD=your_app_password
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/yash-shende99/events-ticket-booking.git
cd events-ticket-booking
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

</details>

---

## 6. Project Structure (Monorepo)

```text
├── src/
│   ├── app/                # Next.js 15 App Router Pages & API Routes
│   │   ├── (auth)/         # Authentication & Login flows
│   │   ├── admin/          # Admin Superuser Dashboards
│   │   ├── api/            # Serverless Backend Endpoints
│   │   ├── organiser/      # Venue & Event Management Dashboards
│   │   ├── movies/         # Public Facing Movie Discovery
│   │   └── events/         # Public Facing Event Discovery
│   ├── components/         # Reusable React UI Components (Tailwind)
│   ├── lib/                # Database connections, Auth options, Utils
│   └── models/             # Mongoose Schemas (User, Movie, Ticket)
├── public/                 # Static assets (fonts, icons, default images)
└── tailwind.config.ts      # Global styling system
```

---

## 7. API Design & Documentation

- `POST /api/showtimes/[id]/hold-seats` - Validates seat availability and atomically applies a hold TTL.
- `POST /api/showtimes/[id]/book` - Finalizes a payment session and converts HELD seats to BOOKED.
- `POST /api/waitlist/[id]/join` - Adds a user to the seat waitlist queue.
- `POST /api/wishlist` - Synchronizes user event interest tracking.
- `GET /api/organiser/stats` - Aggregates secure venue-level revenue analytics for the Organizer dashboard.

---

## 📸 8. Screenshots

*(Replace the placeholder URLs with actual screenshots from your repository. You can upload them to a `/public/docs` folder or host them via GitHub issues/imgur).*

### Customer Flow (Seat Selection & YouTube Trailers)
![Seat Selection Map](https://via.placeholder.com/800x400?text=Interactive+Seat+Map+Screenshot)
![Movie Details](https://via.placeholder.com/800x400?text=Movie+Details+%26+Trailer+Screenshot)

### Organizer Dashboard (Revenue Analytics)
![Organizer Dashboard](https://via.placeholder.com/800x400?text=Organizer+Revenue+Dashboard+Screenshot)
![Booking Management](https://via.placeholder.com/800x400?text=Booking+Management+Table+Screenshot)


## 👨‍💻 10. Author / Contact

**Yash Shende**
- **Email:** yashshende9999@gmail.com
- **LinkedIn:** [Insert your LinkedIn URL here]
- **GitHub:** [https://github.com/yash-shende99](https://github.com/yash-shende99)