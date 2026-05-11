#!/bin/bash
# ──────────────────────────────────────────────────────────────────────────────
#  setup.sh – Instalación completa en Ubuntu Server 22.04
#  Plataforma assessment.gtgroupcolombia.com
#  Ejecutar como: sudo bash setup.sh
# ──────────────────────────────────────────────────────────────────────────────
set -e  # Detener ante cualquier error

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()    { echo -e "${GREEN}[INFO]${NC} $1"; }
warning() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ── Variables ─────────────────────────────────────────────────────────────────
APP_DIR="/var/www/assessment-gtgroup"
DOMAIN="assessment.gtgroupcolombia.com"
DB_NAME="assessment_gtgroup"
DB_USER="gtgroup"
DB_PASS="$(openssl rand -base64 24)"   # contraseña aleatoria
PM2_LOG_DIR="/var/log/pm2"

info "=== Iniciando instalación de assessment.gtgroupcolombia.com ==="
info "Directorio de instalación: $APP_DIR"
echo ""

# ── 1. Actualizar sistema ─────────────────────────────────────────────────────
info "1/9 Actualizando sistema..."
apt-get update -qq && apt-get upgrade -y -qq

# ── 2. Instalar dependencias del sistema ──────────────────────────────────────
info "2/9 Instalando dependencias del sistema..."
apt-get install -y -qq \
    curl wget git unzip nginx certbot python3-certbot-nginx \
    postgresql postgresql-contrib ufw

# ── 3. Instalar Node.js 20 LTS ────────────────────────────────────────────────
info "3/9 Instalando Node.js 20 LTS..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
node -v && npm -v
info "Node.js instalado: $(node -v)"

# ── 4. Instalar PM2 ───────────────────────────────────────────────────────────
info "4/9 Instalando PM2..."
npm install -g pm2 --quiet
mkdir -p $PM2_LOG_DIR

# ── 5. Configurar PostgreSQL ──────────────────────────────────────────────────
info "5/9 Configurando PostgreSQL..."
systemctl start postgresql
systemctl enable postgresql

sudo -u postgres psql <<EOF
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DB_USER') THEN
    CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
  END IF;
END
\$\$;
CREATE DATABASE IF NOT EXISTS $DB_NAME OWNER $DB_USER;
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOF

warning "→ Contraseña de PostgreSQL generada: $DB_PASS"
warning "→ GUARDA esta contraseña en un lugar seguro!"

# ── 6. Configurar aplicación ──────────────────────────────────────────────────
info "6/9 Configurando la aplicación..."
mkdir -p $APP_DIR
cd $APP_DIR

# Crear .env si no existe
if [ ! -f "$APP_DIR/backend/.env" ]; then
    cat > "$APP_DIR/backend/.env" <<ENVFILE
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASS=$DB_PASS
CORS_ORIGIN=https://$DOMAIN
NODE_ENV=production
ENVFILE
    info ".env creado con la configuración de producción"
fi

# Instalar dependencias backend
info "Instalando dependencias del backend..."
cd "$APP_DIR/backend" && npm install --production --quiet

# Inicializar base de datos
info "Inicializando esquema de base de datos..."
node db-init.js

# Construir frontend
info "Construyendo frontend React..."
cd "$APP_DIR/frontend"
npm install --quiet
npm run build

# ── 7. Configurar Nginx ───────────────────────────────────────────────────────
info "7/9 Configurando Nginx..."
cp "$APP_DIR/nginx/assessment.gtgroupcolombia.com.conf" \
   "/etc/nginx/sites-available/$DOMAIN"
ln -sf "/etc/nginx/sites-available/$DOMAIN" \
       "/etc/nginx/sites-enabled/$DOMAIN"

# Deshabilitar sitio default si existe
if [ -f "/etc/nginx/sites-enabled/default" ]; then
    rm -f /etc/nginx/sites-enabled/default
fi

nginx -t && systemctl reload nginx
info "Nginx configurado y recargado"

# ── 8. Firewall ───────────────────────────────────────────────────────────────
info "8/9 Configurando firewall UFW..."
ufw --force enable
ufw allow ssh
ufw allow 'Nginx Full'
ufw delete allow 'Nginx HTTP' 2>/dev/null || true

# ── 9. Arrancar con PM2 ───────────────────────────────────────────────────────
info "9/9 Iniciando aplicación con PM2..."
cd "$APP_DIR"
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup systemd -u root --hp /root | tail -1 | bash 2>/dev/null || true

# ── Resumen ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅  Instalación completada exitosamente                   ║${NC}"
echo -e "${GREEN}╠════════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  App:        $APP_DIR                      ║${NC}"
echo -e "${GREEN}║  Base datos: $DB_NAME (usuario: $DB_USER)   ║${NC}"
echo -e "${GREEN}║  PM2:        pm2 status                                    ║${NC}"
echo -e "${GREEN}║  Logs:       pm2 logs assessment-gtgroup                   ║${NC}"
echo -e "${GREEN}╠════════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  SIGUIENTE PASO:                                           ║${NC}"
echo -e "${GREEN}║  sudo certbot --nginx -d $DOMAIN   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
warning "Contraseña DB: $DB_PASS  ← guárdala ahora"
