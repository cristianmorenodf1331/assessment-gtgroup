/**
 * db-init.js
 * Crea las tablas en PostgreSQL si no existen.
 * Ejecutar una sola vez: node db-init.js
 */
require('dotenv').config();
const pool = require('./db');

async function init() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ── Empresas ──────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id           SERIAL PRIMARY KEY,
        name         VARCHAR(200) NOT NULL,
        industry     VARCHAR(100),
        contact_name VARCHAR(150),
        contact_email VARCHAR(150),
        created_at   TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // ── Evaluaciones ──────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS assessments (
        id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id      INTEGER REFERENCES companies(id) ON DELETE CASCADE,
        evaluator_name  VARCHAR(150),
        created_at      TIMESTAMPTZ DEFAULT NOW(),
        score_govern    NUMERIC(4,2),
        score_identify  NUMERIC(4,2),
        score_protect   NUMERIC(4,2),
        score_detect    NUMERIC(4,2),
        score_respond   NUMERIC(4,2),
        score_recover   NUMERIC(4,2),
        total_score     NUMERIC(4,2),
        maturity_level  VARCHAR(50),
        observations    TEXT
      );
    `);

    // ── Respuestas por pregunta ───────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS assessment_answers (
        id            SERIAL PRIMARY KEY,
        assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
        question_id   VARCHAR(20) NOT NULL,
        domain_code   VARCHAR(10) NOT NULL,
        score         SMALLINT CHECK (score BETWEEN 0 AND 5),
        notes         TEXT,
        created_at    TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // ── Índices ───────────────────────────────────────────────────────────
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_assessments_company  ON assessments(company_id);
      CREATE INDEX IF NOT EXISTS idx_answers_assessment   ON assessment_answers(assessment_id);
    `);

    await client.query('COMMIT');
    console.log('✅  Base de datos inicializada correctamente.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌  Error al inicializar la base de datos:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

init();
