import {
  RadarChart as ReRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { DOMAINS } from '../data/questions';

export default function RadarChart({ scores }) {
  const data = DOMAINS.map(d => ({
    domain: d.name,
    score: Math.round((scores[d.code] || 0) * 100) / 100,
    fullMark: 5,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { domain, score } = payload[0].payload;
      return (
        <div className="bg-gtblue-800 border border-gtblue-600 rounded-lg px-3 py-2 text-sm">
          <div className="font-semibold text-white">{domain}</div>
          <div className="text-cyber-green">{score} / 5</div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ReRadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid stroke="#1e3a5f" />
        <PolarAngleAxis
          dataKey="domain"
          tick={{ fill: '#93c5fd', fontSize: 12, fontFamily: 'Inter' }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 5]}
          tick={{ fill: '#64748b', fontSize: 10 }}
          tickCount={6}
        />
        <Radar
          name="Madurez"
          dataKey="score"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.25}
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 4 }}
        />
        <Tooltip content={<CustomTooltip />} />
      </ReRadarChart>
    </ResponsiveContainer>
  );
}
