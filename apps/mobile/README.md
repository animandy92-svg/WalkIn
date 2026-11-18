# WalkIn mobile app

Flutter customer app for iOS and Android. This is a source-only scaffold; the Flutter SDK is
required to run or validate it.

## Setup

1. Install the Flutter SDK (3.22 or newer).
2. From `apps/mobile`, run `flutter pub get`.
3. Run `flutterfire configure --project=walkin-123` to generate `lib/firebase_options.dart` and
   platform credentials, then pass those options to `Firebase.initializeApp` in `lib/main.dart`.
4. Run the Firebase emulators from the repository root (`npm run emulators`) and use the emulator
   helpers in the Flutter app during development.

The customer booking screens are implemented in milestone 4 against the shared callable API.
