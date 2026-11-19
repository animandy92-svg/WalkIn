import type { BookingStatus, BusinessVertical, ServiceType, ServiceView } from '@walkin/shared';

/** Yellow is reserved for "yours" (your selection, your bookings); the other inks code shop types. */
export type Highlight = 'yellow' | 'pink' | 'green' | 'orange' | 'blue' | 'lilac';

export const VERTICALS: Record<BusinessVertical, {
  label: string;
  plural: string;
  highlight: Highlight;
  /** What the customer is reserving, in the shop's own terms. */
  noun: string;
}> = {
  barbershop: { label: 'Barber', plural: 'Barbers', highlight: 'blue', noun: 'chair time' },
  salon: { label: 'Salon', plural: 'Salons', highlight: 'pink', noun: 'appointment' },
  laundry: { label: 'Laundry', plural: 'Laundry', highlight: 'green', noun: 'drop-off window' },
  printing: { label: 'Printing', plural: 'Printing', highlight: 'orange', noun: 'print job' },
  general: { label: 'Other', plural: 'Other', highlight: 'lilac', noun: 'appointment' },
};

export const VERTICAL_ORDER: BusinessVertical[] = ['barbershop', 'salon', 'laundry', 'printing', 'general'];

export const SERVICE_TYPES: Record<ServiceType, { label: string; action: string }> = {
  appointment: { label: 'Appointment', action: 'Book this time' },
  drop_off: { label: 'Drop-off window', action: 'Book this drop-off' },
  print_job: { label: 'Print job', action: 'Send this print job' },
  queue_ticket: { label: 'Queue ticket', action: 'Take this ticket' },
};

export type StampInk = 'blue' | 'violet' | 'red' | 'green' | 'black';

export const STATUS: Record<BookingStatus, { stamp: string; ink: StampInk; plain: string }> = {
  pending: { stamp: 'Received', ink: 'blue', plain: 'Waiting for the shop to approve' },
  confirmed: { stamp: 'Confirmed', ink: 'violet', plain: 'Confirmed by the shop' },
  in_progress: { stamp: 'In progress', ink: 'violet', plain: 'The shop is working on it' },
  ready_for_pickup: { stamp: 'Ready', ink: 'green', plain: 'Ready for pickup' },
  rejected: { stamp: 'Declined', ink: 'red', plain: 'The shop declined this request' },
  expired: { stamp: 'Expired', ink: 'red', plain: 'The shop did not answer in time' },
  cancelled: { stamp: 'Cancelled', ink: 'red', plain: 'Cancelled' },
  completed: { stamp: 'Done', ink: 'black', plain: 'Completed' },
};

export const ACTIVE_STATUSES: BookingStatus[] = ['pending', 'confirmed', 'in_progress', 'ready_for_pickup'];

/** The service a shop's row on the board represents. */
export function leadService(vertical: BusinessVertical, services: ServiceView[]): ServiceView | undefined {
  const keywords: Record<BusinessVertical, RegExp> = {
    barbershop: /hair ?cut/i,
    salon: /wash|manicure|cornrow/i,
    laundry: /wash/i,
    printing: /black|b&w|print/i,
    general: /./,
  };
  const active = services.filter((service) => service.active);
  // Of the services that match, the cheapest is the everyday one (Haircut over Haircut + shave).
  const matches = active
    .filter((service) => keywords[vertical].test(service.name))
    .sort((a, b) => a.price.amountCents - b.price.amountCents);
  return matches[0] ?? active[0];
}

export function serviceTypeOf(service: ServiceView, vertical: BusinessVertical): ServiceType {
  if (service.serviceType && service.serviceType !== 'appointment') return service.serviceType;
  if (vertical === 'printing') return 'print_job';
  if (vertical === 'laundry') return 'drop_off';
  return service.serviceType ?? 'appointment';
}
