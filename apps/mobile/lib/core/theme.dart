import 'package:flutter/material.dart';

final walkInTheme = ThemeData(
  colorSchemeSeed: const Color(0xFF1457D8),
  useMaterial3: true,
  appBarTheme: const AppBarTheme(centerTitle: false),
  cardTheme: CardThemeData(
    elevation: 0,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
  ),
  inputDecorationTheme: const InputDecorationTheme(
    border: OutlineInputBorder(),
  ),
  filledButtonTheme: FilledButtonThemeData(
    style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(48)),
  ),
);

Color statusColor(String status) {
  switch (status) {
    case 'confirmed':
    case 'completed':
      return const Color(0xFF1B7F4B);
    case 'pending':
      return const Color(0xFF9A6700);
    case 'rejected':
    case 'expired':
    case 'cancelled':
      return const Color(0xFFB3261E);
    default:
      return Colors.grey;
  }
}
