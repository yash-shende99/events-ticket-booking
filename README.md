<div align="center">
  <h1>🍿 CineVerse</h1>
  <p><strong>Advanced Ticketing & Event Management Platform</strong></p>
  
  [![Live Demo](https://img.shields.io/badge/Live_Demo-Access_Now-FF4154?style=for-the-badge&logo=vercel)](https://events-ticket-booking-nine.vercel.app)
  
  ![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
  ![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)
  ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
</div>

<br/>

<div align="justify">
  CineVerse is a modern, highly scalable ticketing and event management ecosystem inspired by industry leaders like BookMyShow. Engineered to solve complex distributed systems challenges like high-concurrency seat locking and automated waitlist routing, it seamlessly connects <strong>moviegoers</strong>, <strong>event organizers</strong>, and <strong>system administrators</strong> in one unified platform. Built on cutting-edge technologies (Next.js 15, MongoDB, Tailwind CSS), CineVerse is designed to effortlessly handle massive, high-traffic ticket drops while delivering a flawless, lightning-fast user experience.
</div>

## 🚀 Live Demo & Environments

🌍 **Launch Application:** [events-ticket-booking-nine.vercel.app](https://events-ticket-booking-nine.vercel.app)

To experience the full system architecture, use the following pre-configured demo accounts:

| Role | Email | Password | What You Can Do |
| :--- | :--- | :--- | :--- |
| 🛡️ **SuperAdmin** | `yashshende9999@gmail.com` | `123456` | Approve venues, monitor platform-wide analytics, manage global user base. |
| 🎭 **Organizer** | `yash.22310893@viit.ac.in` | `123456` | Track real-time seat monitoring, view revenue dashboards, manage 26+ pre-loaded events. |
| 👤 **Customer** | `hvdpvd4@gmail.com` | `123456` | Experience the booking flow, interactive seat map, add-ons, waitlists, and checkout. |

## ✨ Key Technical Achievements

🎟️ **Unified Super Schema:** Supports both traditional Movie Screenings (with interactive seat mapping) and Live Events (with dynamic pricing tiers) seamlessly.

⚡ **High-Concurrency Seat Holding Engine:** Prevents double-booking using atomic database transactions and a strict 10-minute hold TTL via database-level expiry.

🤖 **Automated Waitlist Processing:** Automatically detects cancelled bookings, pulls the next user from the queue, and emails a time-limited (30 mins) priority checkout link.

📱 **Hardware-Integrated QR Validation:** Organizers can scan cryptographic Ticket QRs at the venue door using webcams or hardware barcode scanners for instant validation.

📊 **Real-time Analytics Dashboard:** Dynamic Recharts integration showing ticket sales trends, category-wise revenue distribution, and robust event performance comparisons.

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

### 4.1 Waitlist Implementation (Deep Dive)

When a booking is cancelled, the system executes this atomic sequence to find the next waiting user:

```javascript
// Serverless API Action (/api/waitlist/process-cancellation)
const nextInLine = await Waitlist.findOneAndUpdate(
  {
    showtimeId: currentShowtimeId,
    status: "WAITING",
  },
  {
    $set: {
      status: "OFFERED",
      offerExpiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 min expiry
    }
  },
  { sort: { createdAt: 1 }, new: true } // Guarantees FIFO Queue Ordering
);

if (nextInLine) {
    // Generate time-limited JWT token & trigger Priority Email
    await sendPriorityEmail(nextInLine.userId, offerToken);
}
```

---

## 5. Database Indexing & Performance 🚀

To support high-concurrency read/writes during massive event drops, the MongoDB database relies on heavily optimized indexes:

```javascript
// 1. Core Concurrency Index (Fast seat availability lookup)
SeatSchema.index({ showtimeId: 1, status: 1, seatNumber: 1 }, { unique: true });

// 2. Waitlist FIFO Optimization Index
WaitlistSchema.index({ showtimeId: 1, status: 1, createdAt: 1 });

// 3. Automated Time-To-Live (TTL) Cleanup Index
SeatSchema.index(
  { holdExpiresAt: 1 },
  { expireAfterSeconds: 0, partialFilterExpression: { status: 'HELD' } }
);
```
*Note: The TTL index ensures that if the Next.js server crashes mid-checkout, MongoDB itself will automatically evict the hold after 10 minutes without requiring a manual cron job.*

---

## 6. Security & Role-Based Access Control 🔒

The platform employs strict API and Route-level guarding via Next.js Middleware and NextAuth JWTs.

```typescript
// middleware.ts snippet
export function middleware(request: NextRequest) {
  const session = await getToken({ req: request });
  const path = request.nextUrl.pathname;

  // Hard block standard users from Organizer/Admin panels
  if (path.startsWith('/organiser') && session?.role !== 'organiser') {
    return NextResponse.redirect(new URL('/?error=Unauthorized', request.url));
  }
}
```

---

## 7. Setup & Local Development Guide

<details>
<summary><strong>🛠️ Click to expand setup instructions</strong></summary>

### Prerequisites
- Node.js 18+
- MongoDB instance (Atlas or local)
- Google Account (App Password required for Nodemailer)

### Environment Variables (`.env.local`)
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster...
NEXTAUTH_SECRET=generate_a_random_secure_string
NEXTAUTH_URL=http://localhost:3000

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

## 8. Project Structure (Monorepo)

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

## 9. API Design & Documentation

- `POST /api/showtimes/[id]/hold-seats` - Validates seat availability and atomically applies a hold TTL.
- `POST /api/showtimes/[id]/book` - Finalizes a payment session and converts HELD seats to BOOKED.
- `POST /api/waitlist/[id]/join` - Adds a user to the seat waitlist queue.
- `POST /api/wishlist` - Synchronizes user event interest tracking.
- `GET /api/organiser/stats` - Aggregates secure venue-level revenue analytics for the Organizer dashboard.

---

## 📸 10. Application Gallery

Here's a visual walkthrough of the CineVerse experience, from discovery to checkout to management.

<div align="center">

### The Customer Experience

| Homepage & Discovery | Dynamic Seat Selection |
| :---: | :---: |
| <img src="website_screenshots/events-ticket-booking-nine.vercel.app_movies.png" width="400"/> | <img src="website_screenshots/seat-selection.png" width="400"/> |
| *Browsing the latest movies and events* | *Interactive, real-time theater seat mapping* |

| Add-ons & Concessions | Digital Ticketing & Orders |
| :---: | :---: |
| <img src="website_screenshots/addons.png" width="400"/> | <img src="website_screenshots/events-ticket-booking-nine.vercel.app_profile_orders.png" width="400"/> |
| *Food and beverage upselling during checkout* | *User profile showing confirmed tickets and QR codes* |

### The Organiser & Admin Hub

| Organiser Dashboard | Admin Venue Management |
| :---: | :---: |
| <img src="website_screenshots/events-ticket-booking-nine.vercel.app_organiser.png" width="400"/> | <img src="website_screenshots/events-ticket-booking-nine.vercel.app_admin_venues.png" width="400"/> |
| *Real-time analytics and revenue tracking* | *Superadmin control over platform-wide venues* |

| Organiser Real-time Monitoring | Admin Screen Layouts |
| :---: | :---: |
| <img src="website_screenshots/seat-monitoring.png" width="400"/> | <img src="website_screenshots/venue-screens.png" width="400"/> |
| *Real-time booking and seat monitoring* | *Managing screen dimensions and layout matrices* |

</div>

<br/>
<p align="center"><b>Built with ❤️ by Yash Shende</b></p>
