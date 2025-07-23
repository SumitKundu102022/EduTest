// src/lib/api.js (or similar file where your Axios/Fetch instance is configured)
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // Adjust to your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Add Authorization token to every request
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("eduTestUser")); // Assuming user object is stored here
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors, especially 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the error is an HTTP response and has a status
    if (error.response) {
      // If 401 Unauthorized, it means the token is invalid or expired
      if (error.response.status === 401) {
        console.error('Authentication error: Token expired or invalid');
        //toast.error('Your session has expired. Please log in again.');

        // Clear user data from local storage
        localStorage.removeItem("eduTestUser");

        // Redirect to login page
        // Use window.location.href or a programmatic navigation from your router
        // For React Router v6:
        // You'll need to pass the navigate function or use a custom hook/context
        // For simplicity, using window.location.href here, but a router-based
        // navigation is generally preferred in React apps.
        // window.location.href = '/login'; // Adjust your login route as necessary
      }
      // You can add more specific error handling here for other status codes
      // For example, 403 Forbidden, 404 Not Found, 500 Server Error
    }
    return Promise.reject(error); // Re-throw the error so it can be caught by the calling component
  }
);

export default api;




// // src/lib/api.js
// import axios from "axios";

// // Create an Axios instance with a base URL for your backend
// // Ensure this matches the port your backend is running on (e.g., 5000)
// const api = axios.create({
//   baseURL: "http://localhost:5000/api", // IMPORTANT: Change this if your backend runs on a different port or URL
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// /**
//  * Axios Request Interceptor:
//  * This interceptor will run before every request made using this 'api' instance.
//  * It checks if a JWT token exists in localStorage (from user login).
//  * If a token is found, it adds an 'Authorization' header with the Bearer token.
//  * This is crucial for protected routes on your backend.
//  */
// api.interceptors.request.use(
//   (config) => {
//     try {
//       const user = JSON.parse(localStorage.getItem("eduTestUser"));
//       if (user && user.token) {
//         config.headers.Authorization = `Bearer ${user.token}`;
//       }
//     } catch (error) {
//       console.error("Failed to parse user from localStorage:", error);
//       // Optionally, handle corrupted localStorage data (e.g., clear it)
//       localStorage.removeItem("eduTestUser");
//     }
//     return config;
//   },
//   (error) => {
//     // Do something with request error
//     return Promise.reject(error);
//   }
// );

// /**
//  * Axios Response Interceptor (Optional but Recommended for Error Handling):
//  * This interceptor can be used to globally handle API errors,
//  * such as redirecting to login on 401 Unauthorized responses.
//  */
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // If the error response is 401 Unauthorized, it might mean the token is expired or invalid.
//     // You might want to automatically log out the user here.
//     if (error.response && error.response.status === 401) {
//       console.error(
//         "API Error 401: Unauthorized. Token might be invalid or expired."
//       );
//       // You could dispatch a logout action here if using a state management library
//       // For now, we'll just let the component-level error handling manage it.
//       // Or, if you want a hard logout:
//       // localStorage.removeItem('eduTestUser');
//       // window.location.href = '/login'; // Force redirect
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;