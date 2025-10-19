import React, { useState, useEffect, memo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RealtimeChart = ({ temp, humiditi, lights, timestamp }) => {
  const [labels, setLabels] = useState([]);
  const [temps, setTemps] = useState([]);
  const [humidity, setHumidity] = useState([]);
  const [light, setLight] = useState([]);

  useEffect(() => {
    setTemps(prev => {
      const arr = [...prev, temp];
      if (arr.length > 5) arr.shift();
      return arr;
    });
    setHumidity(prev => {
      const arr = [...prev, humiditi];
      if (arr.length > 5) arr.shift();
      return arr;
    });
    setLight(prev => {
      const arr = [...prev, lights];
      if (arr.length > 5) arr.shift();
      return arr;
    });
    setLabels(prev => {
      const arr = [...prev, new Date().toLocaleTimeString()];
      if (arr.length > 5) arr.shift();
      return arr;
    });
  }, [temp, humiditi, lights, timestamp]);

  const data = {
    labels,
    datasets: [
      {
        label: "Nhiệt độ (°C)",
        data: temps,
        borderColor: "#ff4d4d",
        backgroundColor: "rgba(255, 77, 77, 0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: "#ff4d4d",
      },
      {
        label: "Độ ẩm (%)",
        data: humidity,
        borderColor: "#4da6ff",
        backgroundColor: "rgba(77, 166, 255, 0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: "#4da6ff",
      },
      {
        label: "Ánh sáng (lux)",
        data: light,
        borderColor: "#ffd633",
        backgroundColor: "rgba(255, 214, 51, 0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: "#ffd633",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500,
      easing: "easeInOutQuad",
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          color: "#444",
          font: {
            size: 13,
            weight: "500",
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#222",
        titleColor: "#fff",
        bodyColor: "#ddd",
        borderColor: "#555",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(200,200,200,0.1)",
        },
        ticks: {
          color: "#666",
          font: { size: 10 },
        },
      },
      y: {
        min: 0,
        max: 125,
        ticks: {
          stepSize: 25, 
          color: "#666",
          font: { size: 11 },
        },
        grid: {
          color: "rgba(200,200,200,0.1)",
        },
      },
    },
  };

  return (
    <div style={{ height: "320px", width: "100%", padding: "10px" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default memo(RealtimeChart);
