// Security summary (student note): order endpoints are protected and require auth cookies,
// preventing unauthenticated checkout or order access.
import { axiosInstance } from '@/lib/axios';

export async function createOrderCheckout(items: { beerId: string; quantity: number }[]) {
  const response = await axiosInstance.post('/api/orders/checkout', { items });
  return response.data;
}

export async function confirmOrder(orderId: string, paymentIntentId?: string) {
  const response = await axiosInstance.post('/api/orders/confirm', { orderId, paymentIntentId });
  return response.data;
}

export async function fetchMyOrders() {
  const response = await axiosInstance.get('/api/orders/me');
  return response.data;
}
