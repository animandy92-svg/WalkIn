import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import 'package:walkin_mobile/core/api.dart';
import 'package:walkin_mobile/core/api_models.dart';
import 'package:walkin_mobile/core/auth.dart';
import 'package:walkin_mobile/core/notifications.dart';
import 'package:walkin_mobile/features/auth/sign_in_screen.dart';
import 'package:walkin_mobile/features/booking/service_screen.dart';
import 'package:walkin_mobile/features/bookings/booking_detail_screen.dart';
import 'package:walkin_mobile/features/bookings/bookings_screen.dart';
import 'package:walkin_mobile/features/explore/explore_screen.dart';
import 'package:walkin_mobile/features/notifications/notifications_screen.dart';
import 'package:walkin_mobile/features/provider/provider_screen.dart';
import 'package:walkin_mobile/main.dart';

const user = AppUser(uid: 'u1', email: 'customer@walkin.test');

final providerDetailsMap = <String, dynamic>{
  'provider': {
    'id': 'p1',
    'name': 'Sunrise Studio',
    'slug': 'sunrise',
    'description': 'A calm studio for everyday appointments.',
    'timeZone': 'UTC',
    'city': 'Portland',
  },
  'services': [
    {
      'id': 's1',
      'providerId': 'p1',
      'name': 'Haircut',
      'description': 'A 30 minute cut.',
      'durationMinutes': 30,
      'price': {'amountCents': 3000, 'currency': 'USD'},
      'confirmationMode': 'instant',
      'capacityScope': 'staff',
      'staffIds': ['st1'],
      'active': true,
    },
  ],
  'staff': [
    {
      'id': 'st1',
      'providerId': 'p1',
      'name': 'Alex',
      'active': true,
      'serviceIds': ['s1'],
    },
  ],
};

final slotMap = <String, dynamic>{
  'slots': [
    {
      'startUtc': '2026-11-20T10:00:00Z',
      'endUtc': '2026-11-20T10:30:00Z',
      'localLabel': '10:00',
      'staffId': 'st1',
      'remaining': 1,
      'capacity': 1,
    },
  ],
};

final bookingMap = <String, dynamic>{
  'id': 'b1',
  'providerId': 'p1',
  'serviceId': 's1',
  'staffId': 'st1',
  'customerId': 'u1',
  'startUtc': '2026-11-20T10:00:00Z',
  'endUtc': '2026-11-20T10:30:00Z',
  'providerTimeZone': 'UTC',
  'status': 'confirmed',
  'confirmationMode': 'instant',
  'priceSnapshot': {
    'amountCents': 3000,
    'currency': 'USD',
    'serviceName': 'Haircut',
    'durationMinutes': 30,
  },
  'holdExpiresAt': null,
  'source': 'mobile',
  'createdAt': '2026-11-18T10:00:00Z',
  'updatedAt': '2026-11-18T10:00:00Z',
};

class FakeAuthController implements AuthController {
  FakeAuthController(this.signedInUser);

  final AppUser? signedInUser;

  @override
  Stream<AppUser?> watchUser() => Stream.value(signedInUser);

  @override
  AppUser? get currentUser => signedInUser;

  @override
  Future<void> signIn(String email, String password) async {}

  @override
  Future<void> createAccount(String email, String password) async {}

  @override
  Future<void> signOut() async {}
}

class FakeNotificationController implements NotificationController {
  final _links = StreamController<String>.broadcast();

  @override
  Stream<String> get bookingLinks => _links.stream;

  @override
  Future<bool> permissionGranted() async => true;

  @override
  Future<void> enable() async {}

  @override
  Future<void> registerCurrentToken() async {}
}

class FakeApi extends WalkInApi {
  int createCalls = 0;
  int cancelCalls = 0;

  @override
  Future<List<ListPublishedProvidersResponseProvidersItem>> listPublishedProviders() async {
    final response = ListPublishedProvidersResponse.fromJson({
      'providers': [Map<String, dynamic>.from(providerDetailsMap['provider'] as Map)],
    });
    return response.providers;
  }

  @override
  Future<GetProviderDetailsResponse> getProviderDetails({
    String? slug,
    String? providerId,
  }) async {
    return GetProviderDetailsResponse.fromJson(providerDetailsMap);
  }

  @override
  Future<List<GetAvailabilityResponseSlotsItem>> getAvailability({
    required String providerId,
    required String serviceId,
    String? staffId,
    String? date,
  }) async {
    return GetAvailabilityResponse.fromJson(slotMap).slots;
  }

