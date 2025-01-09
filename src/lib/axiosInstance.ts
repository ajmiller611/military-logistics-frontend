// Placeholder for Axios configuration
// This will contain the Axios instance setup with interceptors and base URL

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '', // Placeholder: Add API base URL here
  withCredentials: true,
});

// Interceptors, Authorization headers, etc. will be added here later.

export default axiosInstance;
