/**
 * server.js
 * Servidor Express – Plataforma de diagnóstico de ciberseguridad GTGroup
 * NIST CSF 2.0 | ISO/IEC 27001:2022 | TRL5
 */
require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const path       = require('path');

const assessmentRoutes = require('./routes/assessments');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Seguridad ─────────────────────────────────────────────────────────────────
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' }
});
app.use('/api/', limiter);

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CORS_ORIGIN || 'https://assessment.gtgroupcolombia.com',
  'http://localhost:5173',  // Vite dev
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('No permitido por CORS'));
  },
  credentials: true,
}));

// ── Body parser ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rutas API ─────────────────────────────────────────────────────────────────
app.use('/api/assessments', assessmentRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'assessment-gtgroup-api',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ── Servir frontend en producción ─────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(frontendDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// ── Manejo de errores ─────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ── Arrancar ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🔐 Assessment GTGroup API corriendo en puerto ${PORT}`);
  console.log(`   Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health:  http://localhost:${PORT}/api/health\n`);
});
