import assert from 'node:assert/strict';
import test from 'node:test';
import { requireProviderRole } from '../api/helpers.js';

type Request = Parameters<typeof requireProviderRole>[0];

function requestFor(claims: Record<string, unknown>, uid = 'user-1'): Request {
  return { auth: { uid, token: claims } } as unknown as Request;
}

function hasCode(code: string) {
  return (error: unknown): boolean => (error as { code?: string }).code === code;
}

test('provider role check denies access to another provider', () => {
  assert.throws(
    () => requireProviderRole(requestFor({ providerId: 'provider-a', role: 'owner' }), 'provider-b'),
    hasCode('permission-denied'),
  );
});

test('provider role check allows matching staff', () => {
  assert.equal(
    requireProviderRole(requestFor({ providerId: 'provider-a', role: 'staff' }), 'provider-a'),
    'user-1',
  );
});

test('provider role check requires a signed-in user', () => {
  assert.throws(
    () => requireProviderRole({ auth: null } as unknown as Request, 'provider-a'),
    hasCode('unauthenticated'),
  );
});

test('provider role check honours the allowed-roles list', () => {
  assert.throws(
    () => requireProviderRole(
      requestFor({ providerId: 'provider-a', role: 'staff' }),
      'provider-a',
      ['owner', 'admin'],
    ),
    hasCode('permission-denied'),
  );
});
