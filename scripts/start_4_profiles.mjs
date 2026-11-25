import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '..', 'frontend');

const PROFILES = [
  {
    name: 'Super Administrator (Naman Saini)',
    role: 'system_admin',
    port: 5173,
    color: '\x1b[32m', // Green
    url: 'http://localhost:5173'
  },
  {
    name: 'Investigation Bureau (Vikram Rawat)',
    role: 'investigation_bureau',
    port: 5174,
    color: '\x1b[31m', // Red
    url: 'http://localhost:5174'
  },
  {
    name: 'Corporate Enterprise (Rajesh Singhania)',
    role: 'corporate_enterprise',
    port: 5175,
    color: '\x1b[33m', // Yellow
    url: 'http://localhost:5175'
  },
  {
    name: 'Journalist / Media (Pooja Kashyap)',
    role: 'journalist_media',
    port: 5176,
    color: '\x1b[36m', // Cyan
    url: 'http://localhost:5176'
  }
];

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

console.log(`${BOLD}======================================================================${RESET}`);
console.log(`${BOLD}🛡️  BHARAT-SHIELD SENTINEL — 4-PROFILE LOCALHOST CLUSTER LAUNCHER${RESET}`);
console.log(`${BOLD}======================================================================${RESET}`);
PROFILES.forEach((p, idx) => {
  console.log(`  ${p.color}[Node ${idx + 1}] Port ${p.port} -> ${p.name}${RESET}`);
  console.log(`         URL: ${p.color}${p.url}${RESET}`);
});
console.log(`${BOLD}======================================================================${RESET}\n`);

const isWindows = process.platform === 'win32';
const npxCmd = isWindows ? 'npx.cmd' : 'npx';

const children = [];

PROFILES.forEach((profile) => {
  const prefix = `${profile.color}[${profile.port} | ${profile.role}]${RESET}`;
  
  const child = spawn(npxCmd, ['vite', '--port', String(profile.port), '--strictPort'], {
    cwd: frontendDir,
    env: { ...process.env, FORCE_COLOR: '1' },
    shell: isWindows
  });

  child.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.log(`${prefix} ${line}`);
      }
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.error(`${prefix} ${line}`);
      }
    });
  });

  child.on('close', (code) => {
    console.log(`${prefix} Exited with code ${code}`);
  });

  children.push(child);
});

function cleanup() {
  console.log(`\n${BOLD}Shutting down all 4 localhost profile instances...${RESET}`);
  children.forEach((c) => {
    try {
      if (isWindows) {
        spawn('taskkill', ['/pid', String(c.pid), '/f', '/t']);
      } else {
        c.kill('SIGINT');
      }
    } catch {}
  });
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
