import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'api.dart';
import 'api_models.dart';
import 'auth.dart';

class AvailabilityQuery {
  const AvailabilityQuery({
    required this.providerId,
    required this.serviceId,
    this.staffId,
    required this.date,
  });

  final String providerId;
  final String serviceId;
  final String? staffId;
  final String date;

  @override
  bool operator ==(Object other) =>
      other is AvailabilityQuery &&
      other.providerId == providerId &&
      other.serviceId == serviceId &&
      other.staffId == staffId &&
      other.date == date;

  @override
  int get hashCode => Object.hash(providerId, serviceId, staffId, date);
}

final providersProvider = FutureProvider<List<ListPublishedProvidersResponseProvidersItem>>((ref) async {
  final user = await ref.watch(authStateProvider.future);
  if (user == null) return const <ListPublishedProvidersResponseProvidersItem>[];
  return ref.watch(apiProvider).listPublishedProviders();
});

final providerDetailsBySlugProvider =
    FutureProvider.family<GetProviderDetailsResponse, String>((ref, slug) {
  return ref.watch(apiProvider).getProviderDetails(slug: slug);
});

final providerDetailsByIdProvider =
    FutureProvider.family<GetProviderDetailsResponse, String>((ref, providerId) {
  return ref.watch(apiProvider).getProviderDetails(providerId: providerId);
});

final slotsProvider =
    FutureProvider.family<List<GetAvailabilityResponseSlotsItem>, AvailabilityQuery>((ref, query) {
  return ref.watch(apiProvider).getAvailability(
        providerId: query.providerId,
        serviceId: query.serviceId,
        staffId: query.staffId,
        date: query.date,
      );
});

final bookingsProvider = FutureProvider<List<BookingView>>((ref) async {
  final user = await ref.watch(authStateProvider.future);
  if (user == null) return const <BookingView>[];
  return ref.watch(apiProvider).getMyBookings();
});
