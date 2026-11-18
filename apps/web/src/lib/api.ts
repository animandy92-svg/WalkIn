import { httpsCallable } from 'firebase/functions';
import type {
  CancelBookingRequest,
  CancelBookingResponse,
  CreateBookingRequest,
  CreateBookingResponse,
  GetAvailabilityRequest,
  GetAvailabilityResponse,
  GetMyBookingsResponse,
  GetProviderDetailsRequest,
  GetProviderDetailsResponse,
  ListPublishedProvidersResponse,
  RescheduleBookingRequest,
  RescheduleBookingResponse,
} from '@walkin/shared';
import { functions } from './firebase';

export class ApiError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

async function callApi<TRequest, TResponse>(name: string, data: TRequest): Promise<TResponse> {
  const callable = httpsCallable<TRequest, TResponse>(functions, name);
  try {
    const result = await callable(data);
    return result.data;
  } catch (error) {
    const err = error as {
      code?: string;
      message?: string;
      details?: { code?: string };
    };
    throw new ApiError(err.details?.code ?? err.code ?? 'INTERNAL', err.message ?? 'Request failed');
  }
}

export const api = {
  listPublishedProviders: () =>
    callApi<Record<string, never>, ListPublishedProvidersResponse>('listPublishedProviders', {}),

  getProviderDetails: (request: GetProviderDetailsRequest) =>
    callApi<GetProviderDetailsRequest, GetProviderDetailsResponse>('getProviderDetails', request),

  getMyBookings: () =>
    callApi<Record<string, never>, GetMyBookingsResponse>('getMyBookings', {}),

  getAvailability: (request: GetAvailabilityRequest) =>
    callApi<GetAvailabilityRequest, GetAvailabilityResponse>('getAvailability', request),

  createBooking: (request: CreateBookingRequest) =>
    callApi<CreateBookingRequest, CreateBookingResponse>('createBooking', request),

  cancelBooking: (request: CancelBookingRequest) =>
    callApi<CancelBookingRequest, CancelBookingResponse>('cancelBooking', request),

  rescheduleBooking: (request: RescheduleBookingRequest) =>
    callApi<RescheduleBookingRequest, RescheduleBookingResponse>('rescheduleBooking', request),
};
