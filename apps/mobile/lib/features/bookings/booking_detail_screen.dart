import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/errors.dart';
import '../../core/format.dart';
import '../../core/state.dart';
import '../../core/theme.dart';

class BookingDetailScreen extends ConsumerWidget {
  const BookingDetailScreen({super.key, required this.bookingId});

  final String bookingId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bookings = ref.watch(bookingsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Booking details')),
      body: SafeArea(
        child: bookings.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, _) => Center(child: Text(describeApiError(error))),
          data: (items) {
            final booking = items
                .where((item) => item.id == bookingId)
                .firstOrNull;
            if (booking == null) {
              return Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('This booking is not available.'),
                    const SizedBox(height: 12),
                    FilledButton(
                      onPressed: () => context.go('/bookings'),
                      child: const Text('Back to bookings'),
                    ),
                  ],
                ),
              );
            }

            return ListView(
              padding: const EdgeInsets.all(20),
              children: [
                Text(
                  booking.priceSnapshot.serviceName,
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Text('Status: ${booking.status.value}'),
                    const SizedBox(width: 8),
                    _Dot(status: booking.status.value),
                  ],
                ),
                const SizedBox(height: 16),
                _DetailRow(label: 'Provider', value: booking.providerId),
                _DetailRow(label: 'Starts', value: formatUtcDateTime(booking.startUtc)),
                _DetailRow(label: 'Ends', value: formatUtcDateTime(booking.endUtc)),
                _DetailRow(
                  label: 'Confirmation',
                  value: booking.confirmationMode.value == 'instant'
                      ? 'Instant'
                      : 'Approval required',
                ),
                _DetailRow(
                  label: 'Price',
                  value: formatMoney(
                    booking.priceSnapshot.amountCents,
                    booking.priceSnapshot.currency,
                  ),
                ),
                if (booking.customerNote != null && booking.customerNote!.isNotEmpty)
                  _DetailRow(label: 'Note', value: booking.customerNote!),
                const SizedBox(height: 24),
                FilledButton(
                  onPressed: () => context.go('/bookings'),
                  child: const Text('Back to bookings'),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  const _DetailRow({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(width: 110, child: Text(label, style: TextStyle(
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ))),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
}

class _Dot extends StatelessWidget {
  const _Dot({required this.status});

  final String status;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 10,
      height: 10,
      decoration: BoxDecoration(
        color: statusColor(status),
        shape: BoxShape.circle,
      ),
    );
  }
}
