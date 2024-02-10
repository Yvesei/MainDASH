<template>
  <div class="chart">
    <canvas
      v-if="!error && !empty"
      ref="canvas"
      aria-label="Completed and pending tasks"
      role="img"
    ></canvas>
    <p v-else>
      {{ error ? "Could not load task status." : "No tasks to show yet." }}
    </p>
  </div>
</template>
<script>
import axios from "axios";
import Chart from "chart.js/auto";
export default {
  data() {
    return { chart: null, error: false, empty: false };
  },
  async mounted() {
    try {
      const { data } = await axios.get("/tasks/countAll");
      if (!data.taskCount) {
        this.empty = true;
        return;
      }
      this.chart = new Chart(this.$refs.canvas, {
        type: "doughnut",
        data: {
          labels: ["Done", "Pending"],
          datasets: [
            {
              data: [data.DoneCount, data.taskCount - data.DoneCount],
              backgroundColor: ["#4f8067", "#dcebd3"],
              borderWidth: 0,
              spacing: 3,
            },
          ],
        },
        options: {
          cutout: "72%",
          plugins: {
            legend: {
              position: "bottom",
              labels: { usePointStyle: true, padding: 20 },
            },
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
  width: min(100%, 260px);
  min-height: 160px;
  display: grid;
  place-items: center;
  color: #8b9991;
  font-size: 13px;
}
</style>
