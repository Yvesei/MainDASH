<template>
  <div>
    <div><canvas id="acquisitions"></canvas></div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import axios from "axios";
export default {
  setup() {
    name: "Home";
  },
  data() {
    return {
      datah: [],
    };
  },
  mounted() {
    (async function () {
      let datah;

      try {
        const response = await axios.get(`/tasks/linechart`);
        datah = response.data;
      } catch (error) {
        console.error(error);
      }

      const data = datah;

      new Chart(document.getElementById("acquisitions"), {
        type: "line",
        data: {
          labels: data.map((row) => row.month),
          datasets: [
            {
              label: "Tasks by month",
              data: data.map((row) => row.count),
              borderColor: "#027bff",
              color: "#027bff",
            },
          ],
        },
      });
    })();
  },
};
</script>
