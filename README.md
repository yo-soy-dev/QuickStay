# 🏨 QUICKSTAY -  Hotel Booking Website (MERN Stack)

A complete hotel booking system built using the **MERN Stack** with user authentication, email notifications, admin dashboard, online payments, and deployment on Vercel.

---

## 📌 Features

### 🔐 **User Authentication (Clerk)**

* Login & Registration using **Clerk**
* Ready-made sign-in / sign-up components
* Profile management (edit profile, manage sessions)
* Secure authentication & user management

---

### 🏩 **Hotel & Room Management**

* Users can browse and search hotel rooms
* Add new hotel rooms (admin or authorized users)
* Room details page with images, amenities, pricing & availability
* Admin dashboard to manage:

  * All hotels
  * All bookings
  * Users
  * Payments

---

### 🧾 **Booking System**

* Real-time availability check
* Instant booking confirmation
* Booking history for each user
* Cancel booking option (optional feature)

---

### 📧 **Email Notifications**

Automatically send confirmation emails when:

* User books a hotel
* Payment is successful
  Email service: **Nodemailer / Resend / SMTP** (choose one)

---

### 💳 **Online Payments (Stripe)**

* Secure hotel fee payments through Stripe
* Stripe Checkout Integration
* Webhook support for verifying payments
* Payment logs stored in MongoDB

---

### ☁️ **Deployment**

* Frontend deployed on **Vercel**
* Backend deployed on **Vercel / Render / Railway** (choose one)
* Environment variables securely stored on Vercel

---

## 🛠️ Tech Stack

### **Frontend**

* React.js
* React Router
* TailwindCSS / CSS Modules
* Clerk Authentication
* Axios

### **Backend**

* Node.js
* Express.js
* MongoDB & Mongoose
* Nodemailer / Resend
* Stripe Payment API

### **Other Tools**

* JSON Web Tokens
* Cloudinary for image uploads (optional)
* Vercel deployment

---

## 📂 Project Structure

```
hotel-booking/
│
├── client/              # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
│
├── server/              # Node.js backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repo

```bash
git clone https://github.com/yourusername/hotel-booking.git
cd hotel-booking
```

---

## 🖥️ Backend Setup

### Install Dependencies

```bash
cd server
npm install
```

### Create `.env`

```
MONGO_URI=your_mongodb_connection
CLERK_SECRET_KEY=your_clerk_secret
STRIPE_SECRET_KEY=your_stripe_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password
FRONTEND_URL=http://localhost:5173
```

### Run Backend

```bash
npm start
```

---

## 🌐 Frontend Setup

### Install Dependencies

```bash
cd client
npm install
```

### Create `.env.local`

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=http://localhost:5000
```

### Start Frontend

```bash
npm run dev
```

---

## 📮 Email Setup (Optional)

Using **Nodemailer**:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

## 💳 Stripe Setup

1. Create a Stripe account
2. Get your API keys from dashboard
3. Enable webhooks (optional but recommended)

---

## 🚀 Deployment

### Frontend (Vercel)

* Connect GitHub repo to Vercel
* Set environment variables
* Deploy

### Backend (Vercel / Render / Railway)

* Upload backend folder
* Add environment variables
* Deploy and update frontend environment URL

---

## 🛡️ Security

* All sensitive data stored in `.env`
* Clerk manages authentication securely
* Stripe processes all payments
* Protected admin routes using middleware

---

## 📸 Screenshots

<img width="1888" height="894" alt="image" src="https://github.com/user-attachments/assets/8afeb5cb-9860-44ad-a405-67d260459caf" />
<img width="1879" height="897" alt="image" src="https://github.com/user-attachments/assets/04529346-05cf-4292-bb4f-24220f1fd77e" />
<img width="1875" height="609" alt="image" src="https://github.com/user-attachments/assets/06321c08-7bfd-4adc-97e2-e179cdad08e6" />



---

## 🤝 Contributing

Contributions are welcome!
Feel free to submit a PR or open an issue.

---

## ⭐ Support

If you like this project, consider starring the repo ❤️
