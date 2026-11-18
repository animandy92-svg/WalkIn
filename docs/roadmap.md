# WalkIn Product Roadmap

## Product Goal

WalkIn lets customers find local service providers, reserve a time or service window before arriving, and manage the booking from the web or mobile app. Providers use one dashboard to manage services, capacity, hours, staff, and incoming work.

The initial categories are barbershops, salons, laundry, printing, and other local services. Treat these as different workflows on a shared platform, not as identical appointment forms: a haircut is usually a timed appointment, while laundry and custom printing may need item details, a drop-off or production window, provider review, and a later pickup status.

## Current Baseline

The repository already has substantial foundations: Next.js customer and provider experiences, a Flutter customer app, Firebase Authentication, callable Cloud Functions, Firestore and Storage rules, availability and transactional slot locks, booking lifecycle handling, notifications, and emulator tests. Provider, service, and availability configuration are represented in the shared schema. Laundry and print workflows are being developed; verify their complete behavior across web, mobile, functions, and tests before treating them as launched.

This roadmap assumes the existing implementation remains the base. It does not assume that a feature is production-ready merely because a route or schema exists. Each milestone has a release gate based on observable behavior.

## Roadmap

### Phase 0: Finish and stabilize the current release

**Goal:** Get one end-to-end customer booking and provider handling flow reliable on every supported client.

- Finish the in-progress laundry and printing work without breaking the existing appointment flow.
- Check that service-specific fields survive validation, callable requests, Firestore writes, dashboard views, booking details, and notifications.
- Verify capacity, approval/instant confirmation, cancellation, rescheduling, expiry, and pickup/status transitions where applicable.
- Make loading, empty, permission-denied, offline, and retry states understandable on web and mobile.
- Run the shared/functions tests, web build and typecheck, Firestore rules and emulator integration tests, and Flutter analyze/tests. Fix regressions before adding scope.

**Exit gate:** A test customer can complete each supported service type, and the provider can see and process it. Booking writes remain server-authoritative, and concurrent requests cannot exceed configured capacity.

### Phase 1: Controlled local pilot

**Goal:** Run a small pilot with real providers in one launch area, with the operational controls needed to support them.

- Pick one city or service area and recruit a small group of providers across two or three categories.
- Define provider verification, who can create or publish a business, support ownership, cancellation/refund policy, and customer dispute handling.
- Complete Firebase production setup: authentication providers, App Check enforcement, least-privilege rules, secrets and environment configuration, App Hosting backend and domain, Functions region, and billing alerts.
- Test deploy and rollback procedures. Keep emulator/demo data isolated from production.
- Confirm scheduled jobs, push delivery failures, callable errors, and alert notifications are visible to the operator.
- Write a short support runbook for booking conflicts, expired holds, provider access, account recovery, and notification failures.

**Exit gate:** Pilot providers can operate independently for a week; no unresolved booking integrity or access-control defects; support can diagnose and resolve a failed booking from logs and audit data.

### Phase 2: Provider acquisition and marketplace quality

**Goal:** Make it easy for customers to find trustworthy, available providers and easy for providers to join.

- Improve provider onboarding: business details, category, location, hours, services, staff/capacity, policies, preview, and publish/review state.
- Add practical discovery: location or service-area filtering, category and service filters, and clear availability/location information. Avoid ranking providers until there is enough supply and quality data.
- Add provider profile completeness checks and a path to correct rejected or incomplete listings.
- Make public provider and service pages useful when shared or found through search engines, while keeping booking actions authenticated as needed.
- Collect structured feedback from customers and providers; prioritize the top friction points rather than adding broad features.

**Exit gate:** A new provider can reach a bookable published listing without engineering help, and a customer can find a suitable provider without already knowing its name.

### Phase 3: Complete service-specific operations

**Goal:** Support the real work after a customer submits a request, especially for non-appointment businesses.

- For laundry, define intake details (service category, quantity/weight where appropriate, preferences), drop-off windows, estimate/final price handling, and ready-for-pickup notifications.
- For printing, define file/specification intake, quote and approval, production status, pickup/delivery, and safe file retention/deletion rules.
- Keep shared identity, provider configuration, notifications, and audit history. Add workflow states only where a vertical needs them.
- Confirm customers can review status and contact the provider, and providers can update status from the dashboard and mobile-sized screens.
- Establish retention limits and access controls for customer notes and uploaded files before accepting sensitive content.

