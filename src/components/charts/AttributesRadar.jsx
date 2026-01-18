"use client";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

export default function AttributesRadar({ attributes, label }) {
  const options = {
    scales: {
      r: {
        ticks: {
          display: false,
        },
        grid: {
          color: "rgba(255,255,255,0.1)",
        },
        angleLines: {
          color: "rgba(255,255,255,0.2)",
        },
        pointLabels: {
          color: "#E5E7EB",
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#E5E7EB",
        },
      },
    },
  };
  const data = {
    labels: Object.keys(attributes),
    datasets: [
      {
        label,
        data: Object.values(attributes),
        backgroundColor: "rgba(0, 200, 200, 0.2)",
        borderColor: "rgba(0, 200, 200, 1)",
        borderWidth: 2,
      },
    ],
  };

  return <Radar data={data} options={options} />;
}
