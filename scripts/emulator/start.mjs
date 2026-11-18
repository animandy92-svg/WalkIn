import { spawn } from 'node:child_process';

// Loading firebase-admin + firebase-functions on this machine takes ~11s, which
// exceeds the Functions emulator's 10s discovery timeout. Give it room to load.
process.env.FUNCTIONS_DISCOVERY_TIMEOUT =
  process.env.FUNCTIONS_DISCOVERY_TIMEOUT ?? '60';

const firebaseBin = process.platform === 'win32' ? 'firebase.cmd' : 'firebase';

const child = spawn(firebaseBin, [
  'emulators:start',
  '--project',
  'demo-walkin',
  '--config',
  'firebase.test.json',
  '--only',
  'auth,firestore,functions',
], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
