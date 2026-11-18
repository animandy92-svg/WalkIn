import { Timestamp, type Transaction } from 'firebase-admin/firestore';
import { db } from './firebase.js';

/** Firestore-safe metadata values used by audit records. */
export type AuditMetadataValue = string | number | boolean | null | undefined;
export type AuditMetadata = Record<string, AuditMetadataValue>;

export interface AuditLogInput {
  action: string;
  resourceType: string;
  resourceId: string;
  actor: string;
  providerId?: string;
  bookingId?: string;
  metadata?: AuditMetadata;
}

export interface AuditLogDoc extends AuditLogInput {
  id: string;
  createdAt: Timestamp;
}

function newLog(input: AuditLogInput) {
  return {
    ...input,
    createdAt: Timestamp.now(),
  };
}

/** Write an audit record outside a booking/configuration transaction. */
export async function writeAuditLog(input: AuditLogInput): Promise<string> {
  const ref = db.collection('auditLogs').doc();
  await ref.set(newLog(input));
  return ref.id;
}

/**
 * Add an audit write to an existing transaction. Callers must invoke this
 * after all reads, because Firestore transactions require reads before writes.
 */
export function writeAuditLogInTransaction(
  transaction: Transaction,
  input: AuditLogInput,
): void {
  transaction.set(db.collection('auditLogs').doc(), newLog(input));
}
