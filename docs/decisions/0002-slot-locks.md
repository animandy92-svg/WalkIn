# 0002 — Slot locks for concurrency and capacity

Status: accepted

## Context

Two customers can request the same time simultaneously. Capacity-limited services (drop-off slots,
production windows) may allow more than one booking per slot. Firestore transactions cannot safely
resolve capacity by scanning a large bookings collection on every request.

## Decision

Maintain one `providers/{providerId}/slotLocks/{key}` document per 15-minute UTC cell. The key
encodes provider, staff pool, date, and cell. Capacity is defined on staff (or on the provider for
shared pools), not on the service, so services sharing a resource cannot disagree. `createBooking`
runs a transaction that checks every covered lock and increments them; cancellation decrements.

## Consequences

- Double booking is prevented by the transaction, not by client-side availability display.
- Variable durations round up to the 15-minute grid. True interval-overlap checks can replace the
  grid behind the same callable API if precision becomes important.
- Expired or rejected holds must release their locks; scheduled cleanup owns that job.
