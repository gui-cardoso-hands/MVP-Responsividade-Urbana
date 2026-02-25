import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { Place, Category } from '../services/places';

const CATEGORIES: Category[] = ['Saúde', 'Educação', 'Lazer', 'Transporte'];

interface ServiceRadarProps {
  places: Place[];
}

export default function ServiceRadar({ places }: ServiceRadarProps) {
  const totalPlaces = places.length;

  const data = [
    { subject: 'Saúde', A: 0, fullMark: 5 },
    { subject: 'Educação', A: 0, fullMark: 5 },
    { subject: 'Lazer', A: 0, fullMark: 5 },
    { subject: 'Transporte', A: 0, fullMark: 5 },
  ];

  if (totalPlaces > 0) {
    const counts: Record<Category, number> = {
      'Saúde': 0,
      'Educação': 0,
      'Lazer': 0,
      'Transporte': 0
    };

    places.forEach(p => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });

    // Metodologia: Índice de Dominância Relativa
    // 1. Encontrar a categoria "Campeã" (maior contagem)
    const maxCount = Math.max(...Object.values(counts));

    // Trava do Deserto: Se o campeão tiver menos de 5 itens, a nota máxima é penalizada.
    // Se maxCount < 5, o fator de escala diminui.
    // Ex: maxCount = 2. Scale = 2/5 = 0.4. Nota máxima será 5 * 0.4 = 2.0.
    // Se maxCount >= 5, Scale = 1. Nota máxima será 5.0.
    const desertFactor = Math.min(maxCount, 5) / 5;

    // Calcular notas relativas ao campeão
    CATEGORIES.forEach((cat, index) => {
      const count = counts[cat];
      
      if (maxCount === 0) {
        data[index].A = 0;
      } else {
        // Fórmula: (Contagem / Contagem do Campeão) * 5 * Fator Deserto
        const relativeScore = (count / maxCount) * 5 * desertFactor;
        data[index].A = parseFloat(relativeScore.toFixed(1));
      }
    });
  }

  return (
    <div className="w-full h-64 bg-card rounded-2xl p-4 shadow-sm border border-border flex flex-col items-center justify-center">
      <h3 className="text-sm font-semibold text-muted-foreground mb-2 w-full text-left font-mono uppercase tracking-wider">Radar de Responsividade</h3>
      {totalPlaces === 0 ? (
        <div className="text-muted-foreground text-xs text-center">Nenhum serviço encontrado para análise</div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
            <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
            <Radar
              name="Score"
              dataKey="A"
              stroke="var(--accent-color)"
              strokeWidth={2}
              fill="var(--accent-color)"
              fillOpacity={0.3}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
              itemStyle={{ color: 'var(--accent-color)', fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}
              labelStyle={{ color: 'var(--foreground)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
