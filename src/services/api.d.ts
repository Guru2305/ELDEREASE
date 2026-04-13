// API service type definitions

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiService {
  baseURL: string;
  token: string | null;

  setToken(token: string): void;
  clearToken(): void;
  getHeaders(): Record<string, string>;
  request(endpoint: string, options?: RequestInit): Promise<ApiResponse>;
  get(endpoint: string): Promise<ApiResponse>;
  post(endpoint: string, data: any): Promise<ApiResponse>;
  put(endpoint: string, data: any): Promise<ApiResponse>;
  delete(endpoint: string): Promise<ApiResponse>;
}

export interface AuthAPI {
  register(userData: any): Promise<ApiResponse>;
  login(credentials: any): Promise<ApiResponse>;
  getProfile(): Promise<ApiResponse>;
  updateProfile(data: any): Promise<ApiResponse>;
}

export interface ElderAPI {
  getProfile(): Promise<ApiResponse>;
  updateProfile(data: any): Promise<ApiResponse>;
  getBookings(params?: any): Promise<ApiResponse>;
  getStats(): Promise<ApiResponse>;
}

export interface VolunteerAPI {
  getProfile(): Promise<ApiResponse>;
  updateProfile(data: any): Promise<ApiResponse>;
  updateOnlineStatus(data: any): Promise<ApiResponse>;
  getBookings(params?: any): Promise<ApiResponse>;
  getStats(): Promise<ApiResponse>;
  getNearbyBookings(params?: any): Promise<ApiResponse>;
  submitFeedback(bookingId: string, feedback: any): Promise<ApiResponse>;
}

export interface BookingAPI {
  create(bookingData: any): Promise<ApiResponse>;
  getAll(params?: any): Promise<ApiResponse>;
  getById(id: string): Promise<ApiResponse>;
  accept(id: string): Promise<ApiResponse>;
  reject(id: string): Promise<ApiResponse>;
  complete(id: string): Promise<ApiResponse>;
  cancel(id: string, reason: string): Promise<ApiResponse>;
  updateTracking(id: string, location: any): Promise<ApiResponse>;
  getAvailable(params?: any): Promise<ApiResponse>;
}

declare const api: ApiService;

export default api;
export const authAPI: AuthAPI;
export const elderAPI: ElderAPI;
export const volunteerAPI: VolunteerAPI;
export const bookingAPI: BookingAPI;
