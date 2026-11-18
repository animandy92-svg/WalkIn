/// Error surfaced by a Cloud Function call.
///
/// `code` is the stable shared error code from `packages/shared` when the
/// backend provided one, otherwise it is the Firebase Functions error code.
class ApiException implements Exception {
  const ApiException(this.code, this.message);

  final String code;
  final String message;

  bool get isSlotUnavailable => code == 'SLOT_UNAVAILABLE';
  bool get isPolicyViolation => code == 'POLICY_VIOLATION';

  @override
  String toString() => message;
}

/// Human-readable copy for the small set of domain errors the app handles.
String describeApiError(Object error) {
  if (error is ApiException) {
    switch (error.code) {
      case 'SLOT_UNAVAILABLE':
        return 'That time was just taken. Please choose another slot.';
      case 'HOLD_EXPIRED':
        return 'The hold on this booking expired. Please book again.';
      case 'POLICY_VIOLATION':
        return error.message;
      case 'UNAUTHENTICATED':
        return 'Please sign in and try again.';
      case 'PERMISSION_DENIED':
        return 'You do not have permission to do that.';
      default:
        return error.message;
    }
  }
  return 'Something went wrong. Please try again.';
}
