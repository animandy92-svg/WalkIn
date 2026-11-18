import { z } from 'zod';

/** ISO-8601 timestamp with an explicit zone (e.g. 2026-11-20T10:00:00Z). */
export const isoDateTime = z.string().datetime({ offset: true });
export const localTime = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Expected HH:mm');
export const localDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');

export const confirmationModeSchema = z.enum(['instant', 'approval']);
export const bookingStatusSchema = z.enum([
  'pending',
  'confirmed',
  'rejected',
  'expired',
  'cancelled',
  'completed',
]);
export const providerStatusSchema = z.enum(['draft', 'published']);
export const staffRoleSchema = z.enum(['owner', 'staff', 'admin']);
export const bookingSourceSchema = z.enum(['web', 'mobile']);
export const capacityScopeSchema = z.enum(['staff', 'provider']);
export const platformSchema = z.enum(['web', 'ios', 'android']);

export const errorCodeSchema = z.enum([
  'SLOT_UNAVAILABLE',
  'INVALID_TIME',
  'NOT_FOUND',
  'POLICY_VIOLATION',
  'STAFF_NOT_ELIGIBLE',
  'HOLD_EXPIRED',
  'UNAUTHENTICATED',
  'PERMISSION_DENIED',
  'INVALID_ARGUMENT',
  'INTERNAL',
]);

// ---------- Value objects ----------

export const moneySchema = z.object({
  amountCents: z.number().int().nonnegative(),
  currency: z.string().length(3).toUpperCase(),
});

export const priceSnapshotSchema = moneySchema.extend({
  serviceName: z.string().min(1),
  durationMinutes: z.number().int().positive(),
});

export const addressSchema = z.object({
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  region: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(2),
});

export const bookingPolicySchema = z.object({
  leadTimeMinutes: z.number().int().nonnegative(),
  cancelCutoffHours: z.number().int().nonnegative(),
  rescheduleCutoffHours: z.number().int().nonnegative(),
  pendingHoldMinutes: z.number().int().positive(),
  defaultConcurrentSlots: z.number().int().positive(),
});

// ---------- Client-facing views ----------

export const providerSummaryViewSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  logoUrl: z.string().url().optional(),
  timeZone: z.string().min(1),
  city: z.string().optional(),
});

export const serviceViewSchema = z.object({
  id: z.string().min(1),
  providerId: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  durationMinutes: z.number().int().positive(),
  price: moneySchema,
  confirmationMode: confirmationModeSchema,
  capacityScope: capacityScopeSchema,
  active: z.boolean(),
  imageUrl: z.string().url().optional(),
});

export const staffViewSchema = z.object({
  id: z.string().min(1),
  providerId: z.string().min(1),
  name: z.string().min(1),
  photoUrl: z.string().url().optional(),
  active: z.boolean(),
  serviceIds: z.array(z.string()),
});

export const availabilityRuleViewSchema = z.object({
  id: z.string().min(1),
  providerId: z.string().min(1),
  kind: z.enum(['weekly', 'exception']),
  staffId: z.string().optional(),
  dayOfWeek: z.number().int().min(0).max(6).optional(),
  startLocal: localTime.optional(),
  endLocal: localTime.optional(),
  date: localDate.optional(),
  intervals: z.array(z.object({ startLocal: localTime, endLocal: localTime })).optional(),
  reason: z.string().optional(),
});

export const slotViewSchema = z.object({
  startUtc: isoDateTime,
  endUtc: isoDateTime,
  localLabel: z.string().min(1),
  staffId: z.string().nullable(),
  remaining: z.number().int().nonnegative(),
  capacity: z.number().int().positive(),
});

export const bookingViewSchema = z.object({
  id: z.string().min(1),
  providerId: z.string().min(1),
  serviceId: z.string().min(1),
  staffId: z.string().nullable(),
  customerId: z.string().min(1),
  startUtc: isoDateTime,
  endUtc: isoDateTime,
  providerTimeZone: z.string().min(1),
  status: bookingStatusSchema,
  confirmationMode: confirmationModeSchema,
  priceSnapshot: priceSnapshotSchema,
  holdExpiresAt: isoDateTime.nullable(),
  customerNote: z.string().optional(),
  source: bookingSourceSchema,
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});

// ---------- Callable API ----------

