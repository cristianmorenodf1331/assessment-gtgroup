/**
 * questions.js
 * Banco de preguntas basado en los 6 dominios del NIST CSF 2.0
 * Escala de madurez: 0=No existe, 1=Inicial, 2=Definido, 3=Implementado, 4=Medido, 5=Optimizado
 */

export const MATURITY_LABELS = {
  0: 'No existe',
  1: 'Inicial',
  2: 'Definido',
  3: 'Implementado',
  4: 'Medido',
  5: 'Optimizado',
};

export const MATURITY_COLORS = {
  0: '#ef4444',   // rojo
  1: '#f97316',   // naranja
  2: '#f59e0b',   // amarillo
  3: '#84cc16',   // verde claro
  4: '#10b981',   // verde
  5: '#06b6d4',   // cyan
};

export const DOMAINS = [
  {
    code: 'GV',
    name: 'Gobernar',
    name_en: 'Govern',
    icon: '🏛️',
    color: '#3b82f6',
    description: 'Estrategia, expectativas y política de ciberseguridad organizacional',
    nist_ref: 'NIST CSF 2.0 – GV',
    iso_ref: 'ISO/IEC 27001:2022 – Cláusulas 4, 5, 6',
  },
  {
    code: 'ID',
    name: 'Identificar',
    name_en: 'Identify',
    icon: '🔍',
    color: '#8b5cf6',
    description: 'Comprensión del contexto, activos, riesgos y brechas de la organización',
    nist_ref: 'NIST CSF 2.0 – ID',
    iso_ref: 'ISO/IEC 27001:2022 – Cláusulas 6, 8',
  },
  {
    code: 'PR',
    name: 'Proteger',
    name_en: 'Protect',
    icon: '🛡️',
    color: '#10b981',
    description: 'Salvaguardas para garantizar la prestación de servicios críticos',
    nist_ref: 'NIST CSF 2.0 – PR',
    iso_ref: 'ISO/IEC 27001:2022 – Anexo A: A.5–A.8',
  },
  {
    code: 'DE',
    name: 'Detectar',
    name_en: 'Detect',
    icon: '📡',
    color: '#f59e0b',
    description: 'Identificación y análisis de eventos de ciberseguridad',
    nist_ref: 'NIST CSF 2.0 – DE',
    iso_ref: 'ISO/IEC 27001:2022 – A.8.15, A.8.16',
  },
  {
    code: 'RS',
    name: 'Responder',
    name_en: 'Respond',
    icon: '⚡',
    color: '#ef4444',
    description: 'Acciones ante un incidente de ciberseguridad detectado',
    nist_ref: 'NIST CSF 2.0 – RS',
    iso_ref: 'ISO/IEC 27001:2022 – A.5.26, A.5.27',
  },
  {
    code: 'RC',
    name: 'Recuperar',
    name_en: 'Recover',
    icon: '🔄',
    color: '#06b6d4',
    description: 'Actividades para restaurar capacidades y servicios afectados por incidentes',
    nist_ref: 'NIST CSF 2.0 – RC',
    iso_ref: 'ISO/IEC 27001:2022 – A.5.29, A.8.13',
  },
];

