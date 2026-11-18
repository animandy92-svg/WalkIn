// ignore_for_file: deprecated_member_use
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';

import 'firebase_options.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  runApp(const WalkInApp());
}

class WalkInApp extends StatelessWidget {
  const WalkInApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'WalkIn',
      theme: ThemeData(colorSchemeSeed: const Color(0xFF1457D8), useMaterial3: true),
      home: Scaffold(
        appBar: AppBar(title: const Text('WalkIn')),
        body: const Center(child: Text('Booking experience coming in milestone 4.')),
      ),
    );
  }
}
