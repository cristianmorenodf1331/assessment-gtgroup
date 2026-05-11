/**
 * db-seed.js
 * Inserta una evaluación de ejemplo de GTGroup para demo.
 * Ejecutar: node db-seed.js
 */
require('dotenv').config();
const pool = require('./db');
const { v4: uuidv4 } = require('uuid');

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Empresa demo
    const compRes = await client.query(`
      INSERT INTO companies (name, industry, contact_name, contact_email)
      VALUES ($1,$2,$3,$4)
      ON CONFLICT DO NOTHING
      RETURNING id
    `, ['GTGroup Colombia', 'Servicios TI', 'Cristian Moreno', 'cristian@gtgroupcolombia.com']);

    let companyId;
    if (compRes.rows.length > 0) {
      companyId = compRes.rows[0].id;
    } else {
      const r = await client.query(`SELECT id FROM companies WHERE name='GTGroup Colombia' LIMIT 1`);
      companyId = r.rows[0].id;
    }

    // Evaluación demo con puntajes bajos (reflejando diagnóstico real de Fase 1)
    const assessId = uuidv4();
    await client.query(`
      INSERT INTO assessments
        (id, company_id, evaluator_name, score_govern, score_identify,
         score_protect, score_detect, score_respond, score_recover,
         total_score, maturity_level, observations)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    `, [
      assessId, companyId, 'Cristian David Moreno Forero',
      1.2, 1.4, 1.0, 0.8, 0.6, 0.8,
      1.0, 'Inicial',
      'Diagnóstico inicial de línea base – Fase 1 Proyecto de Grado UNAD 2026'
    ]);

    // Respuestas de ejemplo por dominio
    const sampleAnswers = [
      { q: 'GV-01', domain: 'GV', score: 1 }, { q: 'GV-02', domain: 'GV', score: 2 },
      { q: 'GV-03', domain: 'GV', score: 1 }, { q: 'GV-04', domain: 'GV', score: 1 },
      { q: 'GV-05', domain: 'GV', score: 1 },
      { q: 'ID-01', domain: 'ID', score: 2 }, { q: 'ID-02', domain: 'ID', score: 1 },
      { q: 'ID-03', domain: 'ID', score: 1 }, { q: 'ID-04', domain: 'ID', score: 2 },
      { q: 'ID-05', domain: 'ID', score: 1 },
      { q: 'PR-01', domain: 'PR', score: 0 }, { q: 'PR-02', domain: 'PR', score: 1 },
      { q: 'PR-03', domain: 'PR', score: 1 }, { q: 'PR-04', domain: 'PR', score: 2 },
      { q: 'PR-05', domain: 'PR', score: 1 }, { q: 'PR-06', domain: 'PR', score: 1 },
      { q: 'DE-01', domain: 'DE', score: 1 }, { q: 'DE-02', domain: 'DE', score: 1 },
      { q: 'DE-03', domain: 'DE', score: 0 }, { q: 'DE-04', domain: 'DE', score: 1 },
      { q: 'RS-01', domain: 'RS', score: 1 }, { q: 'RS-02', domain: 'RS', score: 0 },
      { q: 'RS-03', domain: 'RS', score: 1 }, { q: 'RS-04', domain: 'RS', score: 1 },
      { q: 'RC-01', domain: 'RC', score: 1 }, { q: 'RC-02', domain: 'RC', score: 1 },
      { q: 'RC-03', domain: 'RC', score: 0 }, { q: 'RC-04', domain: 'RC', score: 1 },
    ];

    for (const a of sampleAnswers) {
      await client.query(`
        INSERT INTO assessment_answers (assessment_id, question_id, domain_code, score)
        VALUES ($1,$2,$3,$4)
      `, [assessId, a.q, a.domain, a.score]);
    }

    await client.query('COMMIT');
    console.log('✅  Datos de ejemplo insertados. ID evaluación demo:', assessId);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌  Error en seed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
