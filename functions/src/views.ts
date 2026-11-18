import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import type {
  AvailabilityRuleView,
  BookingView,
  ProviderConfigView,
  ProviderSummaryView,
  ServiceConfigView,
  ServiceView,
  StaffConfigView,
  StaffView,
} from '@walkin/shared';
import type {
  AvailabilityRuleDoc,
  BookingDoc,
  ProviderDoc,
  ServiceDoc,
  StaffDoc,
} from './types.js';

export function readDoc<T>(snapshot: QueryDocumentSnapshot): T & { id: string } {
  return { ...(snapshot.data() as T), id: snapshot.id };
}

function iso(value: { toDate: () => Date } | null): string | null {
  return value ? value.toDate().toISOString() : null;
}

export function bookingToView(doc: BookingDoc): BookingView {
  return {
    id: doc.id,
    providerId: doc.providerId,
    serviceId: doc.serviceId,
    staffId: doc.staffId,
    customerId: doc.customerId,
    startUtc: doc.startUtc.toDate().toISOString(),
    endUtc: doc.endUtc.toDate().toISOString(),
    providerTimeZone: doc.providerTimeZone,
    status: doc.status,
    confirmationMode: doc.confirmationMode,
    priceSnapshot: {
      amountCents: doc.priceSnapshot.amountCents,
      currency: doc.priceSnapshot.currency,
      serviceName: doc.priceSnapshot.serviceName,
      durationMinutes: doc.priceSnapshot.durationMinutes,
    },
    holdExpiresAt: iso(doc.holdExpiresAt),
    customerNote: doc.customerNote,
    source: doc.source,
    createdAt: doc.createdAt.toDate().toISOString(),
    updatedAt: doc.updatedAt.toDate().toISOString(),
  };
}

export function providerToSummary(doc: ProviderDoc): ProviderSummaryView {
  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    logoUrl: doc.logoUrl,
    timeZone: doc.timeZone,
    city: doc.address?.city,
  };
}

export function providerToConfig(doc: ProviderDoc): ProviderConfigView {
  return {
    id: doc.id,
    ownerId: doc.ownerId,
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    logoUrl: doc.logoUrl,
    address: doc.address,
    timeZone: doc.timeZone,
    status: doc.status,
    bookingPolicy: doc.bookingPolicy,
  };
}

export function serviceToView(doc: ServiceDoc): ServiceView {
  return {
    id: doc.id,
    providerId: doc.providerId,
    name: doc.name,
    description: doc.description,
    durationMinutes: doc.durationMinutes,
    price: doc.price,
    confirmationMode: doc.confirmationMode,
    capacityScope: doc.capacityScope,
    staffIds: doc.staffIds,
    active: doc.active,
    imageUrl: doc.imageUrl,
  };
}

export function serviceToConfigView(doc: ServiceDoc): ServiceConfigView {
  return {
    ...serviceToView(doc),
    bufferBeforeMinutes: doc.bufferBeforeMinutes,
    bufferAfterMinutes: doc.bufferAfterMinutes,
  };
}

export function staffToView(doc: StaffDoc): StaffView {
  return {
    id: doc.id,
    providerId: doc.providerId,
    name: doc.name,
    photoUrl: doc.photoUrl,
    active: doc.active,
    serviceIds: doc.serviceIds,
  };
}

export function staffToConfigView(doc: StaffDoc): StaffConfigView {
  return {
    ...staffToView(doc),
    userId: doc.userId,
    concurrentSlots: doc.concurrentSlots,
  };
}

export function availabilityToView(doc: AvailabilityRuleDoc & { id: string; providerId: string }): AvailabilityRuleView {
  return {
    id: doc.id,
    providerId: doc.providerId,
    kind: doc.kind,
    staffId: doc.staffId,
    dayOfWeek: doc.dayOfWeek,
    startLocal: doc.startLocal,
    endLocal: doc.endLocal,
    date: doc.date,
    intervals: doc.intervals,
    reason: doc.reason,
  };
}
