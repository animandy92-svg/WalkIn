import { ApiError } from './api';

/** Callable error codes, said the way a student or shop owner needs to hear them. */
export function apiMessage(error: unknown, fallback = 'Something went wrong. Try again.'): string {
  if (!(error instanceof ApiError)) {
    return error instanceof Error && error.message ? error.message : fallback;
  }
  switch (error.code) {
    case 'SLOT_UNAVAILABLE':
      return 'Someone took that slot a moment ago. Pick another time.';
    case 'INVALID_TIME':
      return 'That time is no longer bookable. Pick a later slot.';
    case 'POLICY_VIOLATION':
      return error.message || 'The shop’s booking rules do not allow this change.';
    case 'HOLD_EXPIRED':
      return 'This request waited too long and its hold expired. The slot has been released.';
    case 'STAFF_NOT_ELIGIBLE':
      return 'That person does not offer this service. Choose someone else or “Anyone”.';
    case 'NOT_FOUND':
      return 'We could not find that any more. It may have been removed.';
    case 'UNAUTHENTICATED':
      return 'Your session ended. Sign in again to continue.';
    case 'PERMISSION_DENIED':
      return 'Your account does not have access to this.';
    case 'INVALID_ARGUMENT':
      return 'Some details are missing or not in the right format. Check the form.';
    default:
      return fallback;
  }
}
