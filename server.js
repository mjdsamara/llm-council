import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

let pythonProcess = null;

function startPythonBackend() {
  console.log('Starting Python backend...');

  pythonProcess = spawn('python', ['-m', 'backend.main'], {
    cwd: __dirname,
    env: { ...process.env, PORT: '8001' },
    stdio: 'inherit'
  });

  pythonProcess.on('error', (err) => {
    console.error('Failed to start Python backend:', err);
  });

  pythonProcess.on('exit', (code) => {
    console.log(`Python backend exited with code ${code}`);
  });
}

app.use('/api', async (req, res) => {
  try {
    const response = await fetch(`http://localhost:8001${req.url}`, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Backend service unavailable' });
  }
});

app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

startPythonBackend();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`Backend API: http://localhost:8001`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  if (pythonProcess) {
    pythonProcess.kill();
  }
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  if (pythonProcess) {
    pythonProcess.kill();
  }
  process.exit(0);
});
