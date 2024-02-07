import React, { useState, useEffect } from 'react';
import { authAxios } from 'api/AxiosAPI';
import { Chart } from 'primereact/chart';

function DashboardBarChart() {
  const [weekChartData, setWeekChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    authAxios()
      .get(`/home/dashboard/week/${localStorage.getItem('shop_seq')}`)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setWeekChartData(response.data);

        const labels = response.data.map((entry) => {
          const formattedDate = entry.date.replace(
            /(\d{4})(\d{2})(\d{2})/,
            '$1-$2-$3'
          );
          return formattedDate;
        });
        const dataCount1 = response.data.map((entry) => entry.count_stat_1);
        const dataCount2 = response.data.map((entry) => entry.count_stat_2);
        const dataCount3 = response.data.map((entry) => entry.count_stat_3);

        const data = {
          labels: labels,
          datasets: [
            {
              label: '방문 완료',
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgb(153, 102, 255)',
              borderWidth: 1,
              data: dataCount1,
            },
            {
              label: '예약 취소',
              backgroundColor: 'rgba(255, 205, 86, 0.2)',
              borderColor: 'rgb(255, 205, 86)',
              borderWidth: 1,
              data: dataCount2,
            },
            {
              label: '노쇼',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132)',
              borderWidth: 1,
              data: dataCount3,
            },
          ],
        };

        setWeekChartData(data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          position: 'top',
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
            stepSize: 1,
          },
        },
      },
    };

    setChartOptions(options);
  }, []);

  return (
    <Chart
      type='bar'
      data={weekChartData}
      options={chartOptions}
    />
  );
}

export default DashboardBarChart;
