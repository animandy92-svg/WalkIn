import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/errors.dart';
import '../../core/format.dart';
import '../../core/state.dart';

class ProviderScreen extends ConsumerWidget {
  const ProviderScreen({super.key, required this.slug});

  final String slug;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final details = ref.watch(providerDetailsBySlugProvider(slug));

    return Scaffold(
      appBar: AppBar(title: const Text('Provider')),
      body: SafeArea(
        child: details.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, _) => Center(child: Text(describeApiError(error))),
          data: (result) {
            final provider = result.provider;
            return ListView(
              padding: const EdgeInsets.all(20),
              children: [
                TextButton.icon(
                  onPressed: () => context.go('/'),
                  icon: const Icon(Icons.arrow_back),
                  label: const Text('All providers'),
                ),
                Text(provider.name, style: Theme.of(context).textTheme.headlineMedium),
                const SizedBox(height: 8),
                Text(provider.description),
                const SizedBox(height: 8),
                Text(
                  '${provider.city != null ? '${provider.city} · ' : ''}'
                  'Times shown in ${provider.timeZone}',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                const SizedBox(height: 24),
                Text('Services', style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 8),
                if (result.services.isEmpty)
                  const Text('This provider has no active services yet.'),
                for (final service in result.services)
                  Card(
                    child: ListTile(
                      title: Text(service.name),
                      subtitle: Text(
                        '${formatMoney(service.price.amountCents, service.price.currency)} · '
                        '${service.durationMinutes} min · '
                        '${service.confirmationMode.value == 'instant' ? 'Instant' : 'Approval required'}',
                      ),
                      onTap: () => context.go(
                        '/providers/${provider.slug}/services/${service.id}',
                      ),
                    ),
                  ),
              ],
            );
          },
        ),
      ),
    );
  }
}
