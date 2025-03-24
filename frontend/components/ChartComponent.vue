<template>
  <div>
    <canvas ref="myChart"></canvas>
    <div v-if="!priceData || priceData.length === 0">Нет данных для отображения</div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  props: {
    priceData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      chartInstance: null,
    };
  },
  watch: {
    priceData: {
      handler() {
        this.renderChart();
      },
      immediate: false, // Убираем immediate: true
    },
  },
  mounted() {
    if (this.priceData && this.priceData.length > 0) {
      this.renderChart();
    }
  },
  methods: {
    renderChart() {
      if (!this.priceData || this.priceData.length === 0) {
        console.warn('No data available');
        return;
      }

      if (!this.$refs.myChart) {
        console.error('Canvas element not found');
        return;
      }

      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      const ctx = this.$refs.myChart.getContext('2d');
      const labels = this.priceData.map(item => item.date);
      const prices = this.priceData.map(item => item.price);

      this.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Цена',
            data: prices,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
            fill: true,
            tension: 0.4,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: '#333',
                font: {
                  size: 14,
                },
              },
            },
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Стоимость',
                color: '#333',
                font: {
                  size: 14,
                },
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
              ticks: {
                color: '#333',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Дата',
                color: '#333',
                font: {
                  size: 14,
                },
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
              ticks: {
                color: '#333',
              },
            },
          },
          animation: {
            duration: 1000,
            easing: 'easeInOutQuart',
          },
        },
      });
    },
  },
};
</script>

<style scoped>
canvas {
  max-width: 1000px !important;
  height: 450px !important;
  margin: 0 auto;
}
</style>