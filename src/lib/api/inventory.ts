import axiosInstance from '../axiosInstance';
import axios from 'axios';
import { Item } from '@/types/Item';

const apiEndpoint = '/inventory';

interface PagedResponse<T> {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  data: T[];
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

/**
 * Fetch all inventory items from the backend API.
 * Returns an array of Item objects.
 * Throws an Error if the request fails.
 */
export async function fetchItems(): Promise<Item[]> {
  try {
    const response =
      await axiosInstance.get<ApiResponse<PagedResponse<Item>>>(apiEndpoint);
    return response.data.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ??
        error.message ??
        'Failed to fetch inventory items';
      throw new Error(message);
    }
    throw new Error('An unexpected error occurred');
  }
}
