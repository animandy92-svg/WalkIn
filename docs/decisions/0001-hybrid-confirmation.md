# 0001 — Hybrid per-service confirmation

Status: accepted

## Context

Customers expect immediate confirmation for simple services, while providers need to review some
requests (for example custom print jobs). A separate data model per mode would duplicate booking,
availability, and notification logic.

## Decision

`services/{serviceId}.confirmationMode` is either `instant` or `approval`. Both modes use one
booking state machine and one slot-lock transaction. `instant` creates a `confirmed` booking;
`approval` creates a `pending` booking with `holdExpiresAt`. Provider confirm/reject transitions the
pending booking; a scheduler expires stale holds.

## Consequences

- Availability logic is shared and stays authoritative in Cloud Functions.
- Approval services need a visible pending queue and a configurable hold lifetime.
- Clients only branch on the initial status and the actions offered for that status.
