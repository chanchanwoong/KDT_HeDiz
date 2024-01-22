import React, { useState, useEffect } from 'react';
import { authAxios } from 'api/AxiosAPI';
import { Chart } from 'primereact/chart';

function DashboardChart() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    authAxios()
      .get(`/home/dashboard/${localStorage.getItem('shop_seq')}`)
      .then((response) => {
        console.log('Auth Response:', response.data);

        // 예약 취소 및 노쇼
        const canceledNoShowData = response.data
          .filter((entry) => entry.reserv_stat === 3 || entry.reserv_stat === 4)
          .map((entry) => entry.visit_count);

        // 정상 방문
        const normalVisitData = response.data
          .filter((entry) => entry.reserv_stat === 0 || entry.reserv_stat === 1)
          .map((entry) => entry.visit_count);

        const data = {
          labels: response.data.map((entry) => entry.reserv_date),
          datasets: [
            {
              label: '예약 취소 및 노쇼',
              data: canceledNoShowData,
            },
            {
              label: '정상 방문',
              backgroundColor: documentStyle.getPropertyValue('--purple-500'),
              borderColor: documentStyle.getPropertyValue('--purple-500'),
              data: normalVisitData,
            },
          ],
        };

        setChartData(data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            fontColor: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

    setChartOptions(options);
  }, []);

  return (
    <Chart
      type='bar'
      data={chartData}
      options={chartOptions}
    />
  );
}

export default DashboardChart;
