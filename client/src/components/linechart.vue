<template>
  <div class="chart">
    <canvas
      v-if="!error"
      ref="canvas"
      aria-label="Tasks by month"
      role="img"
    ></canvas>
    <p v-else>Could not load task activity.</p>
  </div>
</template>
<script>
import Chart from "chart.js/auto";
import axios from "axios";
export default {
  data() {
    return { chart: null, error: false };
  },
  async mounted() {
    try {
      const { data } = await axios.get("/tasks/linechart");
      this.chart = new Chart(this.$refs.canvas, {
        type: "line",
        data: {
          labels: data.map((row) => row.month.slice(0, 3)),
          datasets: [
            {
              label: "Tasks",
              data: data.map((row) => row.count),
              borderColor: "#497e67",
              backgroundColor: "#dcebdc",
              fill: true,
              tension: 0.35,
              pointRadius: 3,
              pointBackgroundColor: "#497e67",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { precision: 0 },
              grid: { color: "#edf2ed" },
            },
            x: { grid: { display: false } },
          },
        },
      });
    } catch (error) {
      this.error = true;
    }
  },
  beforeUnmount() {
    if (this.chart) this.chart.destroy();
  },
};
</script>
<style scoped>
.chart {
  min-height: 160px;
  color: #8b9991;
  font-size: 13px;
}
</style>
