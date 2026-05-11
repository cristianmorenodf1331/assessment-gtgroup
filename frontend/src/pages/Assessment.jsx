import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DOMAINS, QUESTIONS, MATURITY_LABELS, MATURITY_COLORS } from '../data/questions';

const TOTAL_STEPS = DOMAINS.length + 1; // 1 paso de info empresa + 6 dominios

export default function Assessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 = info, 1-6 = dominios
  const [company, setCompany] = useState({ name: '', industry: '', contact_name: '', contact_email: '' });
  const [evaluatorName, setEvaluatorName] = useState('');
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentDomain = step > 0 ? DOMAINS[step - 1] : null;
  const currentQuestions = currentDomain
    ? QUESTIONS.filter(q => q.domain_code === currentDomain.code)
    : [];

  const progressPct = Math.round((step / TOTAL_STEPS) * 100);

  function handleScore(questionId, domainCode, score) {
    setAnswers(prev => ({ ...prev, [questionId]: { question_id: questionId, domain_code: domainCode, score } }));
  }

  function isStepComplete() {
    if (step === 0) return company.name.trim().length > 0 && evaluatorName.trim().length > 0;
    return currentQuestions.every(q => answers[q.id] !== undefined);
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');
    try {
      const payload = {
        company,
        evaluator_name: evaluatorName,
        answers: Object.values(answers),
        observations: '',
      };
      const { data } = await axios.post('/api/assessments', payload);
      navigate(`/resultados/${data.id}`);
    } catch (err) {
      setError('Error al guardar la evaluación. Verifica tu conexión y vuelve a intentarlo.');
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Barra de progreso */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gtblue-200 mb-2">
          <span>
            {step === 0 ? 'Información de la empresa' : `Dominio ${step}/${DOMAINS.length}: ${currentDomain?.name}`}
          </span>
          <span>{progressPct}% completado</span>
        </div>
        <div className="score-bar">
          <div className="score-bar-fill bg-blue-500" style={{ width: `${progressPct}%` }} />
        </div>
        {/* Indicadores de pasos */}
        <div className="flex gap-2 mt-3">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all ${
                i < step ? 'bg-blue-500' : i === step ? 'bg-blue-400 animate-pulse' : 'bg-gtblue-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Paso 0: Información de la empresa ────────────────────────────── */}
      {step === 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold text-white mb-2">Iniciar Evaluación</h2>
          <p className="text-gtblue-200 mb-8">
            Ingresa los datos de la organización que será evaluada. Esta información quedará registrada junto con los resultados del diagnóstico.
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gtblue-200 mb-2">
                Nombre de la empresa <span className="text-red-400">*</span>
              </label>
              <input
                className="input-field"
                placeholder="Ej: GTGroup Colombia"
                value={company.name}
                onChange={e => setCompany({ ...company, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gtblue-200 mb-2">Sector / Industria</label>
              <input
                className="input-field"
                placeholder="Ej: Servicios TI, Salud, Financiero…"
                value={company.industry}
                onChange={e => setCompany({ ...company, industry: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gtblue-200 mb-2">Nombre del contacto</label>
                <input
                  className="input-field"
                  placeholder="Nombre completo"
                  value={company.contact_name}
                  onChange={e => setCompany({ ...company, contact_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gtblue-200 mb-2">Correo del contacto</label>
                <input
                  className="input-field"
                  type="email"
                  placeholder="correo@empresa.com"
                  value={company.contact_email}
                  onChange={e => setCompany({ ...company, contact_email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gtblue-200 mb-2">
                Nombre del evaluador <span className="text-red-400">*</span>
              </label>
              <input
                className="input-field"
                placeholder="Quien realiza esta evaluación"
                value={evaluatorName}
                onChange={e => setEvaluatorName(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              className="btn-primary"
              disabled={!isStepComplete()}
              onClick={() => setStep(1)}
            >
              Comenzar Evaluación →
            </button>
          </div>
        </div>
      )}

      {/* ── Pasos 1-6: Preguntas por dominio ─────────────────────────────── */}
      {step > 0 && currentDomain && (
        <div className="card">
          {/* Encabezado del dominio */}
          <div className="flex items-start gap-4 mb-8 pb-6 border-b border-gtblue-700">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: currentDomain.color + '22' }}
            >
              {currentDomain.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs font-mono font-bold px-2 py-1 rounded"
                  style={{ backgroundColor: currentDomain.color + '33', color: currentDomain.color }}
                >
                  {currentDomain.code}
                </span>
                <h2 className="text-xl font-bold text-white">{currentDomain.name}</h2>
              </div>
              <p className="text-gtblue-200 text-sm">{currentDomain.description}</p>
              <div className="flex gap-3 mt-2 text-xs text-gtblue-200 opacity-70">
                <span>{currentDomain.nist_ref}</span>
                <span>·</span>
                <span>{currentDomain.iso_ref}</span>
              </div>
            </div>
          </div>

          {/* Preguntas */}
          <div className="space-y-8">
            {currentQuestions.map((q, idx) => (
              <div key={q.id} className="group">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-xs font-mono text-gtblue-200 mt-1 flex-shrink-0 w-12">{q.id}</span>
                  <p className="text-white font-medium leading-relaxed">{q.text}</p>
                </div>

                {q.help && (
                  <div className="ml-15 mb-3 ml-[60px] text-xs text-gtblue-200 bg-gtblue-800 rounded-lg px-3 py-2 flex items-start gap-2">
                    <span className="flex-shrink-0">💡</span>
                    <span>{q.help}</span>
                  </div>
                )}

                {/* Escala de puntuación */}
                <div className="ml-[60px] grid grid-cols-3 md:grid-cols-6 gap-2">
                  {[0, 1, 2, 3, 4, 5].map(score => {
                    const isSelected = answers[q.id]?.score === score;
                    return (
                      <button
                        key={score}
                        onClick={() => handleScore(q.id, q.domain_code, score)}
                        className={`group/btn flex flex-col items-center p-3 rounded-xl border-2 transition-all text-center ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gtblue-700 hover:border-gtblue-500 bg-gtblue-800/50'
                        }`}
                      >
                        <span
                          className="text-xl font-bold mb-1"
                          style={{ color: isSelected ? MATURITY_COLORS[score] : '#64748b' }}
                        >
                          {score}
                        </span>
                        <span className="text-xs leading-tight" style={{ color: isSelected ? MATURITY_COLORS[score] : '#64748b' }}>
                          {MATURITY_LABELS[score]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Navegación */}
          <div className="mt-8 pt-6 border-t border-gtblue-700 flex justify-between items-center">
            <button
              className="btn-secondary"
              onClick={() => setStep(s => s - 1)}
            >
              ← Anterior
            </button>

            <div className="text-sm text-gtblue-200">
              {currentQuestions.filter(q => answers[q.id] !== undefined).length} / {currentQuestions.length} respondidas
            </div>

            {step < DOMAINS.length ? (
              <button
                className="btn-primary"
                disabled={!isStepComplete()}
                onClick={() => setStep(s => s + 1)}
              >
                Siguiente →
              </button>
            ) : (
              <button
                className="btn-primary bg-emerald-600 hover:bg-emerald-500"
                disabled={!isStepComplete() || loading}
                onClick={handleSubmit}
              >
                {loading ? '⏳ Guardando...' : '✅ Ver Resultados'}
              </button>
            )}
          </div>

          {error && (
            <div className="mt-4 bg-red-900/30 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
