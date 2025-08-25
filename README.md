# E-Commerce Chat Backend

A scalable, real-time chat backend built for e-commerce platforms using Node.js, Express, MongoDB, and Socket.IO.

---


## Features

- JWT-based user authentication (signup/login)
- Real-time messaging with Socket.IO
- Typing indicators and presence (online/offline)
- Message read receipts
- Conversation creation and retrieval
- File attachments support (Multer)
- Notification model and real-time notifications
- Modular codebase suitable for scaling

---

## Tech Stack

- Node.js + Express
- MongoDB with Mongoose
- Socket.IO for real-time communication
- JWT for auth
- Multer for file uploads
- Helmet, CORS, Morgan for security and logging

---

## Quick Start

1. Clone the repo and install dependencies

```bash
git clone https://github.com/yourusername/ecommerce-chat-backend.git
cd ecommerce-chat-backend
npm install
```

2. Create a `.env` in the project root with at least:

```env
PORT=4000
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
```

3. Start the development server

```bash
npm run dev
```

Server will be available at http://localhost:4000 (adjust `PORT` as needed).

---

## API Reference

All API routes are namespaced under `/api`.

Authentication
- POST `/api/auth/signup` — Register a user (returns JWT)
- POST `/api/auth/login` — Login user (returns JWT)

Conversations
- POST `/api/conversations` — Create or fetch an existing conversation
- GET `/api/conversations` — Get conversations for the authenticated user

Messages
- POST `/api/messages` — Send a message. Body should include `conversationId`, `senderId`, `text` (and optional attachment).
- GET `/api/messages/:conversationId` — Fetch messages for a conversation

Notifications
- GET `/api/notifications` — Retrieve user notifications

Notes
- Protected endpoints require the Authorization header: `Authorization: Bearer <token>`

---

## Socket.IO Events

Connect to the same origin as the API (e.g., `http://localhost:4000`). The server emits and listens to events used by the frontend.

Client -> Server
- `register` — payload: `userId` (register socket id for the user)
- `sendMessage` — payload: `{ conversationId, senderId, recipientId, text, attachment? }`
- `typing` / `stopTyping` — payload: `{ conversationId, senderId, recipientId }`
- `markRead` — payload: `{ conversationId, userId, recipientId }`

Server -> Client
- `message` — emitted to recipient(s) when a new message arrives
- `typing` / `stopTyping` — relays typing state
- `notification` — emitted for new notifications
- `presence` — updates online/offline status

Testing tip: use a Socket.IO client or the Socket.IO Tester extension to emit events and listen for responses.

---

## Environment & Configuration

- Keep secrets out of version control: use `.env` and a secrets manager in production.
- Recommended env entries: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`.

Optional production additions
- `REDIS_URL` for Socket.IO adapter in clustered environments
- `NODE_ENV=production`
- Logging DSN for monitoring (Sentry, Loggly, etc.)

---

## Best Practices & Production Recommendations

- Use HTTPS and HSTS in production.
- Run behind a reverse proxy (NGINX) or cloud load balancer.
- Use a process manager like PM2 or run as containers orchestrated by Kubernetes.
- Enable a Socket.IO adapter (Redis) when running multiple instances.
- Add request / schema validation (Joi or express-validator) where missing.
- Add rate limiting and input sanitization to prevent abuse.
- Add unit and integration tests for controllers and socket handlers.
- Add structured logging (Winston) and error monitoring (Sentry).

---

## Project Structure

```
src/
├── app.js                  # Express app configuration (middleware, routes)
├── server.js               # HTTP + Socket.IO bootstrap
├── config/
│   ├── db.js               # MongoDB connection helper
│   └── upload.js           # Multer upload configuration
├── controllers/            # Route handlers and business logic
├── middleware/             # Auth and error-handling middleware
├── models/                 # Mongoose models: User, Conversation, Message, Notification
├── routes/                 # Express route definitions
├── socket/                 # Socket.IO event handlers and helpers
├── utils/                  # Helpers (token generation, notifications)
└── uploads/                # Uploaded files (served statically)
```

---

## How to Test Locally

- Ensure MongoDB is reachable (local or cloud).
- Use Postman for REST APIs and a Socket.IO client to test real-time events.
- Example: create two users, register both sockets, then emit `sendMessage` from one to the other and observe the `message` event.

---

## Next Steps / Suggested Improvements

- Add automated tests (Jest + Supertest) for API and socket flows.
- Add CI (GitHub Actions) to run tests and lint on PRs.
- Add Dockerfile and docker-compose for local dev and production deployments.
- Integrate Redis adapter for Socket.IO to support horizontal scaling.
- Harden security headers and CSP for production.

---

## License

This project is licensed under the MIT License.


