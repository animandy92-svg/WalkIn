import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { onCall } from 'firebase-functions/v2/https';
import {
  emptyResponseSchema,
  registerFcmTokenRequestSchema,
  removeFcmTokenRequestSchema,
} from '@walkin/shared';
import { db, enforceAppCheck } from '../firebase.js';
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
    });

    return emptyResponseSchema.parse({});
  } catch (error) {
    throw toHttpsError(error);
  }
});