export const QUESTIONS = [
  // ── GOBERNAR (GV) ──────────────────────────────────────────────────────────
  {
    id: 'GV-01',
    domain_code: 'GV',
    text: '¿Existe una política de seguridad de la información documentada, aprobada por la dirección y comunicada formalmente a todo el personal?',
    help: 'Busca: documento formal de política, firma de dirección, evidencia de socialización.',
  },
  {
    id: 'GV-02',
    domain_code: 'GV',
    text: '¿Están definidos y documentados los roles y responsabilidades en materia de ciberseguridad dentro de la organización (ej. RACI de seguridad)?',
    help: 'Busca: matrices de responsabilidad, descripciones de cargo con funciones de seguridad.',
  },
  {
    id: 'GV-03',
    domain_code: 'GV',
    text: '¿Se realizan revisiones periódicas (al menos anuales) de las políticas y objetivos de seguridad de la información?',
    help: 'Busca: actas de revisión, versiones actualizadas de documentos de política.',
  },
  {
    id: 'GV-04',
    domain_code: 'GV',
    text: '¿La dirección demuestra liderazgo activo y compromiso con la ciberseguridad, asignando recursos y aprobando inversiones en seguridad?',
    help: 'Busca: presupuesto dedicado, aprobación de iniciativas de seguridad por parte de la gerencia.',
  },
  {
    id: 'GV-05',
    domain_code: 'GV',
    text: '¿Existen mecanismos para gestionar los riesgos de ciberseguridad en la cadena de suministro (proveedores, terceros con acceso a sistemas)?',
    help: 'Busca: cláusulas de seguridad en contratos, evaluaciones de proveedores críticos.',
  },

  // ── IDENTIFICAR (ID) ───────────────────────────────────────────────────────
  {
    id: 'ID-01',
    domain_code: 'ID',
    text: '¿Existe un inventario formal, completo y actualizado de activos tecnológicos (hardware, software, servicios en la nube, datos críticos)?',
    help: 'Busca: base de datos de activos, CMDB, hojas de inventario actualizadas con propietario asignado.',
  },
  {
    id: 'ID-02',
    domain_code: 'ID',
    text: '¿Los activos tecnológicos están clasificados según su criticidad e impacto para el negocio y los servicios prestados a clientes?',
    help: 'Busca: criterios de clasificación documentados, etiquetado de activos por nivel de criticidad.',
  },
  {
    id: 'ID-03',
    domain_code: 'ID',
    text: '¿Se realizan evaluaciones formales de riesgos de ciberseguridad de forma periódica (al menos anual), identificando amenazas y vulnerabilidades?',
    help: 'Busca: metodología de gestión de riesgos documentada, informes de evaluación de riesgos.',
  },
  {
    id: 'ID-04',
    domain_code: 'ID',
    text: '¿La organización conoce y ha documentado su contexto interno y externo en materia de ciberseguridad (sector, regulaciones aplicables, partes interesadas)?',
    help: 'Busca: análisis de contexto organizacional, identificación de partes interesadas y sus requisitos.',
  },
  {
    id: 'ID-05',
    domain_code: 'ID',
    text: '¿Existe un proceso para gestionar las mejoras del programa de ciberseguridad basándose en los resultados de evaluaciones y lecciones aprendidas?',
    help: 'Busca: planes de mejora continua, seguimiento de hallazgos de evaluaciones anteriores.',
  },

  // ── PROTEGER (PR) ──────────────────────────────────────────────────────────
  {
    id: 'PR-01',
    domain_code: 'PR',
    text: '¿Se implementa autenticación multifactor (MFA) para el acceso a sistemas críticos, accesos remotos (VPN, RDP) y cuentas privilegiadas?',
    help: 'Busca: MFA activado en VPN, correo corporativo, paneles de administración, acceso remoto.',
  },
  {
    id: 'PR-02',
    domain_code: 'PR',
    text: '¿Existen controles de gestión de accesos basados en el principio de mínimo privilegio, con revisiones periódicas de permisos?',
    help: 'Busca: procedimiento de altas/bajas de usuarios, revisiones de accesos, separación de privilegios.',
  },
  {
    id: 'PR-03',
    domain_code: 'PR',
    text: '¿Se ejecuta un proceso cíclico de gestión de vulnerabilidades que incluya escaneos regulares, priorización y aplicación oportuna de parches?',
    help: 'Busca: herramientas de escaneo de vulnerabilidades, registros de parcheado, SLA de remediación.',
  },
  {
    id: 'PR-04',
    domain_code: 'PR',
    text: '¿Existe un programa activo de capacitación y concienciación en ciberseguridad para todo el personal, con contenidos actualizados?',
    help: 'Busca: cronograma de capacitaciones, registros de asistencia, simulaciones de phishing.',
  },
  {
    id: 'PR-05',
    domain_code: 'PR',
    text: '¿Se realizan copias de seguridad (backups) de datos críticos de forma automatizada, con verificación periódica de su integridad y restauración?',
    help: 'Busca: política de backups documentada, evidencias de pruebas de restauración, almacenamiento offsite.',
  },
  {
    id: 'PR-06',
    domain_code: 'PR',
    text: '¿La infraestructura de red cuenta con controles de seguridad perimetral (firewalls, segmentación de redes, VLAN) correctamente configurados?',
    help: 'Busca: diagramas de red con zonas de seguridad, reglas de firewall documentadas y revisadas.',
  },

  // ── DETECTAR (DE) ──────────────────────────────────────────────────────────
  {
    id: 'DE-01',
    domain_code: 'DE',
    text: '¿El NOC cuenta con herramientas de monitoreo de seguridad (SIEM, IDS/IPS, EDR) que permitan detectar eventos y anomalías en tiempo real?',
    help: 'Busca: herramientas activas de monitoreo, dashboards de seguridad, alertas configuradas.',
  },
  {
    id: 'DE-02',
    domain_code: 'DE',
    text: '¿Se recopilan, centralizan y revisan regularmente los registros (logs) de seguridad de sistemas críticos, servidores y dispositivos de red?',
    help: 'Busca: servidor de logs centralizado, política de retención, evidencias de revisión periódica.',
  },
  {
    id: 'DE-03',
    domain_code: 'DE',
    text: '¿Existen procesos y procedimientos documentados para analizar y escalar eventos de seguridad potencialmente maliciosos?',
    help: 'Busca: procedimientos de triage de alertas, criterios de escalamiento, registro de análisis de eventos.',
  },
  {
    id: 'DE-04',
    domain_code: 'DE',
    text: '¿Se realizan pruebas periódicas de la efectividad de los mecanismos de detección (ejercicios de simulación, pruebas de penetración internas)?',
    help: 'Busca: informes de pentesting, ejercicios de red team/blue team, pruebas de alertas.',
  },

  // ── RESPONDER (RS) ─────────────────────────────────────────────────────────
  {
    id: 'RS-01',
    domain_code: 'RS',
    text: '¿Existe un Plan de Respuesta a Incidentes (IRP) formal, documentado y actualizado, con fases claras (preparación, detección, contención, erradicación, recuperación)?',
    help: 'Busca: documento IRP vigente, roles asignados, procedimientos paso a paso por tipo de incidente.',
  },
  {
    id: 'RS-02',
    domain_code: 'RS',
    text: '¿El personal clave ha sido capacitado en el plan de respuesta a incidentes y se han realizado simulacros o ejercicios tabletop?',
    help: 'Busca: registros de capacitación en IRP, actas de ejercicios tabletop, listas de participantes.',
  },
  {
    id: 'RS-03',
    domain_code: 'RS',
    text: '¿Cada incidente de seguridad se documenta formalmente con causa raíz, cronología, impacto y acciones tomadas?',
    help: 'Busca: tickets de incidentes con campos de análisis forense básico, base de conocimiento de incidentes.',
  },
  {
    id: 'RS-04',
    domain_code: 'RS',
    text: '¿Existen canales y protocolos de comunicación definidos para notificar incidentes a partes interesadas internas y externas (clientes, entes reguladores)?',
    help: 'Busca: árbol de comunicación de incidentes, plantillas de notificación, umbrales de escalamiento.',
  },

  // ── RECUPERAR (RC) ─────────────────────────────────────────────────────────
  {
    id: 'RC-01',
    domain_code: 'RC',
    text: '¿Existe un Plan de Continuidad del Negocio (BCP) o Plan de Recuperación ante Desastres (DRP) documentado y probado?',
    help: 'Busca: documento BCP/DRP actualizado, resultados de pruebas de recuperación, RTO y RPO definidos.',
  },
  {
    id: 'RC-02',
    domain_code: 'RC',
    text: '¿Se definen y se monitorean objetivos de tiempo de recuperación (RTO) y punto de recuperación (RPO) para los servicios críticos?',
    help: 'Busca: acuerdos de nivel de servicio (SLA/SLO) internos con RTO/RPO definidos y medidos.',
  },
  {
    id: 'RC-03',
    domain_code: 'RC',
    text: '¿Se documentan y analizan formalmente las lecciones aprendidas después de cada incidente o ejercicio de recuperación para mejorar los planes?',
    help: 'Busca: actas post-mortem, registro de lecciones aprendidas, actualizaciones al IRP/BCP derivadas.',
  },
  {
    id: 'RC-04',
    domain_code: 'RC',
    text: '¿Se han probado y verificado los procesos de restauración de backups en un entorno de prueba, confirmando su efectividad?',
    help: 'Busca: registros de pruebas de restauración, evidencias de recuperación exitosa, frecuencia de pruebas.',
  },
];

