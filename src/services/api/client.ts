import { API_CONFIG } from './config';
import { APIError } from './errors';

export async function apiClient<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new APIError(
        `Request failed: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    if (data.error) {
      throw new APIError(data.error, response.status, data.details);
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Network error');
  }
}