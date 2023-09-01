<template>
  <div>
    <div><canvas class="w-[20rem] h-22" id="tasks"></canvas></div>
  </div>
</template>

<script>
import axios from "axios";
import Chart from "chart.js/auto";

export default {
  setup() {
    name: "piechart";
  },
  async mounted() {
    await this.getTasks();
    const done = this.tasks.DoneCount;
    const pending = this.tasks.taskCount - done;
    (async function () {
      const data = [
        { month: "Done", count: done, color: "#017ab2" }, // Set color here
        { month: "Pending", count: pending, color: "#81D6FF" }, // Set color here
      ];

      new Chart(document.getElementById("tasks"), {
        type: "doughnut",
        data: {
          labels: data.map((row) => row.month),
          datasets: [
            {
              label: "Tasks Number",
              data: data.map((row) => row.count),
              backgroundColor: data.map((row) => row.color), // Use color here
            },
          ],
        },
      });
    })();
  },
  methods: {
    async getTasks() {
      await axios
        .get(`/tasks/countAll`)
        .then((response) => {
          this.tasks = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  data() {
    return {
      tasks: {},
    };
  },
};
</script>
