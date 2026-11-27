import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/state.dart';
import '../../core/auth.dart';
import '../../core/errors.dart';

class ExploreScreen extends ConsumerWidget {
  const ExploreScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authStateProvider);
    final guestSessionError = ref.watch(authStartupErrorProvider);
    final providers = ref.watch(providersProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('WalkIn'),
        actions: [
          IconButton(
            tooltip: 'Sign in (optional)',
            icon: const Icon(Icons.person_outline),
            onPressed: () => context.go('/sign-in'),
          ),
          IconButton(
            tooltip: 'Notifications',
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () => context.go('/notifications'),
          ),
          IconButton(
            tooltip: 'My bookings',
            icon: const Icon(Icons.event_available_outlined),
            onPressed: () => context.go('/bookings'),
          ),
        ],
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Text('Book a local service', style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: 8),
            const Text('Find a provider, choose a service, and reserve a time.'),
            const SizedBox(height: 24),
            if (guestSessionError != null)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text(guestSessionError),
                ),
              ),
            if (auth.isLoading || providers.isLoading)
              const Center(child: CircularProgressIndicator()),
            providers.when(
              data: (items) {
                if (items.isEmpty && !providers.isLoading) {
                  return const Text('No providers are published yet.');
                }
                return Column(
                  children: [
                    for (final provider in items)
                      Card(
                        child: ListTile(
                          title: Text(provider.name),
                          subtitle: Text(provider.city ?? provider.description),
                          onTap: () => context.go('/providers/${provider.slug}'),
                        ),
                      ),
                  ],
                );
              },
              error: (error, _) => Padding(
                padding: const EdgeInsets.only(top: 12),
                child: Text(
                  describeApiError(error),
                  style: TextStyle(color: Theme.of(context).colorScheme.error),
                ),
              ),
              loading: () => const SizedBox.shrink(),
            ),
          ],
        ),
      ),
    );
  }
}
