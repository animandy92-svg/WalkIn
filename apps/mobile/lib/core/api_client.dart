import 'package:cloud_functions/cloud_functions.dart';

import 'errors.dart';

/// Thin wrapper around Firebase callable functions.
///
/// Every call goes through here so the backend's domain error codes survive
/// the Firebase SDK boundary and reach the screens unchanged.
class ApiClient {
  const ApiClient(this._functions);

  final FirebaseFunctions _functions;

  Future<Map<String, dynamic>> call(
    String name, [
    Map<String, dynamic> data = const <String, dynamic>{},
  ]) async {
    try {
      final result = await _functions.httpsCallable(name).call<Map<String, dynamic>>(data);
      return Map<String, dynamic>.from(result.data);
    } on FirebaseFunctionsException catch (error) {
      final details = error.details;
      final domainCode = details is Map && details['code'] is String
          ? details['code'] as String
          : error.code;
      throw ApiException(domainCode, error.message ?? 'Request failed');
    }
  }
}

Map<String, dynamic> asMap(Object? value) {
  return Map<String, dynamic>.from(value as Map);
}
