import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/auth.dart';
import '../../core/notifications.dart';

class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  late Future<bool> _permission;
  bool _busy = false;

  @override
  void initState() {
    super.initState();
    _permission = ref.read(notificationControllerProvider).permissionGranted();
  }

  Future<void> _enable() async {
    setState(() => _busy = true);
    try {
      await ref.read(notificationControllerProvider).enable();
      setState(() => _permission = Future.value(true));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authStateProvider).value;

    return Scaffold(
      appBar: AppBar(title: const Text('Notifications')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Text('Appointment updates', style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: 12),
            const Text(
              'WalkIn sends a push notification when a booking is confirmed, '
              'rejected, cancelled, or approaching.',
            ),
            const SizedBox(height: 24),
            if (user == null) ...[
              const Text('Sign in to register this device for notifications.'),
              const SizedBox(height: 12),
              FilledButton(
                onPressed: () => context.go('/sign-in'),
                child: const Text('Sign in'),
              ),
            ] else
              FutureBuilder<bool>(
                future: _permission,
                builder: (context, snapshot) {
                  final enabled = snapshot.data ?? false;
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        leading: Icon(
                          enabled ? Icons.notifications_active : Icons.notifications_off,
                        ),
                        title: Text(enabled ? 'Push notifications on' : 'Push notifications off'),
                        subtitle: Text(enabled
                            ? 'This device is registered for booking updates.'
                            : 'Enable notifications to receive booking updates.'),
                      ),
                      const SizedBox(height: 12),
                      FilledButton(
                        onPressed: _busy ? null : _enable,
                        child: Text(_busy ? 'Enabling…' : 'Enable notifications'),
                      ),
                    ],
                  );
                },
              ),
          ],
        ),
      ),
    );
  }
}
