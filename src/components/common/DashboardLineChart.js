import React, { useState, useEffect } from 'react';
import { authAxios } from 'api/AxiosAPI';
import { Chart } from 'primereact/chart';

function DashboardLineChart() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    authAxios()
      .get(`/home/dashboard/summary/${localStorage.getItem('shop_seq')}`)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setChartData(response.data);

        const labels = response.data.map((entry) => {
          const formattedDate = entry.date.replace(/(\d{4})(\d{2})/, '$1-$2');
          return formattedDate;
        });
        const data = {
          labels: labels,
          datasets: [
            {
              label: '매출',
              backgroundColor: ['rgba(153, 102, 255, 0.2)'],
              borderColor: ['rgb(153, 102, 255)'],
              data: response.data.map((entry) => entry.sales_amount),
              pointStyle: 'circle',
              pointRadius: 5,
              pointHoverRadius: 15,
            },
          ],
        };

        setChartData(data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              weight: 500,
              size: 14,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 100000,
          },
          grid: {
            drawBorder: false,
          },
        },
      },
    };

    setChartOptions(options);
  }, []);

  return (
    <Chart
      type='line'
      data={chartData}
      options={chartOptions}
    />
  );
}

export default DashboardLineChart;
