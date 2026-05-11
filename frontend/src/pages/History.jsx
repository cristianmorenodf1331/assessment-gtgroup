import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MaturityBadge from '../components/MaturityBadge';
import { DOMAINS } from '../data/questions';

export default function History() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 10;

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/assessments?page=${page}&limit=${LIMIT}`)
      .then(r => {
        setAssessments(r.data.data);
        setTotal(r.data.total);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  const filtered = assessments.filter(a =>
    a.company_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.evaluator_name?.toLowerCase().includes(search.toLowerCase())
  );

  const domainKeys = [
    { code: 'GV', field: 'score_govern' },
    { code: 'ID', field: 'score_identify' },
    { code: 'PR', field: 'score_protect' },
    { code: 'DE', field: 'score_detect' },
    { code: 'RS', field: 'score_respond' },
    { code: 'RC', field: 'score_recover' },
  ];

  function ScoreMini({ score }) {
    const val = Number(score) || 0;
    const color = val < 2 ? '#ef4444' : val < 3 ? '#f59e0b' : '#10b981';
    return (
      <span className="text-xs font-bold font-mono" style={{ color }}>
        {val.toFixed(1)}
      </span>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Historial de Evaluaciones</h1>
          <p className="text-gtblue-200 text-sm mt-1">
            {total} evaluación{total !== 1 ? 'es' : ''} registrada{total !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/evaluacion" className="btn-primary">
          + Nueva Evaluación
        </Link>
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <input
          className="input-field max-w-sm"
          placeholder="🔍 Buscar por empresa o evaluador…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-gtblue-200">⏳ Cargando historial…</div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">📊</div>
          <div className="text-white font-semibold mb-2">No hay evaluaciones registradas</div>
          <div className="text-gtblue-200 text-sm mb-6">
            {search ? 'No se encontraron resultados para tu búsqueda.' : 'Comienza realizando la primera evaluación.'}
          </div>
          <Link to="/evaluacion" className="btn-primary">
            Iniciar primera evaluación
          </Link>
        </div>
      ) : (
        <>
          {/* Tabla */}
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gtblue-800 border-b border-gtblue-700">
                    <th className="text-left py-3 px-4 text-gtblue-200 font-medium">Empresa</th>
                    <th className="text-left py-3 px-4 text-gtblue-200 font-medium hidden md:table-cell">Evaluador</th>
                    <th className="text-left py-3 px-4 text-gtblue-200 font-medium hidden lg:table-cell">Fecha</th>
                    {domainKeys.map(d => (
                      <th key={d.code} className="text-center py-3 px-2 text-gtblue-200 font-medium hidden xl:table-cell w-12">
                        {d.code}
                      </th>
                    ))}
                    <th className="text-center py-3 px-4 text-gtblue-200 font-medium">Total</th>
                    <th className="text-center py-3 px-4 text-gtblue-200 font-medium">Nivel</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a, i) => (
                    <tr
                      key={a.id}
                      className={`border-b border-gtblue-800 hover:bg-gtblue-800/50 transition-colors ${
                        i % 2 === 0 ? '' : 'bg-gtblue-900/30'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-white">{a.company_name}</div>
                        {a.industry && (
                          <div className="text-xs text-gtblue-200">{a.industry}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gtblue-200 hidden md:table-cell">{a.evaluator_name}</td>
                      <td className="py-3 px-4 text-gtblue-200 hidden lg:table-cell text-xs">
                        {new Date(a.created_at).toLocaleDateString('es-CO')}
                      </td>
                      {domainKeys.map(d => (
                        <td key={d.code} className="py-3 px-2 text-center hidden xl:table-cell">
                          <ScoreMini score={a[d.field]} />
                        </td>
                      ))}
                      <td className="py-3 px-4 text-center font-bold text-white">
                        {Number(a.total_score).toFixed(1)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <MaturityBadge score={Number(a.total_score)} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Link
                          to={`/resultados/${a.id}`}
                          className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
                        >
                          Ver →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginación */}
          {total > LIMIT && (
            <div className="flex justify-center gap-3 mt-6">
              <button
                className="btn-secondary py-2 px-4 text-sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                ← Anterior
              </button>
              <span className="text-gtblue-200 text-sm self-center">
                Página {page} de {Math.ceil(total / LIMIT)}
              </span>
              <button
                className="btn-secondary py-2 px-4 text-sm"
                disabled={page * LIMIT >= total}
                onClick={() => setPage(p => p + 1)}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
