// Security summary (student note): this client uses httpOnly cookies and CSRF headers
// so tokens are not stored in localStorage and state-changing requests are protected.
import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let csrfToken: string | null = null;

export async function ensureCsrfToken() {
  if (!csrfToken) {
    const response = await axiosInstance.get('/api/auth/csrf');
    csrfToken = response.data?.csrfToken ?? null;
  }
  return csrfToken;
}

axiosInstance.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();
  if (method && ['post', 'put', 'patch', 'delete'].includes(method)) {
    const token = await ensureCsrfToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers['X-CSRF-Token'] = token;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 403) {
      csrfToken = null;
    }
    return Promise.reject(error);
  }
);
