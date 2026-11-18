import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(const WalkInApp());
}

class WalkInApp extends StatelessWidget {
  const WalkInApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'WalkIn',
      theme: ThemeData(colorSchemeSeed: const Color(0xFF1457D8), useMaterial3: true),
      home: const Scaffold(
        appBar: AppBar(title: Text('WalkIn')),
        body: Center(child: Text('Booking experience coming in milestone 4.')),
      ),
    );
  }
}
