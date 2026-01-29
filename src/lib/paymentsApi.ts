import { axiosInstance } from '@/lib/axios';

export async function createPaymentIntent(amount: number, currency = 'usd') {
  const response = await axiosInstance.post('/api/payments/create-intent', {
    amount,
    currency,
  });
  return response.data;
}
