import axios from 'axios';
import { API_ENDPOINT } from '@/config/env';

export const Axios = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
Axios.interceptors.request.use(
  async function rel(config) {
    return config;
  },
  function rej(error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
Axios.interceptors.response.use(
  function rel(response) {
    return response;
  },
  function rej(error) {
    if (error.response) {
      return Promise.reject(error.response);
    }
    if (error.request) {
      return Promise.reject(error.request);
    }
    return Promise.reject(error.message);
  },
);

export class HttpClient {
  static async get(url, config) {
    const response = await Axios.get(url, config);
    return response.data;
  }

  static async post(url, data, options) {
    const response = await Axios.post(url, data, options);
    return response.data;
  }

  static async put(url, data, config) {
    const response = await Axios.put(url, data, config);
    return response.data;
  }

  static async delete(url, options) {
    const response = await Axios.delete(url, options);
    return response.data;
  }
}