export const getAvailabilityRequestSchema = z.object({
  providerId: z.string().min(1),
  serviceId: z.string().min(1),
  staffId: z.string().optional(),
  // Supply either a provider-local date or an explicit UTC range.
  date: localDate.optional(),
  from: isoDateTime.optional(),
  to: isoDateTime.optional(),
});

export const getAvailabilityResponseSchema = z.object({
  slots: z.array(slotViewSchema),
});

export const createBookingRequestSchema = z.object({
  providerId: z.string().min(1),
  serviceId: z.string().min(1),
  staffId: z.string().optional(),
  startUtc: isoDateTime,
  idempotencyKey: z.string().min(8).max(128),
  note: z.string().max(1000).optional(),
  source: bookingSourceSchema,
});

export const createBookingResponseSchema = z.object({
  booking: bookingViewSchema,
});

export const cancelBookingRequestSchema = z.object({
  bookingId: z.string().min(1),
  reason: z.string().max(500).optional(),
});

export const cancelBookingResponseSchema = z.object({
  booking: bookingViewSchema,
});

export const rescheduleBookingRequestSchema = z.object({
  bookingId: z.string().min(1),
  startUtc: isoDateTime,
  idempotencyKey: z.string().min(8).max(128),
});

export const rescheduleBookingResponseSchema = z.object({
  booking: bookingViewSchema,
});

export const respondToBookingRequestSchema = z.object({
  bookingId: z.string().min(1),
  action: z.enum(['confirm', 'reject']),
});

export const respondToBookingResponseSchema = z.object({
  booking: bookingViewSchema,
});

export const saveProviderRequestSchema = z.object({
  providerId: z.string().min(1).optional(),
  name: z.string().min(1).max(120),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Expected a URL-safe slug'),
  description: z.string().max(4000),
  timeZone: z.string().min(1),
  logoUrl: z.string().url().optional(),
  address: addressSchema.optional(),
  status: providerStatusSchema,
  bookingPolicy: bookingPolicySchema,
});

export const saveServiceRequestSchema = z.object({
  providerId: z.string().min(1),
  serviceId: z.string().min(1).optional(),
  name: z.string().min(1).max(120),
  description: z.string().max(4000),
  durationMinutes: z.number().int().positive(),
  price: moneySchema,
  confirmationMode: confirmationModeSchema,
  capacityScope: capacityScopeSchema,
  staffIds: z.array(z.string()).min(1),
  bufferBeforeMinutes: z.number().int().nonnegative().default(0),
  bufferAfterMinutes: z.number().int().nonnegative().default(0),
  active: z.boolean().default(true),
  imageUrl: z.string().url().optional(),
});

export const saveStaffRequestSchema = z.object({
  providerId: z.string().min(1),
  staffId: z.string().min(1).optional(),
  name: z.string().min(1).max(120),
  userId: z.string().optional(),
  photoUrl: z.string().url().optional(),
  active: z.boolean().default(true),
  serviceIds: z.array(z.string()).default([]),
  concurrentSlots: z.number().int().positive().default(1),
});

export const saveAvailabilityRequestSchema = z.object({
  providerId: z.string().min(1),
  ruleId: z.string().min(1).optional(),
  kind: z.enum(['weekly', 'exception']),
  staffId: z.string().optional(),
  dayOfWeek: z.number().int().min(0).max(6).optional(),
  startLocal: localTime.optional(),
  endLocal: localTime.optional(),
  date: localDate.optional(),
  intervals: z.array(z.object({ startLocal: localTime, endLocal: localTime })).optional(),
  reason: z.string().max(500).optional(),
});

export const savedEntityResponseSchema = z.object({
  id: z.string().min(1),
});

export const listPublishedProvidersResponseSchema = z.object({
  providers: z.array(providerSummaryViewSchema),
});

export const getProviderDetailsRequestSchema = z.object({
  slug: z.string().min(1).optional(),
  providerId: z.string().min(1).optional(),
});

export const getProviderDetailsResponseSchema = z.object({
  provider: providerSummaryViewSchema,
  services: z.array(serviceViewSchema),
  staff: z.array(staffViewSchema),
});

export const getMyBookingsResponseSchema = z.object({
  bookings: z.array(bookingViewSchema),
});

export const registerFcmTokenRequestSchema = z.object({
  token: z.string().min(1),
  platform: platformSchema,
});

export const removeFcmTokenRequestSchema = z.object({
  token: z.string().min(1),
});

export const emptyResponseSchema = z.object({});
