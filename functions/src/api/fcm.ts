import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { onCall } from 'firebase-functions/v2/https';
import {
  emptyResponseSchema,
  registerFcmTokenRequestSchema,
  removeFcmTokenRequestSchema,
} from '@walkin/shared';
import { writeAuditLog } from '../audit.js';
import { db, enforceAppCheck, TRANSACTION_OPTIONS } from '../firebase.js';
import type { UserDoc } from '../types.js';
import { parseRequest, requireUid, toHttpsError } from './helpers.js';

export const registerFcmToken = onCall({ enforceAppCheck }, async (request) => {
  try {
    const uid = requireUid(request);
    const input = parseRequest(registerFcmTokenRequestSchema, request.data);
    const now = Timestamp.now();
    await db.collection('users').doc(uid).set(
      {
        fcmTokens: {
          [input.token]: { platform: input.platform, updatedAt: now },
        },
        updatedAt: now,
      },
      { merge: true },
    );
    await writeAuditLog({
      action: 'fcm.token.registered',
      resourceType: 'fcmToken',
      resourceId: uid,
      actor: uid,
      metadata: { platform: input.platform },
    });
    return emptyResponseSchema.parse({});
  } catch (error) {
    throw toHttpsError(error);
  }
});

export const removeFcmToken = onCall({ enforceAppCheck }, async (request) => {
  try {
    const uid = requireUid(request);
    const input = parseRequest(removeFcmTokenRequestSchema, request.data);
    const ref = db.collection('users').doc(uid);

    await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(ref);
      if (!snapshot.exists) return;
      const tokens = { ...((snapshot.data() as UserDoc).fcmTokens ?? {}) };
      delete tokens[input.token];
      transaction.set(ref, { fcmTokens: tokens, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    }, TRANSACTION_OPTIONS);

    await writeAuditLog({
      action: 'fcm.token.removed',
      resourceType: 'fcmToken',
      resourceId: uid,
      actor: uid,
    });

    return emptyResponseSchema.parse({});
  } catch (error) {
    throw toHttpsError(error);
  }
});
