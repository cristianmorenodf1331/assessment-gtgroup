import { Link } from 'react-router-dom';
import { DOMAINS } from '../data/questions';

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center gap-2 bg-gtblue-800 border border-gtblue-600 rounded-full px-4 py-2 text-sm text-gtblue-200 mb-8">
          <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse-slow" />
          Plataforma activa · NIST CSF 2.0 · TRL5
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Diagnóstico de<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Ciberseguridad
          </span>
        </h1>

        <p className="text-gtblue-200 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Evalúa la madurez de las prácticas de ciberseguridad de tu organización
          con base en los seis dominios del <strong className="text-white">NIST CSF 2.0</strong> y
          los controles de <strong className="text-white">ISO/IEC 27001:2022</strong>.
          Obtén un informe de brechas con recomendaciones priorizadas.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/evaluacion" className="btn-primary text-center">
            🚀 Iniciar Evaluación
          </Link>
          <Link to="/historial" className="btn-secondary text-center">
            📊 Ver Historial
          </Link>
        </div>
      </div>

      {/* Dominios NIST CSF 2.0 */}
      <div className="mb-16">
        <h2 className="text-xl font-semibold text-white text-center mb-8">
          Los 6 dominios evaluados del NIST CSF 2.0
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {DOMAINS.map(domain => (
            <div
              key={domain.code}
              className="card hover:border-gtblue-500 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: domain.color + '22' }}
                >
                  {domain.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-mono font-bold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: domain.color + '33', color: domain.color }}
                    >
                      {domain.code}
                    </span>
                    <span className="font-semibold text-white text-sm">{domain.name}</span>
                  </div>
                  <p className="text-gtblue-200 text-xs leading-relaxed">{domain.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="text-xs text-gtblue-200 opacity-60">{domain.nist_ref}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escala de madurez */}
      <div className="card mb-16">
        <h2 className="text-lg font-semibold text-white mb-6 text-center">
          Escala de Madurez (0 – 5)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { score: 0, label: 'No Existe',   color: '#ef4444', desc: 'Sin prácticas reconocibles' },
            { score: 1, label: 'Inicial',     color: '#f97316', desc: 'Reactivo e inconsistente' },
            { score: 2, label: 'Definido',    color: '#f59e0b', desc: 'Documentado, parcial' },
            { score: 3, label: 'Implementado',color: '#84cc16', desc: 'Consistente y operativo' },
            { score: 4, label: 'Medido',      color: '#10b981', desc: 'Controlado y medido' },
            { score: 5, label: 'Optimizado',  color: '#06b6d4', desc: 'Mejora continua' },
          ].map(m => (
            <div key={m.score} className="text-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-2"
                style={{ backgroundColor: m.color + '22', color: m.color, border: `2px solid ${m.color}44` }}
              >
                {m.score}
              </div>
              <div className="font-semibold text-white text-sm">{m.label}</div>
              <div className="text-gtblue-200 text-xs mt-1">{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA final */}
      <div className="text-center py-8 bg-gtblue-900 rounded-2xl border border-gtblue-700 mb-8">
        <h3 className="text-2xl font-bold text-white mb-3">¿Listo para conocer tu postura de seguridad?</h3>
        <p className="text-gtblue-200 mb-6 max-w-lg mx-auto">
          La evaluación toma aproximadamente 15–20 minutos y genera un informe completo con gráfico de radar y recomendaciones priorizadas.
        </p>
        <Link to="/evaluacion" className="btn-primary">
          🚀 Comenzar Evaluación
        </Link>
      </div>

      {/* Footer */}
      <footer className="text-center text-gtblue-200 text-xs py-6 border-t border-gtblue-800">
        <p>Proyecto de Grado · Cristian David Moreno Forero · UNAD 2026</p>
        <p className="mt-1">Ingeniería de Sistemas · ECBTI · Basado en NIST CSF 2.0 e ISO/IEC 27001:2022</p>
      </footer>
    </div>
  );
}
