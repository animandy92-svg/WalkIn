# WalkIn callable API

Source of truth: `packages/shared/src/schemas.ts`. Generated JSON Schema: `packages/shared/schema/walkin.schema.json`.

All endpoints are Firebase Callable Functions. Clients must be signed in. App Check is enforced in
deployed environments. Errors include a machine-readable `details.code` from `FunctionErrorCode`.

| Function | Request | Response |
|---|---|---|
| `getAvailability` | providerId, serviceId, staffId?, from, to | slots[] with UTC start/end, local label, remaining capacity |
| `createBooking` | providerId, serviceId, staffId?, startUtc, idempotencyKey, note?, source | booking |
| `cancelBooking` | bookingId, reason? | booking |
| `rescheduleBooking` | bookingId, startUtc, idempotencyKey | new booking (old one cancelled atomically) |
| `respondToBooking` | bookingId, action (`confirm`/`reject`) | booking |
| `saveProvider` | provider fields; optional providerId for updates | `{ id }` |
| `saveService` | service fields; optional serviceId | `{ id }` |
| `saveStaff` | staff fields; optional staffId | `{ id }` |
| `saveAvailability` | weekly rule or date exception; optional ruleId | `{ id }` |
| `listProviderBookings` | providerId | bookings[] (provider staff only) |
| `registerFcmToken` | token, platform | `{}` |
| `removeFcmToken` | token | `{}` |

## Booking state machine

```
instant service:  (create) -> confirmed -> completed
                                        \-> cancelled / rescheduled

approval service: (create) -> pending -> confirmed -> completed
                                      \-> rejected / expired / cancelled
```

A `pending` booking holds its slots until `holdExpiresAt`; the expiry scheduler releases them.
Provider `confirm` fails with `HOLD_EXPIRED` if the hold is gone.

## Error codes

`SLOT_UNAVAILABLE`, `INVALID_TIME`, `NOT_FOUND`, `POLICY_VIOLATION`, `STAFF_NOT_ELIGIBLE`,
`HOLD_EXPIRED`, `UNAUTHENTICATED`, `PERMISSION_DENIED`, `INVALID_ARGUMENT`, `INTERNAL`.
