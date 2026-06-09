const { spawn } = require('child_process');
const path = require('path');

const backendDir = path.join(__dirname, 'backend');

const child = spawn('node', ['app.js'], {
  cwd: backendDir,
  stdio: ['inherit', 'inherit', 'inherit'],
  shell: true
});

child.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
  // 自动重启
  if (code !== 0) {
    console.log('Restarting backend...');
    setTimeout(() => {
      require('./start-backend');
    }, 3000);
  }
});

console.log('Backend service started. Press Ctrl+C to stop.');

// 保持进程运行
process.stdin.resume();