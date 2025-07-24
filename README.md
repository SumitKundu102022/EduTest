# EduTest: AI-Powered Online Assessment Platform 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/mern-stack)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/en)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=flat&logo=render&logoColor=white)](https://render.com/)

---

## 📖 Table of Contents

* [🌟 About The Project](#-about-the-project)
* [✨ Features](#-features)
* [🚀 Technologies Used](#-technologies-used)
* [🛠️ Getting Started](#%EF%B8%8F-getting-started)
    * [Prerequisites](#prerequisites)
    * [Backend Setup](#backend-setup)
    * [Frontend Setup](#frontend-setup)
    * [Environment Variables](#environment-variables)
* [🌐 Deployment](#-deployment)
* [🤝 Contributing](#-contributing)
* [📄 License](#-license)

---

## 🌟 About The Project

**EduTest** is an innovative, full-stack MERN (MongoDB, Express.js, React, Node.js) web application designed to transform the online assessment and learning experience. It offers a comprehensive platform where educators and administrators can effortlessly create and manage tests, while candidates can engage in personalized assessments, track their progress, and enhance their knowledge.

A core distinguishing feature of EduTest is its **integrated AI capabilities for dynamic content generation**. This allows administrators to generate diverse and relevant test questions directly from their notes or provided content, significantly streamlining the test creation process and ensuring high-quality assessments.

The application prioritizes a seamless and secure user experience, featuring flexible authentication options, a highly responsive design, and intuitive navigation.

---

## ✨ Features

EduTest offers a rich set of functionalities for both its user types:

### For Candidates:

* **User Authentication:** Secure registration and login using traditional email/password or seamless "Login with Google".
* **Application Management:** Ability to complete and update personal application forms.
* **Test Taking:** Access and take various assigned test series.
* **Performance Tracking:** View detailed test results and monitor progress over time.
* **Intuitive Interface:** A clean and user-friendly dashboard for easy navigation.

### For Administrators:

* **User Management:** Oversee registered candidates and their application statuses.
* **Test Creation & Management:**
    * Create new tests with custom questions.
    * **AI-Powered Question Generation:** Generate test questions from provided text/notes using integrated AI.
    * Manage, edit, and delete existing tests.
* **Result Monitoring:** Access and analyze candidate performance and test results.
* **Role-Based Access:** Secure access to admin-specific functionalities.

### Core Platform Features:

* **Secure Authentication:** Utilizes JWTs stored in HTTP-only cookies for enhanced security against XSS attacks.
* **Cross-Origin Resource Sharing (CORS):** Properly configured for seamless communication between deployed frontend and backend.
* **Responsive Design:** Built with Tailwind CSS to ensure optimal viewing and interaction across all devices (desktops, tablets, mobile phones).
* **Smooth Animations:** Leverages Framer Motion for engaging UI transitions and animations.
* **Real-time Feedback:** Provides instant user feedback through elegant toast notifications (Sonner) for actions and errors (including specific network error messages).

---

## 🚀 Technologies Used

EduTest is built with a modern and robust technology stack:

### Frontend:

* **React.js:** A declarative, component-based JavaScript library for building user interfaces.
* **Vite:** A next-generation frontend tooling that provides an extremely fast development experience.
* **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
* **Shadcn UI:** A collection of re-usable components built with Radix UI and Tailwind CSS.
* **React Router DOM:** For client-side routing.
* **Axios:** Promise-based HTTP client for the browser and Node.js.
* **@react-oauth/google:** For integrating Google's OAuth 2.0 authentication flow.
* **Framer Motion:** A production-ready motion library for React.
* **Sonner:** An opinionated toast component for React.
* **Lucide React:** A beautiful collection of open-source icons.

### Backend:

* **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
* **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
* **MongoDB:** A NoSQL, document-oriented database.
* **Mongoose:** An elegant MongoDB object modeling for Node.js.
* **jsonwebtoken (JWT):** For creating and verifying JSON Web Tokens for authentication.
* **google-auth-library:** Google's official client library for verifying ID tokens.
* **bcryptjs:** For hashing passwords securely.
* **cookie-parser:** Middleware to parse Cookie headers and populate `req.cookies`.
* **cors:** Express middleware to enable Cross-Origin Resource Sharing.
* **express-async-handler:** Simple middleware for handling exceptions in async Express routes.
* **dotenv:** Loads environment variables from a `.env` file.

### Database:

* **MongoDB Atlas:** Cloud-hosted MongoDB service for scalable and reliable data storage.

### Deployment:

* **Render.com:** Cloud platform for deploying web services and databases.

---

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

* [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
* [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
* [Git](https://git-scm.com/downloads)
* [MongoDB Atlas Account](https://cloud.mongodb.com/) (for cloud database)
* [Google Cloud Console Project](https://console.cloud.google.com/) (for Google OAuth Client ID)

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/SumitKundu102022/EduTest](https://github.com/SumitKundu102022/EduTest) # Replace with your repo URL
    cd edutest-app/edutest_backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create `.env` file:**
    In the `edutest_backend` directory, create a file named `.env` and add your environment variables:
    ```env
    NODE_ENV=development
    PORT=5000
    MONGO_URI=your_mongodb_atlas_connection_string 
    JWT_SECRET=a_very_strong_random_secret_key_for_jwt
    GOOGLE_CLIENT_ID=your_google_web_client_id_from_google_cloud_console
    FRONTEND_URL=http://localhost:5173 # Or your frontend's local dev URL
    ```
    * **`MONGO_URI`**: Get this from your MongoDB Atlas cluster. Remember to replace `<username>`, `<password>`, and `<dbname>`.
    * **`JWT_SECRET`**: Generate a long, random string. You can use `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` in your terminal.
    * **`GOOGLE_CLIENT_ID`**: Obtain this from your Google Cloud Console (OAuth 2.0 Client IDs, Web application type). Ensure `http://localhost:5173` (or your frontend's local URL) is listed in "Authorized JavaScript origins" and "Authorized redirect URIs".
4.  **Run the backend:**
    ```bash
    npm run server # Or 'npm start' if you prefer
    ```
    The server will start on `http://localhost:5000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../edutest_frontend # Assuming it's in a sibling directory
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create `.env.local` file:**
    In the `edutest_frontend` directory, create a file named `.env.local` and add your environment variables:
    ```env
    VITE_GOOGLE_CLIENT_ID=your_google_web_client_id_from_google_cloud_console
    VITE_API_BASE_URL=http://localhost:5000/api # Points to your local backend
    ```
    * **`VITE_GOOGLE_CLIENT_ID`**: This must be the *same* client ID as used in your backend's `.env` file.
4.  **Run the frontend:**
    ```bash
    npm run dev
    ```
    The frontend will typically start on `http://localhost:5173`.

---

## 🌐 Deployment

EduTest is designed for easy deployment to cloud platforms. The recommended platform is [Render.com](https://render.com/).

### Backend Deployment (Render)

1.  Push your `edutest_backend` folder to a Git repository.
2.  Create a new Web Service on Render.
3.  Point Render to your backend repository and set the `Root Directory` to `edutest_backend` if it's not the repo root.
4.  Configure `Build Command` as `npm install` and `Start Command` as `npm start`.
5.  **Crucially, add all your backend environment variables** (e.g., `MONGO_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `FRONTEND_URL`) directly in Render's environment settings for the service.
    * For `FRONTEND_URL`, use the deployed URL of your frontend (e.g., `https://your-frontend-app.onrender.com`).

### Frontend Deployment (Render, Vercel, Netlify, etc.)

1.  Push your `edutest_frontend` folder to a Git repository.
2.  Create a new Static Site or Web Service on your chosen platform.
3.  Point the platform to your frontend repository and set the `Root Directory` to `edutest_frontend` if necessary.
4.  **Add your frontend environment variables** (`VITE_GOOGLE_CLIENT_ID`, `VITE_API_BASE_URL`) in the platform's environment settings.
    * For `VITE_API_BASE_URL`, use the deployed URL of your backend (e.g., `https://your-backend-api.onrender.com/api`).
5.  **Update Google Cloud Console:** After deploying your frontend, remember to add its deployed URL (e.g., `https://your-frontend-app.onrender.com`) to the "Authorized JavaScript origins" and "Authorized redirect URIs" in your Google Cloud Console OAuth client ID settings.

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
5.  Push to the branch (`git push origin feature/AmazingFeature`).
6.  Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Project GitHub Link: [LINK](https://github.com/SumitKundu102022/EduTest) <!-- Replace with your actual project link -->
Project LIVE Link: [LINK](https://edu-test-live.vercel.app/) <!-- Replace with your actual project link -->

