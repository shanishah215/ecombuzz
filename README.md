# Ecombuzz 🛒

Ecombuzz is a full-stack, modern e-commerce web application. It features a complete shopping experience from browsing products to cart management, checkout, user authentication, and profile management. 

## 🚀 Features

- **User Authentication**: Secure Login & Registration with JWT.
- **Product Management**: Browse products, view product details, and manage wishlists.
- **Shopping Cart**: Add, update, or remove items from the cart.
- **Checkout & Orders**: Checkout process and comprehensive order history.
- **User Profile**: Profile viewing capability.
- **Admin Section**: Features for managing the application's data.
- **Responsive Design**: Mobile-friendly, beautiful user interface using modern design practices.

## 🛠️ Tech Stack

### Frontend
- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (Global state)
- **Data Fetching:** [React Query](https://tanstack.com/query/latest) & Axios
- **Routing:** React Router DOM
- **Icons:** Lucide React

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Language:** TypeScript
- **Database:** [MongoDB](https://www.mongodb.com/) using Mongoose
- **Caching / Key-Value Store:** [Redis](https://redis.io/)
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs
- **Validation:** Zod
- **Security:** Helmet, Express Rate Limit, CORS

### Infrastructure
- **Docker:** Complete Dockerization via `docker-compose.yml` for Mongo, Redis, Backend, and Frontend.

## 📂 Project Structure

```text
ecombuzz/
├── server/               # 🔙 Express Backend Code
│   ├── src/
│   │   ├── config/       # Environment variables & DB connections
│   │   ├── controllers/  # API request handlers
│   │   ├── middleware/   # Express middlewares (Auth, rate limit, etc.)
│   │   ├── models/       # Mongoose models/schemas
│   │   ├── repositories/ # Database interaction layer
│   │   ├── routes/       # API route definitions
│   │   ├── services/     # Core business logic
│   │   ├── types/        # TypeScript type definitions
│   │   ├── utils/        # Utility and helper functions
│   │   ├── app.ts        # Express app initialization
│   │   ├── index.ts      # Server entry point
│   │   └── seed.ts       # Database seeder script
│   └── package.json      # Backend dependencies
├── src/                  # 🎨 React Frontend Code
│   ├── api/              # API clients and requests (Axios)
│   ├── assets/           # Static assets (images, etc.)
│   ├── components/       # Reusable UI components
│   ├── features/         # Feature-specific modules
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Library wrappers or configuration
│   ├── pages/            # Route components (Home, Cart, Checkout, etc.)
│   ├── router/           # React Router setup
│   ├── store/            # Zustand stores (Cart, User, Wishlist, etc.)
│   ├── types/            # Frontend TypeScript interfaces/types
│   ├── utils/            # Helper functions
│   ├── App.tsx           # Main application shell
│   └── main.tsx          # React application entry point
├── public/               # Public static assets
├── docker-compose.yml    # Docker multi-container composition
└── package.json          # Frontend dependencies & scripts
```

## 🏃‍♂️ Running the Application

There are two primary ways to run the application: utilizing Docker for a completely packaged environment, or running it locally for development.

### Option 1: Using Docker (Recommended for ease of setup)

Make sure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed.

1. Clone the repository and navigate into the root directory:
   ```bash
   cd ecombuzz
   ```

2. Start all services (MongoDB, Redis, Backend, Frontend):
   ```bash
   docker-compose up --build
   ```
   *To run in the background, append the `-d` flag.*

3. The application will be accessible at `http://localhost`.

### Option 2: Local Development Setup

If you prefer to run the services separately on your machine:

#### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or remotely (Update `MONGO_URI` in `server/.env`)
- Redis running locally or remotely (Update `REDIS_URL` in `server/.env`)

#### 1. Setup Backend
```bash
# Navigate to the server folder
cd server

# Install dependencies
npm install

# Setup environment variables
# Copy .env.example to .env and adjust variables if needed
# cp .env.example .env

# Optional: Seed the database with initial dummy data
npm run seed

# Start the dev server
npm run dev
```
The backend API will run on `http://localhost:5000`.

#### 2. Setup Frontend
Open a new terminal window:
```bash
# From the root directory, install frontend dependencies
npm install

# Start the React development server
npm run dev
```
The frontend application will typically be accessible on `http://localhost:5173`.
