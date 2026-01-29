import { axiosInstance } from '@/lib/axios';

export async function fetchBeers() {
  try {
    const response = await axiosInstance.get('/api/beers');
    return response.data.map((beer: any) => ({
      ...beer,
      id: beer.id || beer._id,
    }));
  } catch (error) {
    console.error('Error fetching beers:', error);
    throw new Error('Failed to fetch beers');
  }
}

export async function fetchBeerById(id: string) {
  try {
    const response = await axiosInstance.get(`/api/beers/${id}`);
    const beer = response.data;
    return { ...beer, id: beer.id || beer._id };
  } catch (error) {
    console.error('Error fetching beer:', error);
    throw new Error('Failed to fetch beer');
  }
}
