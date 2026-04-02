import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SubjectStat {
  subject_name: string;
  category: string;
  total_correct: number;
  total_wrong: number;
  total_blank: number;
  wrong_rate: number;
}

interface Props {
  stats: SubjectStat[];
  filter?: 'all' | 'sayisal' | 'sozel';
}

export default function SubjectChart({ stats, filter = 'all' }: Props) {
  const filtered = filter === 'all' ? stats : stats.filter((s) => s.category === filter);

  if (!filtered || filtered.length === 0) {
    return (
      <div className="py-10 text-center">
        <div className="mb-2 text-4xl">📊</div>
        <div className="text-sm text-slate-500">Henüz konu verisi yok</div>
      </div>
    );
  }

  const sorted = [...filtered].sort((a, b) => b.wrong_rate - a.wrong_rate).slice(0, 15);

  const data = {
    labels: sorted.map((s) => s.subject_name),
    datasets: [
      {
        label: 'Doğru',
        data: sorted.map((s) => s.total_correct),
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderRadius: 4,
      },
      {
        label: 'Yanlış',
        data: sorted.map((s) => s.total_wrong),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderRadius: 4,
      },
      {
        label: 'Boş',
        data: sorted.map((s) => s.total_blank),
        backgroundColor: 'rgba(100, 116, 139, 0.5)',
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#8888aa',
          font: { size: 12, family: 'Inter' },
          usePointStyle: true,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 17, 40, 0.95)',
        titleColor: '#f0f0ff',
        bodyColor: '#8888aa',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { color: 'rgba(255,255,255,0.03)' },
        ticks: { color: '#555577', font: { size: 11 } },
      },
      y: {
        stacked: true,
        grid: { display: false },
        ticks: { color: '#aaaacc', font: { size: 11, family: 'Inter' } },
      },
    },
  };

  return (
    <div style={{ height: Math.max(300, sorted.length * 36) }}>
      <Bar data={data} options={options} />
    </div>
  );
}
