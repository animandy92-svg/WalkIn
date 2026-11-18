import 'package:cloud_functions/cloud_functions.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:walkin_mobile/core/api.dart';
import 'package:walkin_mobile/core/api_client.dart';

/// End-to-end mobile flow against the local Firebase emulators.
///
/// Start the emulators and seed them first:
/// ```sh
/// npm run emulators:test
/// npm run emulator:seed
/// ```
///
/// Android emulator: `flutter test integration_test --dart-define=WALKIN_EMULATOR_HOST=10.0.2.2`
/// iOS simulator/macOS: `flutter test integration_test`
void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('customer can browse, book and cancel against the emulators', (tester) async {
    const host = String.fromEnvironment('WALKIN_EMULATOR_HOST', defaultValue: '127.0.0.1');
    const projectId = String.fromEnvironment('WALKIN_PROJECT_ID', defaultValue: 'demo-walkin');

    await Firebase.initializeApp(
      name: 'walkin-integration-test',
      options: const FirebaseOptions(
        apiKey: 'fake-api-key',
        appId: '1:000000000000:android:0000000000000000000000',
        messagingSenderId: '000000000000',
        projectId: projectId,
      ),
    );

    final auth = FirebaseAuth.instanceFor(app: Firebase.app('walkin-integration-test'));
    final functions = FirebaseFunctions.instanceFor(
      app: Firebase.app('walkin-integration-test'),
      region: 'us-central1',
    );
    await auth.useAuthEmulator(host, 9099);
    functions.useFunctionsEmulator(host, 5001);
    await auth.signInWithEmailAndPassword(
      email: 'customer0@walkin.test',
      password: 'password123',
    );

    final api = WalkInApi(ApiClient(functions));
    final providers = await api.listPublishedProviders();
    expect(providers, isNotEmpty);

    final details = await api.getProviderDetails(providerId: providers.first.id);
    expect(details.services, isNotEmpty);

    final service = details.services.firstWhere((item) => item.name == 'Instant Service');
    final slots = await api.getAvailability(
      providerId: details.provider.id,
      serviceId: service.id,
    );
    expect(slots, isNotEmpty);

    final booking = await api.createBooking(
      providerId: details.provider.id,
      serviceId: service.id,
      startUtc: slots.first.startUtc,
      idempotencyKey: 'mobile-integration-${DateTime.now().microsecondsSinceEpoch}',
    );
    expect(booking.status, 'confirmed');

    final bookings = await api.getMyBookings();
    expect(bookings.map((item) => item.id), contains(booking.id));

    final cancelled = await api.cancelBooking(booking.id);
    expect(cancelled.status, 'cancelled');

    await auth.signOut();
  }, timeout: const Timeout(Duration(minutes: 3)));
}
