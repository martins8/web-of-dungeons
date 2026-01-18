"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement);

export default function StatsBar({ stats }) {
  const data = {
    labels: Object.keys(stats),
    datasets: [
      {
        label: "Stats",
        data: Object.values(stats),
        backgroundColor: "rgba(255, 200, 0, 0.7)",
      },
    ],
  };

  return <Bar data={data} />;
}
