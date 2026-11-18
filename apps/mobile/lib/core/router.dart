import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../features/auth/sign_in_screen.dart';
import '../features/booking/service_screen.dart';
import '../features/bookings/booking_detail_screen.dart';
import '../features/bookings/bookings_screen.dart';
import '../features/explore/explore_screen.dart';
import '../features/notifications/notifications_screen.dart';
import '../features/provider/provider_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const ExploreScreen(),
      ),
      GoRoute(
        path: '/sign-in',
        builder: (context, state) => const SignInScreen(),
      ),
      GoRoute(
        path: '/providers/:slug',
        builder: (context, state) => ProviderScreen(
          slug: state.pathParameters['slug']!,
        ),
      ),
      GoRoute(
        path: '/providers/:slug/services/:serviceId',
        builder: (context, state) => ServiceScreen(
          slug: state.pathParameters['slug']!,
          serviceId: state.pathParameters['serviceId']!,
        ),
      ),
      GoRoute(
        path: '/bookings',
        builder: (context, state) => const BookingsScreen(),
      ),
      GoRoute(
        path: '/bookings/:bookingId',
        builder: (context, state) => BookingDetailScreen(
          bookingId: state.pathParameters['bookingId']!,
        ),
      ),
      GoRoute(
        path: '/notifications',
        builder: (context, state) => const NotificationsScreen(),
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      appBar: AppBar(title: const Text('Page not found')),
      body: Center(
        child: FilledButton(
          onPressed: () => context.go('/'),
          child: const Text('Go home'),
        ),
      ),
    ),
  );
});
