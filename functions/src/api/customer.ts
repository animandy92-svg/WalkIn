import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { onCall } from 'firebase-functions/v2/https';
import {
  getMyBookingsResponseSchema,
  getProviderDetailsRequestSchema,
  getProviderDetailsResponseSchema,
  listPublishedProvidersResponseSchema,
} from '@walkin/shared';
import { DomainError } from '../errors.js';
import { db, enforceAppCheck } from '../firebase.js';
import type { BookingDoc, ProviderDoc, ServiceDoc, StaffDoc } from '../types.js';
import { bookingToView, providerToSummary, readDoc, serviceToView, staffToView } from '../views.js';
import { parseRequest, requireUid, toHttpsError } from './helpers.js';

export const listPublishedProviders = onCall({ enforceAppCheck }, async (request) => {
  try {
    requireUid(request);
    const snapshot = await db
      .collection('providers')
      .where('status', '==', 'published')
      .orderBy('name', 'asc')
      .limit(100)
      .get();

    return listPublishedProvidersResponseSchema.parse({
      providers: snapshot.docs.map((doc) => providerToSummary(readDoc<ProviderDoc>(doc))),
    });
  } catch (error) {
    throw toHttpsError(error);
  }
});

export const getProviderDetails = onCall({ enforceAppCheck }, async (request) => {
  try {
    requireUid(request);
    const input = parseRequest(getProviderDetailsRequestSchema, request.data);
    if (!input.slug && !input.providerId) {
      throw new DomainError('INVALID_ARGUMENT', 'Provide a slug or providerId');
    }

    const providerRef = input.providerId
      ? db.collection('providers').doc(input.providerId)
      : null;
    const snapshot = input.slug
      ? await db.collection('providers').where('slug', '==', input.slug).limit(1).get()
      : null;
    const doc = providerRef
      ? await providerRef.get()
      : snapshot?.docs[0];
    if (!doc?.exists) throw new DomainError('NOT_FOUND', 'Provider not found');

    const provider = readDoc<ProviderDoc>(doc as QueryDocumentSnapshot);
    if (provider.status !== 'published') throw new DomainError('NOT_FOUND', 'Provider not found');

    const [servicesSnapshot, staffSnapshot] = await Promise.all([
      doc.ref.collection('services').where('active', '==', true).get(),
      doc.ref.collection('staff').where('active', '==', true).get(),
    ]);

    return getProviderDetailsResponseSchema.parse({
      provider: providerToSummary(provider),
      services: servicesSnapshot.docs.map((serviceDoc) => serviceToView(readDoc<ServiceDoc>(serviceDoc))),
      staff: staffSnapshot.docs.map((staffDoc) => staffToView(readDoc<StaffDoc>(staffDoc))),
    });
  } catch (error) {
    throw toHttpsError(error);
  }
});

export const getMyBookings = onCall({ enforceAppCheck }, async (request) => {
  try {
    const uid = requireUid(request);
    const snapshot = await db
      .collection('bookings')
      .where('customerId', '==', uid)
      .orderBy('startUtc', 'desc')
      .limit(100)
      .get();

    return getMyBookingsResponseSchema.parse({
      bookings: snapshot.docs.map((doc) => bookingToView(readDoc<BookingDoc>(doc))),
    });
  } catch (error) {
    throw toHttpsError(error);
  }
});
