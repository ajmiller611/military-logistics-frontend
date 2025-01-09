// Placeholder for SWR configuration
// This will include SWR fetcher and custom configurations

import useSWR, { SWRConfiguration } from 'swr';
import axiosInstance from '@/lib/axiosInstance';

// Fetcher for SWR
const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

// SWR configuration will be set up here when needed
export const swrConfig: SWRConfiguration = {
  fetcher,
  onError: (error) => {
    console.error('SWR Fetch Error:', error);
  },
};

export default useSWR;
