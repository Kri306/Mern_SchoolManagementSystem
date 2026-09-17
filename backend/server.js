const { fork } = require('child_process');
const path = require('path');

const services = [
  { name: 'Super Admin API', script: 'super-admin-api.js' },
  { name: 'School Admin API', script: 'school-admin-api.js' },
  { name: 'Staff API', script: 'staff-api.js' },
  { name: 'Student/Parent API', script: 'student-parent-api.js' }
];

const children = [];

console.log('Starting all backend API services...');

services.forEach(service => {
  const scriptPath = path.join(__dirname, service.script);
  
  const child = fork(scriptPath, [], {
    stdio: ['inherit', 'pipe', 'pipe', 'ipc']
  });

  child.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      console.log(`[${service.name}] ${line}`);
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      console.error(`[${service.name}] [ERROR] ${line}`);
    });
  });

  child.on('error', (err) => {
    console.error(`[${service.name}] Failed to start:`, err);
  });

  child.on('close', (code) => {
    console.log(`[${service.name}] exited with code ${code}`);
    // If one service exits, we should exit the parent process (or keep others running?)
    // Normally, exit so the user knows a service failed
    if (code !== 0 && code !== null) {
      console.error(`[${service.name}] crashed. Stopping all other services...`);
      killAllChildren();
      process.exit(code);
    }
  });

  children.push(child);
});

function killAllChildren() {
  children.forEach(child => {
    if (child.connected || !child.killed) {
      child.kill('SIGTERM');
    }
  });
}

// Handle termination signals to kill all child processes
process.on('SIGINT', () => {
  console.log('\nShutting down all services...');
  killAllChildren();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down all services...');
  killAllChildren();
  process.exit(0);
});
