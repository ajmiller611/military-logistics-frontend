import axiosInstance from '@/lib/axiosInstance';
import axios from 'axios';
import { type User } from '@/types/User';

const apiEndpoint = '/users';

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
 * Fetch all users from the backend API.
 * Returns an array of LogisticsUser objects.
 * Throws an Error if the request fails.
 */
export async function fetchUsers(): Promise<User[]> {
  try {
    const res =
      await axiosInstance.get<ApiResponse<PagedResponse<User>>>(apiEndpoint);

    return res.data.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ??
        error.message ??
        'Failed to fetch users';

      throw new Error(message);
    }

    throw new Error('An unexpected error occurred');
  }
}

/**
 * Delete a user by ID.
 * Prompts the backend API for deletion.
 * Throws an Error if the request fails.
 */
export async function deleteUser(userId: number): Promise<void> {
  try {
    await axiosInstance.delete(`${apiEndpoint}/${userId}`);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ??
        error.message ??
        'Failed to delete user';

      throw new Error(message);
    }

    throw new Error('An unexpected error occurred');
  }
}
