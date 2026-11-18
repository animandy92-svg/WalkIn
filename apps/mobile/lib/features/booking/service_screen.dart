import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/api.dart';
import '../../core/api_models.dart';
import '../../core/errors.dart';
import '../../core/format.dart';
import '../../core/state.dart';

class ServiceScreen extends ConsumerStatefulWidget {
  const ServiceScreen({super.key, required this.slug, required this.serviceId});

  final String slug;
  final String serviceId;

  @override
  ConsumerState<ServiceScreen> createState() => _ServiceScreenState();
}

class _ServiceScreenState extends ConsumerState<ServiceScreen> {
  final _noteController = TextEditingController();

  String _date = todayIsoDate();
  String? _staffId;
  List<GetAvailabilityResponseSlotsItem> _slots = const [];
  GetAvailabilityResponseSlotsItem? _selected;
  bool _initialized = false;
  bool _loadingSlots = false;
  bool _busy = false;
  String? _error;
  BookingView? _confirmed;

  @override
  void dispose() {
    _noteController.dispose();
    super.dispose();
  }

  Future<void> _loadSlots() async {
    final details = ref.read(providerDetailsBySlugProvider(widget.slug)).value;
    if (details == null) return;

    setState(() {
      _loadingSlots = true;
      _error = null;
      _slots = const [];
      _selected = null;
    });

    try {
      final slots = await ref.read(apiProvider).getAvailability(
            providerId: details.provider.id,
            serviceId: widget.serviceId,
            staffId: _staffId,
            date: _date,
          );
      if (mounted) setState(() => _slots = slots);
    } catch (error) {
      if (mounted) setState(() => _error = describeApiError(error));
    } finally {
      if (mounted) setState(() => _loadingSlots = false);
    }
  }

