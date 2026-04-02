import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface TrendChartProps {
  exams: Array<{
    name: string;
    sayisal_net: number;
    sozel_net: number;
    total_net: number;
    exam_date: string;
  }>;
}

export default function TrendChart({ exams }: TrendChartProps) {
  if (!exams || exams.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '40px 20px' }}>
        <div className="empty-state-icon">📈</div>
        <div className="empty-state-text">Henüz deneme verisi yok</div>
      </div>
    );
  }

  const labels = exams.map((e) => {
    const d = new Date(e.exam_date);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Toplam Net',
        data: exams.map((e) => e.total_net),
        borderColor: '#7c5cfc',
        backgroundColor: 'rgba(124, 92, 252, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#7c5cfc',
        pointBorderColor: '#7c5cfc',
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
      },
      {
        label: 'Sayısal Net',
        data: exams.map((e) => e.sayisal_net),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
        borderDash: [5, 5],
      },
      {
        label: 'Sözel Net',
        data: exams.map((e) => e.sozel_net),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.05)',
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#22c55e',
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
        borderDash: [5, 5],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#8888aa',
          font: { size: 12, family: 'Inter' },
          usePointStyle: true,
          pointStyle: 'circle',
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
        titleFont: { size: 13, family: 'Inter', weight: 'bold' as const },
        bodyFont: { size: 12, family: 'Inter' },
        displayColors: true,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.03)' },
        ticks: { color: '#555577', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.03)' },
        ticks: { color: '#555577', font: { size: 11 } },
        min: 0,
      },
    },
  };

  return (
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  );
}
