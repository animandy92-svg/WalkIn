import { HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import type { z } from 'zod';
import type { FunctionErrorCode, StaffRole } from '@walkin/shared';
import { DomainError } from '../errors.js';

const httpsCodes: Record<FunctionErrorCode, 'failed-precondition' | 'invalid-argument' | 'not-found' | 'permission-denied' | 'unauthenticated' | 'internal'> = {
  SLOT_UNAVAILABLE: 'failed-precondition',
  INVALID_TIME: 'invalid-argument',
  NOT_FOUND: 'not-found',
  POLICY_VIOLATION: 'failed-precondition',
  STAFF_NOT_ELIGIBLE: 'permission-denied',
  HOLD_EXPIRED: 'failed-precondition',
  UNAUTHENTICATED: 'unauthenticated',
  PERMISSION_DENIED: 'permission-denied',
  INVALID_ARGUMENT: 'invalid-argument',
  INTERNAL: 'internal',
};

export function toHttpsError(error: unknown): HttpsError {
  if (error instanceof HttpsError) return error;

  if (error instanceof DomainError) {
    return new HttpsError(httpsCodes[error.code], error.message, { code: error.code });
  }

  console.error('Unhandled callable error', error);
  return new HttpsError('internal', 'Unexpected error', { code: 'INTERNAL' });
}

export function parseRequest<S extends z.ZodTypeAny>(schema: S, data: unknown): z.output<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new HttpsError('invalid-argument', 'Invalid request', {
      code: 'INVALID_ARGUMENT',
      issues: result.error.flatten(),
    });
  }
  return result.data;
}

export function requireUid(request: CallableRequest): string {
  if (!request.auth?.uid) {
    throw new HttpsError('unauthenticated', 'Sign in required', { code: 'UNAUTHENTICATED' });
  }
  return request.auth.uid;
}

export function requireProviderRole(
  request: CallableRequest,
  providerId: string,
  allowed: StaffRole[] = ['owner', 'staff', 'admin'],
): string {
  const uid = requireUid(request);
  const claims = request.auth!.token as { providerId?: string; role?: string };
  if (claims.providerId !== providerId || !claims.role || !allowed.includes(claims.role as StaffRole)) {
    throw new HttpsError('permission-denied', 'Provider access required', {
      code: 'PERMISSION_DENIED',
    });
  }
  return uid;
}

export function canReadBooking(request: CallableRequest, providerId: string, customerId: string): void {
  const uid = requireUid(request);
  const claims = request.auth!.token as { providerId?: string; role?: string };
  const isProviderStaff = claims.providerId === providerId
    && claims.role !== undefined
    && ['owner', 'staff', 'admin'].includes(claims.role);
  if (uid !== customerId && !isProviderStaff && claims.role !== 'admin') {
    throw new HttpsError('permission-denied', 'Not your booking', { code: 'PERMISSION_DENIED' });
  }
}
