// Security summary : auth calls rely on secure cookies and server checks,
// so the frontend only sends credentials and never stores tokens locally.
import { axiosInstance } from '@/lib/axios';

export async function login(email: string, password: string) {
  const response = await axiosInstance.post('/api/auth/login', { email, password });
  return response.data;
}

export async function register(email: string, password: string) {
  const response = await axiosInstance.post('/api/auth/register', { email, password });
  return response.data;
}

export async function verifyMfa(code: string) {
  const response = await axiosInstance.post('/api/auth/mfa/verify', { code });
  return response.data;
}

export async function logout() {
  const response = await axiosInstance.post('/api/auth/logout');
  return response.data;
}

export async function fetchMe() {
  const response = await axiosInstance.get('/api/auth/me');
  return response.data;
}

export async function fetchProfile() {
  const response = await axiosInstance.get('/api/users/me');
  return response.data;
}

export async function updateProfile(payload: {
  name?: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  address?: string;
}) {
  const response = await axiosInstance.put('/api/users/me', payload);
  return response.data;
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const response = await axiosInstance.post('/api/auth/password', { currentPassword, newPassword });
  return response.data;
}

export async function setupMfa() {
  const response = await axiosInstance.post('/api/auth/mfa/setup');
  return response.data;
}

export async function verifyMfaSetup(code: string) {
  const response = await axiosInstance.post('/api/auth/mfa/verify-setup', { code });
  return response.data;
}

export async function disableMfa(password: string) {
  const response = await axiosInstance.post('/api/auth/mfa/disable', { password });
  return response.data;
}
