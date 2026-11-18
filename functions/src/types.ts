import type { Timestamp } from 'firebase-admin/firestore';
import type {
  Address,
  AvailabilityRuleView,
  BookingPolicy,
  BookingSource,
  BookingStatus,
  CapacityScope,
  ConfirmationMode,
  Money,
  ProviderStatus,
  StaffRole,
} from '@walkin/shared';

export interface ProviderDoc {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string;
  logoUrl?: string;
  address?: Address;
  timeZone: string;
  status: ProviderStatus;
  bookingPolicy: BookingPolicy;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ServiceDoc {
  id: string;
  providerId: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: Money;
  confirmationMode: ConfirmationMode;
  capacityScope: CapacityScope;
  staffIds: string[];
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  active: boolean;
  imageUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface StaffDoc {
  id: string;
  providerId: string;
  name: string;
  userId?: string;
  photoUrl?: string;
  active: boolean;
  serviceIds: string[];
  concurrentSlots: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type AvailabilityRuleDoc = Omit<AvailabilityRuleView, 'id' | 'providerId'> & {
  effectiveFrom?: Timestamp | null;
  effectiveUntil?: Timestamp | null;
};

export interface BookingDoc {
  id: string;
  providerId: string;
  serviceId: string;
  staffId: string | null;
  customerId: string;
  startUtc: Timestamp;
  endUtc: Timestamp;
  providerTimeZone: string;
  slotKeys: string[];
  status: BookingStatus;
  confirmationMode: ConfirmationMode;
  priceSnapshot: Money & { serviceName: string; durationMinutes: number };
  holdExpiresAt: Timestamp | null;
  customerNote?: string;
  source: BookingSource;
  reminder24hSent?: boolean;
  reminder1hSent?: boolean;
  cancelledAt?: Timestamp | null;
  cancellationReason?: string;
  timeline: Array<{ status: BookingStatus | 'created'; at: Timestamp; actor: string }>;
  idempotencyKey: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SlotLockDoc {
  lockId: string;
  staffKey: string;
  cellUtc: Timestamp;
  capacity: number;
  occupied: number;
  updatedAt: Timestamp;
}

export interface UserDoc {
  uid: string;
  displayName: string;
  email: string;
  phone?: string;
  photoURL?: string;
  fcmTokens?: Record<string, { platform: 'web' | 'ios' | 'android'; updatedAt: Timestamp }>;
  /** Set by Cloud Functions via Admin SDK, never by clients. */
  providerId?: string;
  /** Set by Cloud Functions via Admin SDK, never by clients. */
  role?: StaffRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
