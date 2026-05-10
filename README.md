# 🚀 Freelancer platform using MERN

A full-stack freelance collaboration platform built using the **MERN stack**, enabling clients and freelancers to manage projects, communicate in real-time, and handle payments within a unified workspace.


---

## ✨ Key Features

### 🔐 Authentication & Access
- Secure user authentication using **JWT**
- Role-based access: **Client** and **Freelancer**

### 📁 Project Management
- Clients can create and manage projects with budgets and requirements
- Freelancers can submit proposals and bids
- Accepted proposals automatically create project workspaces

### 📊 Workspace & Task Tracking
- Dedicated workspace for each project
- **Kanban board** for task tracking (To Do, In Progress, Done)
- File uploads and asset management via **Cloudinary**

### 💬 Real-Time Communication
- Instant messaging using **Socket.IO**
- Project-specific chat and direct user messaging
- Notification system for updates and activities

### 💳 Payments & Billing
- Integrated **Stripe** payment gateway
- Secure transaction handling with webhook verification

### 👤 Profiles & Social Features
- User profiles with skills, experience, and portfolio
- Ratings and reviews for clients and freelancers
- Social feed with posts, likes, and connections

### 📱 UI/UX
- Built with **Tailwind CSS**
- Fully responsive across devices

---

## 🛠 Tech Stack

**Frontend:**  
React.js, Vite, React Router, Axios, Tailwind CSS  

**Backend:**  
Node.js, Express.js  

**Database:**  
MongoDB Atlas (Mongoose)  

**Real-Time:**  
Socket.IO  

**Payments:**  
Stripe  

**Storage:**  
Cloudinary  

**Authentication:**  
JWT (JSON Web Tokens)  

**Deployment:**  
Vercel (Frontend), AWS EC2 + Nginx + PM2 (Backend)

---

## 📂 Project Structure


freelancerProjectHub/
├── client/ # Frontend (React + Tailwind)
├── server/ # Backend (Node.js + Express)
├── README.md
└── package.json


---

## ⚙️ Setup Instructions

### 1. Clone Repository
```bash```
git clone https://github.com/your-username/freelancerProjectHub.git
cd freelancerProjectHub
2. Backend Setup
cd server
npm install

Create .env file:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret

CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

STRIPE_SECRET_KEY=your_key
STRIPE_WEBHOOK_SECRET=your_secret

Run backend:

npm start
3. Frontend Setup
cd client
npm install

Create .env:

VITE_API_BASE_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=your_key

Run frontend:

npm run dev
🌐 Deployment
Frontend: Hosted on Vercel
Backend: Deployed on AWS EC2 with Nginx and PM2
SSL enabled using Let's Encrypt
👨‍💻 Author

P R Vishal
📧 prvishal200416@gmail.com

🔗 https://www.linkedin.com/in/peddanolla-ragichettukindi-vishal

⭐ Highlights
Full-stack MERN architecture
Real-time communication using WebSockets
Secure payment integration with Stripe
Scalable deployment with AWS + Vercel
