import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, plugins } from 'chart.js';

Chart.register(ArcElement);
Chart.register(plugins);

const TransactionChart = ({ data }) => {
  const labels = ['Expenses', 'Income', 'Investments'];

  const config = {
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            'rgb(220,38,38)',
            'rgb(22,163,74)',
            'rgb(37,99,235)',
          ],
          hoverOffset: 6,
          spacing: 5,
          borderRadius: 5,
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    },
    options: {
      cutout: 140,
      radius: 140,
      plugins: {
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleSpacing: 4,
          padding: 4,
        },
      },
    },
  };

  return (
    <div className="flex flex-col lg:w-[50%] p-10 ">
      <div className="flex items-center justify-center size-[100%]">
        <Doughnut {...config} className="font-semibold" />
      </div>
    </div>
  );
};

export default TransactionChart;
