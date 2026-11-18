import 'dart:math';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'api_client.dart';
import 'api_models.dart';
import 'firebase.dart';

/// Generates a fresh key for each booking attempt/retry.
String newIdempotencyKey() {
  final suffix = Random.secure().nextInt(1 << 30);
  return 'mobile-${DateTime.now().microsecondsSinceEpoch}-$suffix';
}

/// Zod optional fields reject explicit nulls, so generated `toJson()` output is
/// filtered before it crosses the callable boundary.
Map<String, dynamic> cleanRequest(Map<String, dynamic> request) {
  return Map<String, dynamic>.fromEntries(
    request.entries.where((entry) => entry.value != null),
  );
}

class WalkInApi {
  const WalkInApi([this._client]);

  final ApiClient? _client;

  ApiClient get client {
    final value = _client;
    if (value == null) throw StateError('No API client configured');
    return value;
  }

  Future<List<ListPublishedProvidersResponseProvidersItem>> listPublishedProviders() async {
    final response = ListPublishedProvidersResponse.fromJson(
      await client.call('listPublishedProviders'),
    );
    return response.providers;
  }

  Future<GetProviderDetailsResponse> getProviderDetails({
    String? slug,
    String? providerId,
  }) async {
    final request = GetProviderDetailsRequest(slug: slug, providerId: providerId);
    return GetProviderDetailsResponse.fromJson(
      await client.call('getProviderDetails', cleanRequest(request.toJson())),
    );
  }

  Future<List<GetAvailabilityResponseSlotsItem>> getAvailability({
    required String providerId,
    required String serviceId,
    String? staffId,
    String? date,
  }) async {
    final request = GetAvailabilityRequest(
      providerId: providerId,
      serviceId: serviceId,
      staffId: staffId,
      date: date,
    );
    final response = GetAvailabilityResponse.fromJson(
      await client.call('getAvailability', cleanRequest(request.toJson())),
    );
    return response.slots;
  }

  Future<BookingView> createBooking({
    required String providerId,
    required String serviceId,
    String? staffId,
    required String startUtc,
    String? note,
    required String idempotencyKey,
  }) async {
    final request = CreateBookingRequest(
      providerId: providerId,
      serviceId: serviceId,
      staffId: staffId,
      startUtc: startUtc,
      note: note,
      idempotencyKey: idempotencyKey,
      source: CreateBookingRequestSource.mobile,
    );
    final response = await client.call('createBooking', cleanRequest(request.toJson()));
    return BookingView.fromJson(asMap(response['booking']));
  }

  Future<BookingView> cancelBooking(String bookingId, {String? reason}) async {
    final request = CancelBookingRequest(bookingId: bookingId, reason: reason);
    final response = await client.call('cancelBooking', cleanRequest(request.toJson()));
    return BookingView.fromJson(asMap(response['booking']));
  }

  Future<BookingView> rescheduleBooking({
    required String bookingId,
    required String startUtc,
    required String idempotencyKey,
  }) async {
    final request = RescheduleBookingRequest(
      bookingId: bookingId,
      startUtc: startUtc,
      idempotencyKey: idempotencyKey,
    );
    final response = await client.call('rescheduleBooking', request.toJson());
    return BookingView.fromJson(asMap(response['booking']));
  }

  Future<List<BookingView>> getMyBookings() async {
    final response = await client.call('getMyBookings');
    return (response['bookings'] as List<dynamic>)
        .map((item) => BookingView.fromJson(asMap(item)))
        .toList();
  }

  Future<void> registerFcmToken(String token, RegisterFcmTokenRequestPlatform platform) async {
    final request = RegisterFcmTokenRequest(token: token, platform: platform);
    await client.call('registerFcmToken', request.toJson());
  }

  Future<void> removeFcmToken(String token) async {
    final request = RemoveFcmTokenRequest(token: token);
    await client.call('removeFcmToken', request.toJson());
  }
}

final apiClientProvider = Provider<ApiClient>((ref) {
  return ApiClient(ref.watch(functionsProvider));
});

final apiProvider = Provider<WalkInApi>((ref) {
  return WalkInApi(ref.watch(apiClientProvider));
});