**Exit gate:** At least one real provider in each enabled non-appointment vertical can process a job from request through completion without an out-of-band spreadsheet being the source of truth.

### Phase 4: Payments and marketplace economics

**Goal:** Introduce payment only after pricing and fulfillment rules are clear from the pilot.

- Choose the business model: provider subscription, booking fee, commission, or a staged combination.
- Decide when customers pay (at booking, after provider approval, or at pickup), who handles refunds and disputes, and how provider payouts work.
- Select a payment provider that supports the target country and marketplace payouts. Keep card data out of WalkIn and use provider-hosted/tokenized payment flows.
- Add idempotent payment webhooks, refund state, receipts, reconciliation, and emulator/test-mode coverage before enabling live charges.

**Exit gate:** Payment, cancellation, refund, and payout records reconcile with the booking lifecycle; support procedures and terms are in place. Do not make payment a launch dependency unless providers require it.

### Phase 5: Expand carefully

**Goal:** Grow service coverage and geography without sacrificing reliability.

- Add another location or vertical only when provider supply, support capacity, and operational metrics justify it.
- Review Firebase usage and costs (Functions invocations, Firestore reads/writes, Storage, App Hosting, and messaging) as traffic grows; set budgets and alerts.
- Improve accessibility, localization, analytics consent/privacy, and performance based on observed usage.
- Consider provider-facing mobile features or more advanced scheduling only after the web dashboard pilot reveals a concrete need.

**Exit gate:** Each expansion has an owner, support plan, tested service configuration, and measurable customer/provider demand.

## First Execution Plan

Use this order for the next working cycle. Keep the scope to the current release until item 4 passes.

1. **Inventory in-progress changes.** Review the current laundry/printing changes and identify each affected contract, callable, web/mobile screen, rule, and test. Preserve existing local edits; do not deploy unfinished changes.
2. **Close the vertical workflow.** Finish one vertical at a time, starting with the workflow already furthest along. Add or update tests for valid intake data, invalid input, authorization, status transitions, and capacity/approval behavior.
3. **Run the release checks.** From the repo root, run `npm run build`, `npm run typecheck`, `npm test`, `npm run test:emulator` with the documented emulator setup, and Flutter analyze/tests. Record any environment-blocked checks separately from product failures.
4. **Do a provider/customer walkthrough.** Use seeded emulator data to exercise sign-in, discovery, booking, provider review, cancellation/reschedule, and notifications on web; cover the customer booking path on Flutter.
5. **Prepare the pilot checklist.** Confirm the launch area, initial providers, account verification process, policies, production Firebase settings, App Hosting domain, monitoring recipient, and named support contact.
6. **Launch privately, measure weekly.** Track provider activation, listing-to-booking conversion, booking completion/cancellation, provider response time, repeat usage, support incidents, and cost per completed booking. Use the results to choose the next milestone.

## Product Decisions to Make Before Public Launch

- Initial city/region and whether providers serve fixed locations, delivery areas, or both.
- Which categories are enabled at launch and the exact customer workflow for each.
- Whether new providers can publish themselves or require review and verification.
- Whether a booking is a time appointment, a capacity-limited drop-off/production window, or an approval request.
- Price visibility, payment timing, cancellation/refund rules, and who is responsible for disputes.
- Required customer data, notification channels, and retention periods for notes and uploaded files.

## Success Measures

Start with a small operational dashboard or weekly report rather than a large analytics build. Measure:

- **Supply:** active providers, published services, and availability kept current.
- **Activation:** provider signup-to-published-listing time and customer signup-to-first-booking rate.
- **Reliability:** successful booking rate, slot conflicts, callable failures, notification delivery failures, and provider response time.
- **Marketplace quality:** completed bookings, cancellations/no-shows, repeat booking rate, and customer/provider support incidents.
- **Economics:** Firebase cost per completed booking and, once enabled, gross booking value and payment/refund reconciliation.

Set numerical targets after the pilot baseline is known. The first release should optimize for trustworthy completion, not raw downloads or an unvalidated feature count.
