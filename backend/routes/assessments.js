/**
 * routes/assessments.js
 * Endpoints REST para gestión de evaluaciones de ciberseguridad.
 */
const express  = require('express');
const router   = express.Router();
const pool     = require('../db');
const { v4: uuidv4 } = require('uuid');

// ── Helpers ──────────────────────────────────────────────────────────────────

function calcMaturityLevel(score) {
  if (score < 1)   return 'No Existente';
  if (score < 2)   return 'Inicial';
  if (score < 3)   return 'Definido';
  if (score < 4)   return 'Implementado';
  if (score < 4.5) return 'Medido';
  return 'Optimizado';
}

function avgByDomain(answers, domainCode) {
  const filtered = answers.filter(a => a.domain_code === domainCode);
  if (!filtered.length) return 0;
  return filtered.reduce((s, a) => s + Number(a.score), 0) / filtered.length;
}

// ── GET /api/assessments ──────────────────────────────────────────────────────
// Lista todas las evaluaciones (paginado)
router.get('/', async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page  || '1'));
    const limit = Math.min(50, parseInt(req.query.limit || '20'));
    const offset = (page - 1) * limit;

    const { rows } = await pool.query(`
      SELECT
        a.id, a.created_at, a.evaluator_name,
        a.total_score, a.maturity_level,
        a.score_govern, a.score_identify, a.score_protect,
        a.score_detect, a.score_respond, a.score_recover,
        c.name AS company_name, c.industry
      FROM assessments a
      JOIN companies c ON c.id = a.company_id
      ORDER BY a.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    const countRes = await pool.query('SELECT COUNT(*) FROM assessments');
    const total = parseInt(countRes.rows[0].count);

    res.json({ data: rows, total, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener evaluaciones' });
  }
});

// ── GET /api/assessments/:id ──────────────────────────────────────────────────
// Detalle de una evaluación con todas sus respuestas
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        a.*, c.name AS company_name, c.industry,
        c.contact_name, c.contact_email
      FROM assessments a
      JOIN companies c ON c.id = a.company_id
      WHERE a.id = $1
    `, [req.params.id]);

    if (!rows.length) return res.status(404).json({ error: 'Evaluación no encontrada' });

    const answers = await pool.query(`
      SELECT question_id, domain_code, score, notes
      FROM assessment_answers
      WHERE assessment_id = $1
      ORDER BY question_id
    `, [req.params.id]);

    res.json({ ...rows[0], answers: answers.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener la evaluación' });
  }
});

// ── POST /api/assessments ─────────────────────────────────────────────────────
// Crea una nueva evaluación
router.post('/', async (req, res) => {
  const { company, evaluator_name, answers, observations } = req.body;

  if (!company?.name || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Datos incompletos: company.name y answers son requeridos' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Upsert empresa
    let companyId;
    const compRes = await client.query(
      `SELECT id FROM companies WHERE LOWER(name) = LOWER($1) LIMIT 1`,
      [company.name]
    );
    if (compRes.rows.length > 0) {
      companyId = compRes.rows[0].id;
    } else {
      const ins = await client.query(
        `INSERT INTO companies (name, industry, contact_name, contact_email)
         VALUES ($1,$2,$3,$4) RETURNING id`,
        [company.name, company.industry || null, company.contact_name || null, company.contact_email || null]
      );
      companyId = ins.rows[0].id;
    }

    // Calcular puntajes por dominio
    const domains = ['GV','ID','PR','DE','RS','RC'];
    const scores = {};
    for (const d of domains) {
      scores[d] = avgByDomain(answers, d);
    }
    const totalScore = Object.values(scores).reduce((s, v) => s + v, 0) / domains.length;
    const maturityLevel = calcMaturityLevel(totalScore);

    // Insertar evaluación
    const assessId = uuidv4();
    await client.query(`
      INSERT INTO assessments
        (id, company_id, evaluator_name, score_govern, score_identify,
         score_protect, score_detect, score_respond, score_recover,
         total_score, maturity_level, observations)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    `, [
      assessId, companyId, evaluator_name || 'Anónimo',
      scores.GV, scores.ID, scores.PR, scores.DE, scores.RS, scores.RC,
      totalScore, maturityLevel, observations || null
    ]);

    // Insertar respuestas individuales
    for (const a of answers) {
      await client.query(`
        INSERT INTO assessment_answers (assessment_id, question_id, domain_code, score, notes)
        VALUES ($1,$2,$3,$4,$5)
      `, [assessId, a.question_id, a.domain_code, a.score, a.notes || null]);
    }

    await client.query('COMMIT');

    res.status(201).json({
      id: assessId,
      total_score: Math.round(totalScore * 100) / 100,
      maturity_level: maturityLevel,
      scores: {
        govern:   Math.round(scores.GV * 100) / 100,
        identify: Math.round(scores.ID * 100) / 100,
        protect:  Math.round(scores.PR * 100) / 100,
        detect:   Math.round(scores.DE * 100) / 100,
        respond:  Math.round(scores.RS * 100) / 100,
        recover:  Math.round(scores.RC * 100) / 100,
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Error al guardar la evaluación' });
  } finally {
    client.release();
  }
});

// ── GET /api/assessments/company/:name ───────────────────────────────────────
// Historial de evaluaciones de una empresa
router.get('/company/:name', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        a.id, a.created_at, a.evaluator_name,
        a.total_score, a.maturity_level,
        a.score_govern, a.score_identify, a.score_protect,
        a.score_detect, a.score_respond, a.score_recover
      FROM assessments a
      JOIN companies c ON c.id = a.company_id
      WHERE LOWER(c.name) LIKE LOWER($1)
      ORDER BY a.created_at DESC
    `, [`%${req.params.name}%`]);

    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al buscar evaluaciones' });
  }
});

module.exports = router;
