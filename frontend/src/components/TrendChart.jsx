import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // <-- added Filler plugin
} from 'chart.js';

// Register Chart.js components including Filler
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // <-- register Filler
);

export default function TrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-600 bg-gray-50 rounded border border-gray-200">
        Loading trend data...
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Active Drivers',
        data: data.map(item => item.totalDrivers),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true, // <-- Filler plugin now enables this
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return ` ${context.parsed.y.toLocaleString()} drivers`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => value.toLocaleString(),
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">30-Day Trend</h3>
      
      {/* Chart container */}
      <div style={{ height: '300px' }}>
        <Line data={chartData} options={options} />
      </div>

      {/* Percentage change info */}
      {data.length > 1 && (() => {
        const first = data[0].totalDrivers || 0;
        const last = data[data.length - 1].totalDrivers || 0;

        if (first === 0) {
          if (last > 0) {
            return (
              <div className="mt-2 text-sm text-gray-600">
                <span className="text-green-600">
                  ▲ New data (+{last.toLocaleString()} drivers from 0)
                </span>
              </div>
            );
          }
          return <div className="mt-2 text-sm text-gray-600">No change</div>;
        }

        const diff = last - first;
        const pct = Math.round(Math.abs(diff) / first * 100);

        return (
          <div className="mt-2 text-sm text-gray-600">
            {diff >= 0 ? (
              <span className="text-green-600">▲ {pct}% increase over period</span>
            ) : (
              <span className="text-red-600">▼ {pct}% decrease over period</span>
            )}
          </div>
        );
      })()}
    </div>
  );
}