  Future<void> _pickDate() async {
    final initial = DateTime.tryParse(_date) ?? DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 60)),
    );
    if (picked == null || !mounted) return;

    final month = picked.month.toString().padLeft(2, '0');
    final day = picked.day.toString().padLeft(2, '0');
    setState(() => _date = '${picked.year}-$month-$day');
    await _loadSlots();
  }

  Future<void> _book() async {
    final details = ref.read(providerDetailsBySlugProvider(widget.slug)).value;
    final selected = _selected;
    if (details == null || selected == null) return;

    setState(() {
      _busy = true;
      _error = null;
    });

    try {
      final note = _noteController.text.trim();
      final booking = await ref.read(apiProvider).createBooking(
            providerId: details.provider.id,
            serviceId: widget.serviceId,
            staffId: selected.staffId,
            startUtc: selected.startUtc,
            note: note.isEmpty ? null : note,
            idempotencyKey: newIdempotencyKey(),
          );
      if (mounted) setState(() => _confirmed = booking);
    } catch (error) {
      if (mounted) {
        setState(() {
          _error = describeApiError(error);
          if (error is ApiException && error.isSlotUnavailable) _selected = null;
        });
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final detailsAsync = ref.watch(providerDetailsBySlugProvider(widget.slug));

    ref.listen<AsyncValue<GetProviderDetailsResponse>>(
      providerDetailsBySlugProvider(widget.slug),
      (_, next) {
        final details = next.value;
        if (details == null || _initialized) return;
        final service = details.services.where((item) => item.id == widget.serviceId).firstOrNull;
        if (service == null) return;

        _initialized = true;
        if (service.staffIds.contains('__any__')) {
          _staffId = '';
        } else {
          _staffId = service.staffIds.firstOrNull ?? '';
        }
        _loadSlots();
      },
    );

    var scaffold = Scaffold(
      appBar: AppBar(title: const Text('Book a service')),
      body: SafeArea(
        child: detailsAsync.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, _) => Center(child: Text(describeApiError(error))),
          data: (details) {
            final service = details.services
                .where((item) => item.id == widget.serviceId)
                .firstOrNull;
            if (service == null) {
              return const Center(child: Text('Service not found.'));
            }

            if (_confirmed != null) {
              return _buildConfirmation(_confirmed!);
            }

            String staffName(String? id) {
              if (id == null || id.isEmpty) return 'Any available staff';
              return details.staff
                  .where((member) => member.id == id)
                  .firstOrNull
                  ?.name ?? id;
            }

            final options = <DropdownMenuItem<String>>[
              const DropdownMenuItem(value: '', child: Text('Any available staff')),
              ...[
                for (final staff in details.staff)
                  if (service.staffIds.contains(staff.id))
                    DropdownMenuItem(value: staff.id, child: Text(staff.name)),
              ],
            ];

            return ListView(
              padding: const EdgeInsets.all(20),
              children: [
                TextButton.icon(
                  onPressed: () => context.go('/providers/${details.provider.slug}'),
                  icon: const Icon(Icons.arrow_back),
                  label: Text(details.provider.name),
                ),
                Text(service.name, style: Theme.of(context).textTheme.headlineMedium),
                const SizedBox(height: 8),
                Text(service.description),
                const SizedBox(height: 8),
                Text(
                  '${formatMoney(service.price.amountCents, service.price.currency)} · '
                  '${service.durationMinutes} min · '
                  '${service.confirmationMode.value == 'instant' ? 'Instant confirmation' : 'Approval required'}',
                ),
                const SizedBox(height: 24),
                Text('Choose a time', style: Theme.of(context).textTheme.titleLarge),
                Text('Times shown in ${details.provider.timeZone}.'),
                const SizedBox(height: 12),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.calendar_today),
                  title: Text(_date),
                  trailing: const Icon(Icons.edit),
                  onTap: _pickDate,
                ),
                if (options.length > 1)
                  DropdownButtonFormField<String>(
                    initialValue: _staffId ?? '',
                    decoration: const InputDecoration(labelText: 'Staff member'),
                    items: options,
                    onChanged: (value) {
                      setState(() => _staffId = value);
                      _loadSlots();
                    },
                  ),
                const SizedBox(height: 16),
                if (_loadingSlots) const Center(child: CircularProgressIndicator()),
                if (!_loadingSlots && _slots.isEmpty)
                  const Text('No times available on this date.'),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    for (final slot in _slots)
                      ChoiceChip(
                        label: Text(
                          '${slot.localLabel}\n${staffName(slot.staffId)}',
                          textAlign: TextAlign.center,
                        ),
                        selected: _selected == slot,
                        onSelected: (_) => setState(() => _selected = slot),
                      ),
                  ],
                ),
                const SizedBox(height: 20),
                TextField(
                  controller: _noteController,
                  maxLines: 3,
                  decoration: const InputDecoration(
                    labelText: 'Note to provider (optional)',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 20),
                FilledButton(
                  onPressed: _selected == null || _busy ? null : _book,
                  child: Text(_busy ? 'Booking…' : 'Book this time'),
                ),
                if (_error != null) ...[
                  const SizedBox(height: 12),
                  Text(_error!, style: TextStyle(color: Theme.of(context).colorScheme.error)),
                ],
              ],
            );
          },
        ),
      ),
    );

    return scaffold;
  }

  Widget _buildConfirmation(BookingView booking) {
    final pending = booking.status.value == 'pending';
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Text(
          pending ? 'Booking requested' : 'Booking confirmed',
          style: Theme.of(context).textTheme.headlineMedium,
        ),
        const SizedBox(height: 12),
        Text('${booking.priceSnapshot.serviceName} is ${booking.status.value}.'),
        if (pending) ...[
          const SizedBox(height: 8),
          const Text('The provider will review your request. We will notify you.'),
        ],
        const SizedBox(height: 24),
        FilledButton(
          onPressed: () => context.go('/bookings'),
          child: const Text('View my bookings'),
        ),
      ],
    );
  }
}
