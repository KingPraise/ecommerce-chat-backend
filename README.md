# E-Commerce Chat Backend

A robust, real-time chat backend for e-commerce platforms, built with **Node.js**, **Express**, **MongoDB**, and **Socket.IO**.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Real-Time Communication:** Socket.IO
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Helmet, CORS
- **Logging:** Morgan
- **File Uploads:** Multer

---

## ⚡ Features

- Secure user authentication (signup & login)
- Real-time messaging with instant delivery
- Typing indicators and online/offline presence
- Message read receipts
- Conversation management (create, fetch)
- File attachments support
- Scalable and modular architecture

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ecommerce-chat-backend.git
cd ecommerce-chat-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=4000
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
```

### 4. Start the Development Server

```bash
npm run dev
```

The server will be available at [http://localhost:4000](http://localhost:4000).

---

## 🧪 Testing

### API Endpoints

Use **Postman** or a similar tool to test the following endpoints:

| Method | Endpoint                        | Description                              |
|--------|---------------------------------|------------------------------------------|
| POST   | `/api/auth/signup`              | Register a new user                      |
| POST   | `/api/auth/login`               | Authenticate user and receive JWT token  |
| POST   | `/api/conversations`            | Start a new conversation                 |
| GET    | `/api/conversations`            | Retrieve all user conversations          |
| POST   | `/api/messages`                 | Send a message (requires conversationId) |
| GET    | `/api/messages/:conversationId` | Fetch messages for a conversation        |

> **Note:** For protected routes, include the JWT token in the `Authorization` header:  
> `Authorization: Bearer <your_token_here>`

### Real-Time Events

Test real-time features using the **Socket.IO Tester** Chrome extension or a compatible client.

- **Connect to:** `http://localhost:4000`

#### Supported Events

- **Register User**
    ```
    Event: register
    Payload: <userId>
    ```

- **Send Message**
    ```
    Event: sendMessage
    Payload: { conversationId, senderId, recipientId, text }
    ```

- **Typing Indicators**
    ```
    Event: typing
    Payload: { conversationId, senderId, recipientId }

    Event: stopTyping
    Payload: { conversationId, senderId, recipientId }
    ```

- **Mark Messages as Read**
    ```
    Event: markRead
    Payload: { conversationId, userId, recipientId }
    ```

---

## 🏗️ Challenges & Solutions

- **Real-time Communication:** Utilized Socket.IO with user mapping for efficient online user management.
- **CORS Handling:** Configured CORS and Socket.IO to allow secure cross-origin requests.
- **Message Validation:** Enforced Mongoose validation to ensure messages include content or attachments.
- **Scalability:** Adopted a modular structure for routes, controllers, and models to enhance maintainability.

---

## 📌 Notes

- Ensure MongoDB is running locally or remotely before starting the server.
- Uploaded files are accessible via the `/uploads` route.
- JWT authentication is required for all protected endpoints.
- Compatible with frontend applications running on `http://localhost:5173` (update `CORS_ORIGIN` as needed).

---

## 📁 Project Structure

```
src/
├── controllers/
│   ├── authController.js
│   ├── conversationController.js
│   ├── messageController.js
├── models/
│   ├── User.js
│   ├── Conversation.js
│   ├── Message.js
│   ├── Notification.js
├── routes/
│   ├── authRoutes.js
│   ├── conversationRoutes.js
│   ├── messageRoutes.js
│   ├── presenceRoutes.js
├── socket/
│   └── socket.js
├── utils/
│   ├── generateToken.js
│   ├── notify.js
├── middleware/
│   └── authMiddleware.js
├── app.js
├── server.js
```

---

## 📄 License

This project is licensed under the **MIT License**.