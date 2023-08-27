<template>
  <div class="flex">
    <navbar />
    <div class="sm:px-6 w-full">
      <div class="px-4 md:px-10 py-4 md:py-7">
        <div class="flex items-center justify-between">
          <p
            tabindex="0"
            class="focus:outline-none text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800"
          >
            Tasks
          </p>
          <div
            class="py-3 px-4 flex items-center text-sm font-medium leading-none text-gray-600 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded"
          >
            <p>Sort By:</p>
            <select
              aria-label="select"
              class="focus:text-indigo-600 focus:outline-none bg-transparent ml-1"
            >
              <option class="text-sm text-indigo-800">Latest</option>
              <option class="text-sm text-indigo-800">Oldest</option>
              <option class="text-sm text-indigo-800">Latest</option>
            </select>
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
            @click="popup = true"
            class="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 mt-4 sm:mt-0 inline-flex items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded"
          >
            <p class="text-sm font-medium leading-none text-white">Add Task</p>
          </button>
        </div>
        <!-- component -->
        <div class="overflow-x-auto">
          <div>
            <div class="w-full">
              <div class="bg-white shadow-md rounded my-6">
                <table class="min-w-max w-full table-auto">
                  <thead>
                    <tr class="uppercase text-sm leading-normal">
                      <th class="py-3 px-6 text-left"></th>
                      <th class="py-3 px-6 text-left">Client</th>
                      <th class="py-3 px-6 text-center">Date</th>
                      <th class="py-3 px-6 text-center">Heure</th>
                      <th class="py-3 px-6 text-center">Status</th>
                      <th class="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="text-gray-600 text-sm font-light">
                    <TableTr
                      v-for="task in tasks"
                      v-bind:key="task.id"
                      :task="task"
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <add-task-popup :show-popup="popup" @close="popup = false" />
  </div>
</template>

<script>
import axios from "axios";
import AddTaskPopup from "./AddTaskPopup.vue";
import navbar from "./Navbar.vue";
import TableTr from "./TableTr.vue";

export default {
  setup() {
    name: "hero";
  },
  mounted() {
    this.fetchTasks();
  },
  components: {
    TableTr,
    AddTaskPopup,
    navbar,
  },
  data() {
    return {
      popup: false,

      tasks: [],
    };
  },
  methods: {
    fetchTasks() {
      axios
        .get(`/tasks/latest`)
        .then((response) => {
          this.tasks = response.data.map((task) => {
            task.Date = this.extractDate(task.Date);

            task.dateStart = this.extractHours(task.dateStart);

            task.dateEnd = this.extractHours(task.dateEnd);
            return task;
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    fetchTasksDone() {
      axios
        .get(`/tasks/latest?type=done`)
        .then((response) => {
          this.tasks = response.data.map((task) => {
            task.Date = this.extractDate(task.Date);
            task.dateStart = this.extractHours(task.dateStart);
            task.dateEnd = this.extractHours(task.dateEnd);
            return task;
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    fetchTasksPending() {
      axios
        .get(`/tasks/latest?type=pending`)
        .then((response) => {
          this.tasks = response.data.map((task) => {
            task.Date = this.extractDate(task.Date);
            task.dateStart = this.extractHours(task.dateStart);
            task.dateEnd = this.extractHours(task.dateEnd);
            return task;
          });
        })
        .catch((error) => {
          console.error(error);
        });
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
  },
};
</script>
<style></style>