export function getQuestionsByDomain(domainCode) {
  return QUESTIONS.filter(q => q.domain_code === domainCode);
}

export function getDomain(code) {
  return DOMAINS.find(d => d.code === code);
}

export function calcOverallMaturity(score) {
  if (score < 1)   return { level: 'No Existente', color: '#ef4444', description: 'La organización no ha implementado prácticas de ciberseguridad reconocibles.' };
  if (score < 2)   return { level: 'Inicial',      color: '#f97316', description: 'Existen algunas prácticas pero son ad hoc, reactivas e inconsistentes.' };
  if (score < 3)   return { level: 'Definido',     color: '#f59e0b', description: 'Las prácticas están documentadas pero su implementación es parcial.' };
  if (score < 4)   return { level: 'Implementado', color: '#84cc16', description: 'Los controles están consistentemente implementados en la organización.' };
  if (score < 4.5) return { level: 'Medido',       color: '#10b981', description: 'La efectividad de los controles se mide y se usa para mejorar.' };
  return              { level: 'Optimizado',    color: '#06b6d4', description: 'La ciberseguridad es parte del ADN organizacional y se mejora continuamente.' };
}

export function generateRecommendations(scores) {
  const recs = [];
  const thresholds = [
    { code: 'GV', threshold: 3, rec: 'Formalizar la Política de Seguridad de la Información y designar un responsable de ciberseguridad con funciones documentadas.' },
    { code: 'ID', threshold: 3, rec: 'Construir y mantener un inventario de activos tecnológicos con clasificación por criticidad y ejecutar evaluaciones de riesgo periódicas.' },
    { code: 'PR', threshold: 3, rec: 'Implementar MFA en todos los accesos remotos y sistemas críticos; establecer un ciclo de gestión de vulnerabilidades con SLA de remediación.' },
    { code: 'DE', threshold: 3, rec: 'Centralizar la recolección de logs y configurar alertas de seguridad en el NOC; evaluar la incorporación de un SIEM básico.' },
    { code: 'RS', threshold: 3, rec: 'Documentar y probar el Plan de Respuesta a Incidentes; realizar al menos un ejercicio tabletop anual con el equipo técnico.' },
    { code: 'RC', threshold: 3, rec: 'Definir RTO/RPO para servicios críticos; probar los backups mediante restauraciones reales en entornos de prueba cada trimestre.' },
  ];

  for (const t of thresholds) {
    if ((scores[t.code] || 0) < t.threshold) {
      recs.push({ domain: t.code, score: scores[t.code] || 0, recommendation: t.rec });
    }
  }

  return recs.sort((a, b) => a.score - b.score);
}
