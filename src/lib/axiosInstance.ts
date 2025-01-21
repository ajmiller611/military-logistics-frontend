// Placeholder for Axios configuration
// This will contain the Axios instance setup with interceptors and base URL

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptors, Authorization headers, etc. will be added here later.

export default axiosInstance;
