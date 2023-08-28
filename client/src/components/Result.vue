<template>
  <!-- component -->
  <div class="flex">
    <navbar />
    <div class="sm:px-6 w-full">
      <div class="px-4 md:px-10 py-4 md:py-7">
        <div class="flex items-center justify-between">
          <h5
            class="flex items-center text-2xl mb-0 font-bold dark:text-white flex"
          >
            <svg
              class="w-8 h-8 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <path
                d="M64 16C37.5 16 16 37.5 16 64V448c0 26.5 21.5 48 48 48H320c26.5 0 48-21.5 48-48V64c0-26.5-21.5-48-48-48H64zM0 64C0 28.7 28.7 0 64 0H320c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zM96 80c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16H288c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H96zM64 96c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V96zM80 224a16 16 0 1 0 32 0 16 16 0 1 0 -32 0zm16 32a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm0 80a16 16 0 1 0 0-32 16 16 0 1 0 0 32zm32-16a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm64 80H96c-8.8 0-16 7.2-16 16s7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16zM96 384h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm96-144a16 16 0 1 0 0-32 16 16 0 1 0 0 32zm32-16a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm-48 96a16 16 0 1 0 32 0 16 16 0 1 0 -32 0zm16 32a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm96-112a16 16 0 1 0 0-32 16 16 0 1 0 0 32zm32-16a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm-48 96a16 16 0 1 0 32 0 16 16 0 1 0 -32 0zm16 32a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm0 80a16 16 0 1 0 0-32 16 16 0 1 0 0 32zm32-16a32 32 0 1 1 -64 0 32 32 0 1 1 64 0z"
              />
            </svg>
            Result
          </h5>
          <div class="flex items-center">
            <div class="mr-2">
              <img class="w-16 h-16 rounded-full" :src="getimg()" />
            </div>
            <div class="flex flex-col">
              <h3
                class="focus:outline-none text-base sm:text-base md:text-l lg:text-xl font-bold leading-normal text-gray-800"
              >
                {{ this.client.name }}
              </h3>
              <h4
                class="focus:outline-none text-sm text-base font-bold leading-normal text-gray-800"
              >
                {{ this.client.number }}
              </h4>
              <p
                class="focus:outline-none text-sm text-base leading-normal text-gray-800"
              >
                {{ this.client.distance }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white py-4 md:py-7 px-4 md:px-8 xl:px-10">
        <div class="sm:flex items-center justify-between">
          <div class="flex items-center">
            <a
              @click="fetchTasks()"
              class="rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800"
            >
              <div class="py-2 px-8 bg-indigo-100 text-indigo-700 rounded-full">
                <p>All</p>
              </div>
            </a>
            <a
              @click="fetchTasksDone()"
              class="rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8"
            >
              <div
                class="py-2 px-8 text-gray-600 hover:text-indigo-700 hover:bg-indigo-100 rounded-full"
              >
                <p>Done</p>
              </div>
            </a>
            <a
              @click="fetchTasksPending()"
              class="rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8"
            >
              <div
                class="py-2 px-8 text-gray-600 hover:text-indigo-700 hover:bg-indigo-100 rounded-full"
              >
                <p>Pending</p>
              </div>
            </a>
          </div>
          <button
            @click="calculateAllTime()"
            class="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 mt-4 sm:mt-0 inline-flex items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded"
          >
            <p class="text-sm font-medium leading-none text-white">Calculate</p>
          </button>
        </div>
        <!-- component -->
        <div class="overflow-x-auto">
          <div>
            <div class="w-full">
              <div class="bg-white shadow-md rounded my-6">
                <table class="w-full table-auto">
                  <thead>
                    <tr class="uppercase text-sm leading-normal">
                      <th class="py-3 px-6 text-left"></th>

                      <th class="py-3 px-6 text-center">Date</th>
                      <th class="py-3 px-6 text-center">Type de maintenance</th>
                      <th class="py-3 px-6 text-center">Total Hours</th>
                      <th class="py-3 px-6 text-center">Status</th>
                      <th class="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="text-gray-600 text-sm font-light">
                    <ResultRow
                      v-for="task in tasks"
                      v-bind:key="task.id"
                      :task="task"
                      @add-id="addIdToArray"
                    />
                  </tbody>
                </table>
                <div class="w-full flex justify-around py-4">
                  <div class="flex">
                    <h3
                      class="uppercase text-sm leading-normal text-gray-600 font-bold"
                    >
                      Total hours :
                    </h3>
                    <p
                      class="ml-2 uppercase text-sm leading-normal text-gray-600 font-bold"
                    >
                      {{ this.totalTime }}
                    </p>
                  </div>
                  <div class="flex">
                    <h3
                      class="uppercase text-sm leading-normal text-gray-600 font-bold"
                    >
                      Total Distance :
                    </h3>
                    <p
                      class="ml-2 uppercase text-sm leading-normal text-gray-600 font-bold"
                    >
                      {{ this.totalDistance }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AddClientPopup from "./AddClientPopup.vue";
import ResultRow from "./ResultRow.vue";
import navbar from "./Navbar.vue";
import axios from "axios";

export default {
  setup() {
    name: "hero";
  },
  components: {
    ResultRow,
    AddClientPopup,
    navbar,
  },
  methods: {
    async calculateAllTime() {
      try {
        const response = await axios.get("/tasks/calculate-total-time", {
          params: { idArray: this.idArray },
        });

        this.totalTime = response.data; // The backend sends the formatted total time

        console.log("Total Time:", totalTime);
        // You can display the total time or use it as needed
      } catch (error) {
        console.error("Error calculating total time:", error);
      }
      const ids = this.idArray.length;
      this.totalDistance = this.client.distance * ids;
    },
    addIdToArray(id) {
      if (this.idArray.includes(id)) {
        this.removeIdFromArray(id);
      } else {
        this.idArray.push(id);
      }
      console.log(this.idArray);
    },
    removeIdFromArray(id) {
      const index = this.idArray.indexOf(id);
      if (index !== -1) {
        this.idArray.splice(index, 1);
      }
    },
    async fetchUser() {
      const id = localStorage.getItem("clientResult");
      await axios
        .get(`/clients/${id}`)
        .then((response) => {
          this.client = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    async fetchTasks() {
      const id = localStorage.getItem("clientResult");
      await axios
        .get(`/tasks?clientId=${id}`)
        .then((response) => {
          this.tasks = response.data;
          this.getDateForm();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    async fetchTasksDone() {
      const id = localStorage.getItem("clientResult");
      await axios
        .get(`/tasks/?clientId=${id}&type=Done`)
        .then((response) => {
          this.tasks = response.data;
          this.getDateForm();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    async fetchTasksPending() {
      const id = localStorage.getItem("clientResult");
      await axios
        .get(`/tasks/?clientId=${id}&type=Pending`)
        .then((response) => {
          this.tasks = response.data;
          this.getDateForm();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getDateForm() {
      this.tasks.forEach((task) => {
        task.Date = this.extractDate(task.Date);
        task.dateStart = this.extractHours(task.dateStart);
        task.dateEnd = this.extractHours(task.dateEnd);
      });
    },
    getimg() {
      return `http://localhost:3000/uploads/tasks/${this.client.image}`;
    },
    extractDate(isoDateString) {
      const isoDate = new Date(isoDateString);
      // Extract date
      const year = isoDate.getUTCFullYear();
      const month = isoDate.getUTCMonth() + 1;
      const day = isoDate.getUTCDate();

      // Extract time
      const hours = isoDate.getUTCHours();
      const minutes = isoDate.getUTCMinutes();

      // Format the time as HH:MM
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      return `${year}-${month}-${day}`;
    },
    extractHours(isoDateString) {
      const isoDate = new Date(isoDateString);

      // Extract time
      const hours = isoDate.getUTCHours() + 1;
      const minutes = isoDate.getUTCMinutes();

      // Format the time as HH:MM
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      return `${formattedTime}`;
    },
    async calculateTotalTime() {
      try {
        const response = await axios.get("/calculate-total-time", {
          params: { idArray: this.idArray },
        });

        const totalTime = response.data; // The backend sends the formatted total time

        console.log("Total Time:", totalTime);
        // You can display the total time or use it as needed
      } catch (error) {
        console.error("Error calculating total time:", error);
      }
    },
  },
  mounted() {
    this.fetchUser();
    this.fetchTasks();
  },
  data() {
    return {
      popup: false,
      client: {},
      tasks: [],
      task: {},
      idArray: [],
      totalTime: "Vide",
      totalDistance: "Vide",
    };
  },
};
</script>
<style></style>
