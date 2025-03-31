const { spawn } = require('child_process');
const path = require('path');

const start = spawn('npm', ['start'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    PORT: 3001,
    HOST: '127.0.0.1',
    BROWSER: 'none',
    HTTPS: 'false'
  }
});

start.on('error', (err) => {
  console.error('Failed to start the development server:', err);
});

start.on('close', (code) => {
  console.log(`Development server exited with code ${code}`);
}); 