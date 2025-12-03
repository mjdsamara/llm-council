import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8001';

app.use('/api', createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({
      error: 'Backend service unavailable',
      message: 'Please ensure the Python backend is running on port 8001'
    });
  }
}));

app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`LLM Council frontend server running on port ${PORT}`);
  console.log(`Proxying API requests to: ${BACKEND_URL}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
