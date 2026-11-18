import { type QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { onCall } from 'firebase-functions/v2/https';
import {
  deleteAvailabilityRuleRequestSchema,
  getProviderDashboardRequestSchema,
  getProviderDashboardResponseSchema,
  listProviderBookingsRequestSchema,
  listProviderBookingsResponseSchema,
  savedEntityResponseSchema,
} from '@walkin/shared';
import { writeAuditLog } from '../audit.js';
import { DomainError } from '../errors.js';
import { db, enforceAppCheck } from '../firebase.js';
import type {
  AvailabilityRuleDoc,
  BookingDoc,
  ProviderDoc,
  ServiceDoc,
  StaffDoc,
} from '../types.js';
import {
  availabilityToView,
  bookingToView,
  providerToConfig,
  readDoc,
  serviceToConfigView,
  staffToConfigView,
} from '../views.js';
import { parseRequest, requireProviderRole, toHttpsError } from './helpers.js';

const MAX_DASHBOARD_BOOKINGS = 500;

/**
 * Single provider-scoped read for the dashboard. All data is filtered by the
 * providerId custom claim, so a staff member can never read another provider's
 * configuration or bookings through this endpoint.
 */
export const getProviderDashboard = onCall({ enforceAppCheck }, async (request) => {
  try {
    const input = parseRequest(getProviderDashboardRequestSchema, request.data);
    requireProviderRole(request, input.providerId);

    const providerSnapshot = await db.collection('providers').doc(input.providerId).get();
    if (!providerSnapshot.exists) throw new DomainError('NOT_FOUND', 'Provider not found');
    const provider = readDoc<ProviderDoc>(providerSnapshot as QueryDocumentSnapshot);

    const [servicesSnapshot, staffSnapshot, availabilitySnapshot, bookingsSnapshot] = await Promise.all([
      providerSnapshot.ref.collection('services').get(),
      providerSnapshot.ref.collection('staff').get(),
      providerSnapshot.ref.collection('availability').get(),
      db.collection('bookings')
        .where('providerId', '==', input.providerId)
        .orderBy('startUtc', 'desc')
        .limit(MAX_DASHBOARD_BOOKINGS)
        .get(),
    ]);

    return getProviderDashboardResponseSchema.parse({
      provider: providerToConfig(provider),
      services: servicesSnapshot.docs.map((doc) => serviceToConfigView(readDoc<ServiceDoc>(doc))),
      staff: staffSnapshot.docs.map((doc) => staffToConfigView(readDoc<StaffDoc>(doc))),
      availability: availabilitySnapshot.docs.map((doc) =>
        availabilityToView({ ...readDoc<AvailabilityRuleDoc>(doc), providerId: input.providerId })),
      bookings: bookingsSnapshot.docs.map((doc) => bookingToView(readDoc<BookingDoc>(doc))),
    });
  } catch (error) {
    throw toHttpsError(error);
  }
});

export const listProviderBookings = onCall({ enforceAppCheck }, async (request) => {
  try {
    const input = parseRequest(listProviderBookingsRequestSchema, request.data);
    requireProviderRole(request, input.providerId);

    let query = db.collection('bookings')
      .where('providerId', '==', input.providerId)
      .orderBy('startUtc', 'asc');
    if (input.from) query = query.where('startUtc', '>=', new Date(input.from));
    if (input.to) query = query.where('startUtc', '<=', new Date(input.to));

    const snapshot = await query.limit(MAX_DASHBOARD_BOOKINGS).get();
    return listProviderBookingsResponseSchema.parse({
      bookings: snapshot.docs.map((doc) => bookingToView(readDoc<BookingDoc>(doc))),
    });
  } catch (error) {
    throw toHttpsError(error);
  }
});

export const deleteAvailabilityRule = onCall({ enforceAppCheck }, async (request) => {
  try {
    const input = parseRequest(deleteAvailabilityRuleRequestSchema, request.data);
    const actor = requireProviderRole(request, input.providerId, ['owner', 'admin']);

    const ref = db.collection('providers').doc(input.providerId).collection('availability').doc(input.ruleId);
    const snapshot = await ref.get();
    if (!snapshot.exists) throw new DomainError('NOT_FOUND', 'Availability rule not found');
    await ref.delete();
    await writeAuditLog({
      action: 'availability.deleted',
      resourceType: 'availability',
      resourceId: input.ruleId,
      actor,
      providerId: input.providerId,
    });

    return savedEntityResponseSchema.parse({ id: input.ruleId });
  } catch (error) {
    throw toHttpsError(error);
  }
});
