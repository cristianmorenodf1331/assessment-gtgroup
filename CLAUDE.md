# assessment-gtgroup — CLAUDE.md

Plataforma web de diagnóstico de ciberseguridad para **GTGroup Colombia**.  
Proyecto de Grado · Cristian David Moreno Forero · UNAD 2026 · ECBTI

---

## Qué hace este proyecto

Evalúa el nivel de madurez de ciberseguridad de una organización basándose en los
**6 dominios del NIST CSF 2.0** (Gobernar, Identificar, Proteger, Detectar, Responder, Recuperar)
y los controles de **ISO/IEC 27001:2022**.

Genera un informe visual con gráfico de radar, puntaje por dominio, brechas críticas
y recomendaciones priorizadas. Nivel tecnológico TRL5.

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│  Nginx (reverse proxy + SSL Let's Encrypt)              │
│  assessment.gtgroupcolombia.com                         │
├────────────────────────┬────────────────────────────────┤
│  Frontend              │  Backend API                   │
│  React + Vite          │  Express.js (puerto 3001)      │
│  Tailwind CSS          │  Gestionado por PM2            │
│  Recharts (radar)      │                                │
├────────────────────────┴────────────────────────────────┤
│  PostgreSQL · Base de datos: assessment_gtgroup         │
└─────────────────────────────────────────────────────────┘
```

**Rutas del servidor:**
- `/var/www/assessment-gtgroup/` — raíz del proyecto
- `/var/www/assessment-gtgroup/frontend/dist/` — build estático (servido por Nginx)
- `/var/www/assessment-gtgroup/backend/` — API Node.js

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS 3 + Recharts |
| Backend | Node.js 20 + Express 4 + Helmet + CORS |
| Base de datos | PostgreSQL 14+ |
| Proceso manager | PM2 |
| Web server | Nginx |
| SSL | Let's Encrypt (Certbot) |

---

## Comandos frecuentes

### Estado de la aplicación
```bash
pm2 status
pm2 logs assessment-gtgroup --lines 50
pm2 monit
```

### Reiniciar la aplicación
```bash
pm2 restart assessment-gtgroup
```

### Ver logs de Nginx
```bash
tail -f /var/log/nginx/assessment.access.log
tail -f /var/log/nginx/assessment.error.log
```

### Verificar base de datos
```bash
psql -U gtgroup -d assessment_gtgroup -c "\dt"
psql -U gtgroup -d assessment_gtgroup -c "SELECT COUNT(*) FROM assessments;"
```

### Reconstruir frontend (después de cambios)
```bash
cd /var/www/assessment-gtgroup/frontend
npm run build
```

### Recargar Nginx
```bash
sudo nginx -t && sudo systemctl reload nginx
```

### Renovar certificado SSL
```bash
sudo certbot renew --dry-run
```

---

## Variables de entorno (.env en backend/)

```
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=assessment_gtgroup
DB_USER=gtgroup
DB_PASS=<contraseña generada en setup.sh>
CORS_ORIGIN=https://assessment.gtgroupcolombia.com
NODE_ENV=production
```

---

## API Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Estado del servidor |
| GET | `/api/assessments` | Listar evaluaciones (paginado) |
| GET | `/api/assessments/:id` | Detalle de evaluación + respuestas |
| POST | `/api/assessments` | Crear nueva evaluación |
| GET | `/api/assessments/company/:name` | Historial por empresa |

### Ejemplo POST /api/assessments
```json
{
  "company": {
    "name": "GTGroup Colombia",
    "industry": "Servicios TI"
  },
  "evaluator_name": "Cristian Moreno",
  "answers": [
    { "question_id": "GV-01", "domain_code": "GV", "score": 2 },
    { "question_id": "GV-02", "domain_code": "GV", "score": 1 }
  ]
}
```

---

## Despliegue por primera vez

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/assessment-gtgroup.git /var/www/assessment-gtgroup

# 2. Instalar todo (como root)
sudo bash /var/www/assessment-gtgroup/deploy/setup.sh

# 3. Certificado SSL (después de que el DNS apunte al servidor)
sudo certbot --nginx -d assessment.gtgroupcolombia.com

# 4. (Opcional) Cargar datos de ejemplo
cd /var/www/assessment-gtgroup/backend
node db-seed.js
```

---

## Actualización del proyecto

```bash
cd /var/www/assessment-gtgroup
git pull origin main

# Reconstruir frontend si hubo cambios en frontend/
cd frontend && npm run build && cd ..

# Reiniciar backend si hubo cambios en backend/
pm2 restart assessment-gtgroup
```

---

## Estructura de archivos

```
assessment-gtgroup/
├── backend/
│   ├── server.js          ← Entrada principal Express
│   ├── db.js              ← Pool de conexión PostgreSQL
│   ├── db-init.js         ← Crea tablas (ejecutar 1 sola vez)
│   ├── db-seed.js         ← Datos de ejemplo para demo
│   ├── routes/
│   │   └── assessments.js ← Rutas CRUD de evaluaciones
│   └── .env               ← Variables de entorno (NO en git)
├── frontend/
│   ├── src/
│   │   ├── App.jsx         ← Router principal
│   │   ├── data/
│   │   │   └── questions.js ← 28 preguntas NIST CSF 2.0
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Assessment.jsx ← Formulario paso a paso
│   │   │   ├── Results.jsx    ← Radar + informe de brechas
│   │   │   └── History.jsx    ← Historial de evaluaciones
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       ├── RadarChart.jsx ← Gráfico de radar (Recharts)
│   │       └── MaturityBadge.jsx
│   └── dist/              ← Build de producción (generado)
├── nginx/
│   └── assessment.gtgroupcolombia.com.conf
├── deploy/
│   └── setup.sh           ← Script de instalación Ubuntu 22.04
├── ecosystem.config.js    ← Configuración PM2
├── CLAUDE.md              ← Este archivo
└── .gitignore
```

---

## Escala de madurez (NIST CSF 2.0)

| Nivel | Descripción |
|---|---|
| 0 – No Existe | Sin prácticas reconocibles |
| 1 – Inicial | Reactivo, ad hoc, inconsistente |
| 2 – Definido | Documentado pero implementación parcial |
| 3 – Implementado | Consistente y operativo |
| 4 – Medido | Controlado, métricas definidas |
| 5 – Optimizado | Mejora continua, parte del ADN org. |

---

## Notas para Claude Code

- El backend **no debe** arrancar en el puerto 3001 si ya está ocupado; verificar con `lsof -i :3001`.
- Las migraciones son aditivas: `db-init.js` usa `CREATE TABLE IF NOT EXISTS`.
- Los cambios al frontend requieren `npm run build` antes de verse en producción.
- PM2 gestiona reinicios automáticos; no usar `node server.js` directo en producción.
- Los logs de errores más relevantes están en `/var/log/pm2/assessment-err.log`.
