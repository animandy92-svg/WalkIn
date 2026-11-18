import 'dart:async';

import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'api.dart';
import 'api_models.dart';
import 'firebase.dart';

abstract class NotificationController {
  /// Booking ids extracted from push messages, including the message that
  /// launched the app.
  Stream<String> get bookingLinks;

  Future<bool> permissionGranted();

  /// Requests permission and registers the current FCM token with the API.
  Future<void> enable();

  /// Registers an already available token without prompting (called on login).
  Future<void> registerCurrentToken();
}

class FirebaseNotificationController implements NotificationController {
  FirebaseNotificationController(this._ref);

  final Ref _ref;
  late final StreamController<String> _links = StreamController<String>.broadcast();

  @override
  Stream<String> get bookingLinks {
    final messaging = _ref.watch(messagingProvider);

    messaging.getInitialMessage().then(_emitBookingLink);
    FirebaseMessaging.onMessageOpenedApp.listen(_emitBookingLink);
    FirebaseMessaging.onMessage.listen(_emitBookingLink);
    messaging.onTokenRefresh.listen((_) => registerCurrentToken());

    _ref.onDispose(() => _links.close());
    return _links.stream;
  }

  void _emitBookingLink(RemoteMessage? message) {
    final bookingId = message?.data['bookingId'];
    if (bookingId is String && bookingId.isNotEmpty && !_links.isClosed) {
      _links.add(bookingId);
    }
  }

  @override
  Future<bool> permissionGranted() async {
    final settings = await _ref.read(messagingProvider).getNotificationSettings();
    return settings.authorizationStatus == AuthorizationStatus.authorized ||
        settings.authorizationStatus == AuthorizationStatus.provisional;
  }

  @override
  Future<void> enable() async {
    final messaging = _ref.read(messagingProvider);
    final settings = await messaging.requestPermission();
    final granted = settings.authorizationStatus == AuthorizationStatus.authorized ||
        settings.authorizationStatus == AuthorizationStatus.provisional;
    if (granted) await registerCurrentToken();
  }

  @override
  Future<void> registerCurrentToken() async {
    final messaging = _ref.read(messagingProvider);
    final token = await messaging.getToken();
    if (token == null || token.isEmpty) return;

    final platform = defaultTargetPlatform == TargetPlatform.android
        ? RegisterFcmTokenRequestPlatform.android
        : RegisterFcmTokenRequestPlatform.ios;
    await _ref.read(apiProvider).registerFcmToken(token, platform);
  }
}

final notificationControllerProvider = Provider<NotificationController>((ref) {
  return FirebaseNotificationController(ref);
});

final bookingLinkProvider = StreamProvider<String>((ref) {
  return ref.watch(notificationControllerProvider).bookingLinks;
});