  @override
  Future<BookingView> createBooking({
    required String providerId,
    required String serviceId,
    String? staffId,
    required String startUtc,
    String? note,
    required String idempotencyKey,
  }) async {
    createCalls += 1;
    return BookingView.fromJson(bookingMap);
  }

  @override
  Future<BookingView> cancelBooking(String bookingId, {String? reason}) async {
    cancelCalls += 1;
    return BookingView.fromJson(bookingMap);
  }

  @override
  Future<BookingView> rescheduleBooking({
    required String bookingId,
    required String startUtc,
    required String idempotencyKey,
  }) async {
    return BookingView.fromJson(bookingMap);
  }

  @override
  Future<List<BookingView>> getMyBookings() async {
    return [BookingView.fromJson(bookingMap)];
  }
}

GoRouter testRouter(String initialLocation) {
  return GoRouter(
    initialLocation: initialLocation,
    routes: [
      GoRoute(path: '/', builder: (_, __) => const ExploreScreen()),
      GoRoute(path: '/sign-in', builder: (_, __) => const SignInScreen()),
      GoRoute(
        path: '/providers/:slug',
        builder: (_, state) => ProviderScreen(slug: state.pathParameters['slug']!),
      ),
      GoRoute(
        path: '/providers/:slug/services/:serviceId',
        builder: (_, state) => ServiceScreen(
          slug: state.pathParameters['slug']!,
          serviceId: state.pathParameters['serviceId']!,
        ),
      ),
      GoRoute(path: '/bookings', builder: (_, __) => const BookingsScreen()),
      GoRoute(
        path: '/bookings/:bookingId',
        builder: (_, state) =>
            BookingDetailScreen(bookingId: state.pathParameters['bookingId']!),
      ),
      GoRoute(
        path: '/notifications',
        builder: (_, __) => const NotificationsScreen(),
      ),
    ],
  );
}

Widget buildTestApp({
  required String initialLocation,
  required AppUser? signedInUser,
  required FakeApi api,
}) {
  return ProviderScope(
    overrides: [
      authControllerProvider.overrideWithValue(FakeAuthController(signedInUser)),
      apiProvider.overrideWithValue(api),
      notificationControllerProvider.overrideWithValue(FakeNotificationController()),
    ],
    child: WalkInApp(router: testRouter(initialLocation)),
  );
}

void main() {
  testWidgets('signed-out customers are prompted to sign in', (tester) async {
    await tester.pumpWidget(buildTestApp(
      initialLocation: '/',
      signedInUser: null,
      api: FakeApi(),
    ));
    await tester.pumpAndSettle();

    expect(find.text('Book a local service'), findsOneWidget);
    expect(find.text('Sign in to browse'), findsOneWidget);
    expect(find.text('Sign in or create an account'), findsOneWidget);
  });

  testWidgets('published providers open their detail screen', (tester) async {
    await tester.pumpWidget(buildTestApp(
      initialLocation: '/',
      signedInUser: user,
      api: FakeApi(),
    ));
    await tester.pumpAndSettle();

    expect(find.text('Sunrise Studio'), findsOneWidget);
    await tester.tap(find.text('Sunrise Studio'));
    await tester.pumpAndSettle();

    expect(find.text('Services'), findsOneWidget);
    expect(find.text('Haircut'), findsOneWidget);
  });

  testWidgets('a customer can pick a slot and book it', (tester) async {
    final api = FakeApi();
    await tester.pumpWidget(buildTestApp(
      initialLocation: '/providers/sunrise/services/s1',
      signedInUser: user,
      api: api,
    ));
    await tester.pumpAndSettle();

    expect(find.text('Haircut'), findsOneWidget);
    expect(find.textContaining('10:00'), findsOneWidget);

    await tester.tap(find.textContaining('10:00'));
    await tester.pumpAndSettle();
    await tester.drag(find.byType(ListView).first, const Offset(0, -500));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Book this time'));
    await tester.pumpAndSettle();

    expect(api.createCalls, 1);
    expect(find.text('Booking confirmed'), findsOneWidget);
    expect(find.text('View my bookings'), findsOneWidget);
  });

  testWidgets('a customer can cancel a booking', (tester) async {
    final api = FakeApi();
    await tester.pumpWidget(buildTestApp(
      initialLocation: '/bookings',
      signedInUser: user,
      api: api,
    ));
    await tester.pumpAndSettle();

    expect(find.text('Haircut'), findsOneWidget);
    await tester.tap(find.text('Cancel'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Cancel booking'));
    await tester.pumpAndSettle();

    expect(api.cancelCalls, 1);
    expect(find.text('Booking cancelled.'), findsOneWidget);
  });
}
