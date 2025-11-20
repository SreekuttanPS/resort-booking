// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Types
export interface BookingData {
  name: string;
  email: string;
  phone: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  message?: string;
}

export interface BookingResponse {
  _id: string;
  name: string;
  email: string;
  phone: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSuccessResponse<T> {
  status: 'success';
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  status: 'error';
  message: string;
  errors?: unknown;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.message || 'An error occurred',
      data.errors
    );
  }
  
  return data;
}

// API Methods
export const bookingAPI = {
  // Create a new booking
  async createBooking(bookingData: BookingData): Promise<ApiSuccessResponse<{ booking: BookingResponse }>> {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    
    return handleResponse<ApiSuccessResponse<{ booking: BookingResponse }>>(response);
  },

  // Get all bookings
  async getAllBookings(): Promise<ApiSuccessResponse<{ bookings: BookingResponse[]; count: number }>> {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return handleResponse<ApiSuccessResponse<{ bookings: BookingResponse[]; count: number }>>(response);
  },

  // Delete a booking
  async deleteBooking(id: string): Promise<ApiSuccessResponse<null>> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return handleResponse<ApiSuccessResponse<null>>(response);
  },
};

