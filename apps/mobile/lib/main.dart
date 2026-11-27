import 'dart:async';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'core/auth.dart';
import 'core/firebase.dart';
import 'core/notifications.dart';
import 'core/router.dart';
import 'core/theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeFirebase();
  String? guestSessionError;
  if (FirebaseAuth.instance.currentUser == null) {
    try {
      await FirebaseAuth.instance.signInAnonymously();
    } catch (error) {
      debugPrint('Anonymous sign-in failed: $error');
      guestSessionError =
          'Guest browsing could not start. Enable Anonymous authentication in Firebase or sign in with an account.';
    }
  }
  runApp(
    ProviderScope(
      overrides: [
        authStartupErrorProvider.overrideWithValue(guestSessionError),
      ],
      child: const WalkInApp(),
    ),
  );
}

class WalkInApp extends ConsumerWidget {
  const WalkInApp({super.key, this.router});

  /// Allows widget tests to supply a router without touching Firebase.
  final GoRouter? router;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final GoRouter effectiveRouter = router ?? ref.watch(routerProvider);

    ref.listen<AsyncValue<AppUser?>>(authStateProvider, (previous, next) {
      final user = next.value;
      if (user != null && previous?.value?.uid != user.uid) {
        unawaited(ref.read(notificationControllerProvider).registerCurrentToken());
      }
    });

    ref.listen<AsyncValue<String>>(bookingLinkProvider, (_, next) {
      final bookingId = next.value;
      if (bookingId != null) {
        effectiveRouter.go('/bookings/$bookingId');
      }
    });

    return MaterialApp.router(
      title: 'WalkIn',
      theme: walkInTheme,
      routerConfig: effectiveRouter,
    );
  }
}
