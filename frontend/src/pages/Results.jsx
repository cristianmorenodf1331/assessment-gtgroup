import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import RadarChart from '../components/RadarChart';
import MaturityBadge from '../components/MaturityBadge';
import { DOMAINS, MATURITY_LABELS, MATURITY_COLORS, calcOverallMaturity, generateRecommendations } from '../data/questions';

export default function Results() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const printRef = useRef();

  useEffect(() => {
    axios.get(`/api/assessments/${id}`)
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => { setError('No se pudo cargar la evaluación.'); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-spin-slow">⏳</div>
        <div className="text-gtblue-200">Cargando resultados…</div>
      </div>
    </div>
  );

  if (error || !data) return (
    <div className="card text-center py-16">
      <div className="text-4xl mb-4">❌</div>
      <div className="text-red-400 mb-4">{error}</div>
      <Link to="/" className="btn-secondary">Volver al inicio</Link>
    </div>
  );

  const scores = {
    GV: Number(data.score_govern)  || 0,
    ID: Number(data.score_identify) || 0,
    PR: Number(data.score_protect) || 0,
    DE: Number(data.score_detect)  || 0,
    RS: Number(data.score_respond) || 0,
    RC: Number(data.score_recover) || 0,
  };
  const totalScore = Number(data.total_score) || 0;
  const maturity = calcOverallMaturity(totalScore);
  const recommendations = generateRecommendations(scores);

  const domainOrder = ['GV','ID','PR','DE','RS','RC'];

  function getScoreColor(score) {
    if (score < 1) return '#ef4444';
    if (score < 2) return '#f97316';
    if (score < 3) return '#f59e0b';
    if (score < 4) return '#84cc16';
    if (score < 4.5) return '#10b981';
    return '#06b6d4';
  }

  return (
    <div className="animate-fade-in" ref={printRef}>
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-gtblue-200 text-sm mb-1">Informe de Diagnóstico de Ciberseguridad</div>
          <h1 className="text-2xl font-bold text-white">{data.company_name}</h1>
          <div className="text-gtblue-200 text-sm mt-1">
            Evaluado por {data.evaluator_name} ·{' '}
            {new Date(data.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="btn-secondary text-sm py-2 px-4"
          >
            🖨️ Imprimir informe
          </button>
          <Link to="/evaluacion" className="btn-primary text-sm py-2 px-4">
            + Nueva evaluación
          </Link>
        </div>
      </div>

      {/* Puntaje global */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card md:col-span-1 flex flex-col items-center justify-center py-8 text-center">
          <div className="text-6xl font-bold mb-3" style={{ color: maturity.color }}>
            {totalScore.toFixed(1)}
          </div>
          <div className="text-gtblue-200 text-sm mb-3">de 5.0 puntos</div>
          <MaturityBadge score={totalScore} size="lg" />
          <p className="text-gtblue-200 text-xs mt-4 leading-relaxed max-w-[200px]">
            {maturity.description}
          </p>
        </div>

        {/* Radar chart */}
        <div className="card md:col-span-2">
          <h3 className="font-semibold text-white mb-4 text-center">Radar de Madurez por Dominio</h3>
          <RadarChart scores={scores} />
        </div>
      </div>

      {/* Puntuación por dominio */}
      <div className="card mb-8">
        <h3 className="font-semibold text-white mb-6">Puntuación por Dominio NIST CSF 2.0</h3>
        <div className="space-y-4">
          {domainOrder.map(code => {
            const domain = DOMAINS.find(d => d.code === code);
            const score = scores[code];
            const pct = (score / 5) * 100;
            const color = getScoreColor(score);

            return (
              <div key={code} className="flex items-center gap-4">
                <div className="w-28 flex items-center gap-2 flex-shrink-0">
                  <span className="text-lg">{domain.icon}</span>
                  <div>
                    <div className="text-xs font-mono text-gtblue-200">{code}</div>
                    <div className="text-sm font-medium text-white leading-tight">{domain.name}</div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="score-bar">
                    <div
                      className="score-bar-fill"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 w-28 text-right">
                  <span className="text-sm font-bold" style={{ color }}>{score.toFixed(2)}</span>
                  <span className="text-xs text-gtblue-200">/ 5</span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-medium"
                    style={{ backgroundColor: color + '22', color }}
                  >
                    {MATURITY_LABELS[Math.round(score)]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brechas y recomendaciones */}
      {recommendations.length > 0 && (
        <div className="card mb-8">
          <h3 className="font-semibold text-white mb-2">
            🚨 Brechas Críticas Identificadas
          </h3>
          <p className="text-gtblue-200 text-sm mb-6">
            Los siguientes dominios presentan un nivel de madurez inferior a 3 (Implementado) y requieren atención prioritaria:
          </p>
          <div className="space-y-4">
            {recommendations.map((rec, i) => {
              const domain = DOMAINS.find(d => d.code === rec.domain);
              const color = getScoreColor(rec.score);
              return (
                <div
                  key={rec.domain}
                  className="flex gap-4 p-4 rounded-xl border"
                  style={{ borderColor: color + '44', backgroundColor: color + '0a' }}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: color + '22', color }}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{domain.icon}</span>
                      <span className="font-semibold text-white">{domain.name}</span>
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: color + '22', color }}>
                        {rec.score.toFixed(1)} / 5
                      </span>
                    </div>
                    <p className="text-gtblue-200 text-sm leading-relaxed">{rec.recommendation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabla resumen */}
      <div className="card mb-8">
        <h3 className="font-semibold text-white mb-4">Resumen Ejecutivo</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gtblue-700">
                <th className="text-left py-2 px-3 text-gtblue-200 font-medium">Dominio</th>
                <th className="text-center py-2 px-3 text-gtblue-200 font-medium">Código</th>
                <th className="text-center py-2 px-3 text-gtblue-200 font-medium">Puntaje</th>
                <th className="text-center py-2 px-3 text-gtblue-200 font-medium">Nivel</th>
                <th className="text-center py-2 px-3 text-gtblue-200 font-medium">Prioridad</th>
              </tr>
            </thead>
            <tbody>
              {domainOrder.map(code => {
                const domain = DOMAINS.find(d => d.code === code);
                const score = scores[code];
                const color = getScoreColor(score);
                const priority = score < 2 ? '🔴 Alta' : score < 3 ? '🟡 Media' : '🟢 Baja';
                return (
                  <tr key={code} className="border-b border-gtblue-800 hover:bg-gtblue-800/50">
                    <td className="py-2.5 px-3 text-white">{domain.icon} {domain.name}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-xs text-gtblue-200">{code}</td>
                    <td className="py-2.5 px-3 text-center font-bold" style={{ color }}>{score.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: color + '22', color }}>
                        {MATURITY_LABELS[Math.round(score)]}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center text-xs">{priority}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pie del informe */}
      <div className="text-center py-6 text-xs text-gtblue-200 border-t border-gtblue-800">
        <p>ID de evaluación: <span className="font-mono">{id}</span></p>
        <p className="mt-1">Generado por assessment.gtgroupcolombia.com · NIST CSF 2.0 · ISO/IEC 27001:2022</p>
        <p className="mt-1">Proyecto de Grado · Cristian David Moreno Forero · UNAD 2026</p>
      </div>
    </div>
  );
}
