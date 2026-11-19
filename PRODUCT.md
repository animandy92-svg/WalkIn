# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Customers (primary):** students and staff at a university campus in Ghana. They book campus-area
  barbers, salons, laundry drop-offs and print jobs, mostly from a phone. The specific campus is not
  decided yet.
- **Providers:** owners and staff of those campus-area shops. They manage services, hours, staff and
  capacity, and confirm or reject requests that need review.

Working hypotheses (inferred, not confirmed): customers book between lectures and from hostels;
demand peaks before assignment deadlines (printing), at weekends (laundry) and before events
(barber/salon).

## Product Purpose

WalkIn lets customers find local service providers, reserve a time or service window before
arriving, and manage the booking on web or mobile. Providers run one dashboard for services,
capacity, hours, staff and incoming work. Success for the first release is trustworthy completion:
a booked slot is real, and the shop sees and processes it.

## Positioning

Reserve before you walk in, at shops that are not alike. A haircut is a timed appointment, laundry is
a drop-off window, printing is a job that may need review. One platform treats them as different
workflows, not one generic appointment form. Capacity is server-authoritative: concurrent requests
can never exceed what a shop configured, so a held slot is never double-booked.

## Operating Context

- Customers browse shops, pick a service, choose from open slots in the shop's own time zone, and
  book. Instant services confirm immediately; approval services hold the slot as `pending` until the
  shop confirms or the hold expires.
- Customers can cancel or reschedule within each shop's cutoff policy.
- Providers work a pending-approval queue, a day/week calendar, and editors for services, hours,
  staff and shop settings/policy.
- Web push notifications for booking changes once the customer enables them.

## Capabilities and Constraints

- Backend: Firebase Auth, Firestore, callable Cloud Functions (see `docs/api.md`). All booking writes
  go through functions; clients never write bookings directly.
- Service types in the schema: `appointment`, `drop_off`, `print_job`, `queue_ticket`. Verticals:
  barbershop, salon, laundry, printing, general. Print-job and laundry intake fields exist in the
  schema; their end-to-end workflow is still in progress (roadmap Phase 0/3).
- Currency for the launch market: Ghana cedi (GHS, shown as GH₵). Time zone: Africa/Accra.
- Not built and must not be implied: payments, ratings/reviews, maps/location search, chat with the
  provider, delivery.
- Undecided: the specific campus, which categories launch first, provider verification, payment
  timing, refund/dispute rules.

## Brand Commitments

- Name: WalkIn. An existing icon lives at `apps/web/public/icons/walkin-icon.svg`; no other brand
  assets, voice guide or palette are committed.

## Evidence on Hand

- No real providers, customers, photos, testimonials or usage numbers exist. All demo shops,
  services and people are synthetic and must be labelled as demo data wherever a visitor could
  mistake them for real.

## Product Principles

1. Trustworthy completion beats feature count: every screen makes the booking's true state obvious.
2. Different shops, different workflows: never flatten a print job or laundry drop-off into a haircut form.
3. The server is the truth: never show a slot as the customer's until the backend says so.
4. Built for a phone in a hurry: the path from "I need this" to "it's held" is short and legible.
