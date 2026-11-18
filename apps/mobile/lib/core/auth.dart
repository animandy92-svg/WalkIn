import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'firebase.dart';

/// Minimal user shape so widgets and tests never depend on Firebase's `User`.
class AppUser {
  const AppUser({required this.uid, required this.email});

  final String uid;
  final String email;

  @override
  bool operator ==(Object other) =>
      other is AppUser && other.uid == uid && other.email == email;

  @override
  int get hashCode => Object.hash(uid, email);
}

abstract class AuthController {
  Stream<AppUser?> watchUser();
  AppUser? get currentUser;
  Future<void> signIn(String email, String password);
  Future<void> createAccount(String email, String password);
  Future<void> signOut();
}

class FirebaseAuthController implements AuthController {
  FirebaseAuthController(this._auth);

  final FirebaseAuth _auth;

  @override
  Stream<AppUser?> watchUser() {
    return _auth.authStateChanges().map((user) {
      if (user == null) return null;
      return AppUser(uid: user.uid, email: user.email ?? '');
    });
  }

  @override
  AppUser? get currentUser {
    final user = _auth.currentUser;
    if (user == null) return null;
    return AppUser(uid: user.uid, email: user.email ?? '');
  }

  @override
  Future<void> signIn(String email, String password) {
    return _auth.signInWithEmailAndPassword(email: email, password: password);
  }

  @override
  Future<void> createAccount(String email, String password) {
    return _auth.createUserWithEmailAndPassword(email: email, password: password);
  }

  @override
  Future<void> signOut() => _auth.signOut();
}

final authControllerProvider = Provider<AuthController>((ref) {
  return FirebaseAuthController(ref.watch(firebaseAuthProvider));
});

final authStateProvider = StreamProvider<AppUser?>((ref) {
  return ref.watch(authControllerProvider).watchUser();
});
