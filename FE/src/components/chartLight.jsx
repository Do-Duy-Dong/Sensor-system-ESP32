import React, { useState, useEffect } from "react";
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
  Filler,
  Title,
  Tooltip,
  Legend
);

const RealtimeChart = ({label,light}) => {
  const [labels, setLabels] = useState([]);
  const [temps, setTemps] = useState([ ]);

  useEffect(() => {
    

      setLabels((prev) => {
        let newLabels = [...prev, new Date().toLocaleTimeString()];
        if (newLabels.length > 5) newLabels.shift();
        return newLabels;
      });
  
      setTemps((prev) => {
        let newTemps = [...prev, light];
        if (newTemps.length > 5) newTemps.shift();
        return newTemps;
      });

  }, [label,light]);

  const data = {
    labels,
    datasets: [
      {
        label: "Ánh sáng(nits)",
        data: temps,
        borderColor: "red",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill:true
      },
    ],
  };

  const options = {
    responsive: true,
    animation: false, // tắt animation để realtime mượt hơn
    scales: {
      x: { title: { display: true, text: "Thời gian" } },
      y: { title: { display: true, text: "nits" } },
    },
  };

  return <Line data={data} options={options} />;
};

export default RealtimeChart;
