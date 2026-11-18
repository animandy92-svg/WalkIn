import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/api.dart';
import '../../core/api_models.dart';
import '../../core/errors.dart';
import '../../core/format.dart';
import '../../core/state.dart';
import '../../core/theme.dart';

class BookingsScreen extends ConsumerStatefulWidget {
  const BookingsScreen({super.key});

  @override
  ConsumerState<BookingsScreen> createState() => _BookingsScreenState();
}

class _BookingsScreenState extends ConsumerState<BookingsScreen> {
  List<BookingView> _bookings = const [];
  String? _error;
  String? _notice;
  String? _cancelingId;
  String? _reschedulingId;
  String _rescheduleDate = todayIsoDate();
  List<GetAvailabilityResponseSlotsItem> _rescheduleSlots = const [];
  GetAvailabilityResponseSlotsItem? _rescheduleSelected;
  bool _busy = false;

  @override
  void initState() {
    super.initState();
    final bookings = ref.read(bookingsProvider).value;
    if (bookings != null) _bookings = bookings;
  }

  Future<void> _cancel(BookingView booking) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cancel this booking?'),
        content: const Text('This cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Keep it'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Cancel booking'),
          ),
        ],
      ),
    );
    if (confirmed != true || !mounted) return;

    setState(() {
      _cancelingId = booking.id;
      _error = null;
      _notice = null;
    });
    try {
      await ref.read(apiProvider).cancelBooking(
            booking.id,
            reason: 'Cancelled by customer',
          );
      ref.invalidate(bookingsProvider);
      if (mounted) setState(() => _notice = 'Booking cancelled.');
    } catch (error) {
      if (mounted) setState(() => _error = describeApiError(error));
    } finally {
      if (mounted) setState(() => _cancelingId = null);
    }
  }

  Future<void> _pickRescheduleDate(BookingView booking) async {
    final initial = DateTime.tryParse(_rescheduleDate) ?? DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 60)),
    );
    if (picked == null || !mounted) return;

    final month = picked.month.toString().padLeft(2, '0');
    final day = picked.day.toString().padLeft(2, '0');
    setState(() => _rescheduleDate = '${picked.year}-$month-$day');
    await _loadRescheduleSlots(booking);
  }

  Future<void> _loadRescheduleSlots(BookingView booking) async {
    setState(() {
      _rescheduleSlots = const [];
      _rescheduleSelected = null;
      _error = null;
    });
    try {
      final slots = await ref.read(apiProvider).getAvailability(
            providerId: booking.providerId,
            serviceId: booking.serviceId,
            staffId: booking.staffId,
            date: _rescheduleDate,
          );
      if (mounted) setState(() => _rescheduleSlots = slots);
    } catch (error) {
      if (mounted) setState(() => _error = describeApiError(error));
    }
  }

  Future<void> _reschedule(BookingView booking) async {
    final selected = _rescheduleSelected;
    if (selected == null) return;

    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await ref.read(apiProvider).rescheduleBooking(
            bookingId: booking.id,
            startUtc: selected.startUtc,
            idempotencyKey: newIdempotencyKey(),
          );
      ref.invalidate(bookingsProvider);
      if (mounted) {
        setState(() {
          _reschedulingId = null;
          _rescheduleSelected = null;
          _notice = 'Booking rescheduled.';
        });
      }
    } catch (error) {
      if (mounted) setState(() => _error = describeApiError(error));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final bookingsAsync = ref.watch(bookingsProvider);

    ref.listen<AsyncValue<List<BookingView>>>(bookingsProvider, (_, next) {
      final value = next.value;
      if (value != null) setState(() => _bookings = value);
    });

    return Scaffold(
      appBar: AppBar(title: const Text('My bookings')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Text('My bookings', style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: 12),
            if (bookingsAsync.isLoading && _bookings.isEmpty)
              const Center(child: CircularProgressIndicator()),
            if (_notice != null) Text(_notice!),
            if (_error != null)
              Text(_error!, style: TextStyle(color: Theme.of(context).colorScheme.error)),
            if (!bookingsAsync.isLoading && _bookings.isEmpty)
              const Text('You have no bookings yet.'),
            const SizedBox(height: 8),
            for (final booking in _bookings)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              booking.priceSnapshot.serviceName,
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                          ),
                          _StatusBadge(status: booking.status.value),
                        ],
                      ),
                      const SizedBox(height: 4),
                      _ProviderName(providerId: booking.providerId),
                      const SizedBox(height: 8),
                      Text(formatUtcDateTime(booking.startUtc)),
                      Text(
                        booking.confirmationMode.value == 'instant'
                            ? 'Instant confirmation'
                            : 'Approval required',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          TextButton(
                            onPressed: () => context.go('/bookings/${booking.id}'),
                            child: const Text('Details'),
                          ),
                          if (_canManage(booking.status.value)) ...[
                            TextButton(
                              onPressed: () {
                                final opening = _reschedulingId != booking.id;
                                setState(() {
                                  _reschedulingId = opening ? booking.id : null;
                                  _rescheduleSelected = null;
                                  _rescheduleDate = todayIsoDate();
                                });
                                if (opening) _loadRescheduleSlots(booking);
                              },
                              child: const Text('Reschedule'),
                            ),
                            TextButton(
                              onPressed: _cancelingId == booking.id
                                  ? null
                                  : () => _cancel(booking),
                              child: Text(_cancelingId == booking.id ? 'Cancelling…' : 'Cancel'),
                            ),
                          ],
                        ],
                      ),
                      if (_reschedulingId == booking.id) ...[
                        const Divider(),
                        ListTile(
                          contentPadding: EdgeInsets.zero,
                          leading: const Icon(Icons.calendar_today),
                          title: Text(_rescheduleDate),
                          trailing: const Icon(Icons.edit),
                          onTap: () => _pickRescheduleDate(booking),
                        ),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: [
                            for (final slot in _rescheduleSlots)
                              ChoiceChip(
                                label: Text(slot.localLabel),
                                selected: _rescheduleSelected == slot,
                                onSelected: (_) =>
                                    setState(() => _rescheduleSelected = slot),
                              ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        FilledButton(
                          onPressed: _rescheduleSelected == null || _busy
                              ? null
                              : () => _reschedule(booking),
                          child: Text(_busy ? 'Rescheduling…' : 'Confirm new time'),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  bool _canManage(String status) => status == 'confirmed' || status == 'pending';
}

class _StatusBadge extends StatelessWidget {
  const _StatusBadge({required this.status});

  final String status;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: statusColor(status).withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(status, style: TextStyle(color: statusColor(status))),
    );
  }
}

class _ProviderName extends ConsumerWidget {
  const _ProviderName({required this.providerId});

  final String providerId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final details = ref.watch(providerDetailsByIdProvider(providerId));
    return Text(
      details.value?.provider.name ?? providerId,
      style: Theme.of(context).textTheme.bodySmall,
    );
  }
}
