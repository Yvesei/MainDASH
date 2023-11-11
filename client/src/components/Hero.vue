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
            <p>Show:</p>
            <select
              v-model="selected"
              @change="selectedFunc()"
              aria-label="select"
              class="focus:text-indigo-600 focus:outline-none bg-transparent ml-1"
            >
              <option v-bind:value="1" class="text-sm text-indigo-800">
                Undeleted tasks only
              </option>
              <option v-bind:value="2" class="text-sm text-indigo-800">
                Deleted tasks only
              </option>
              <option v-bind:value="3" class="text-sm text-indigo-800">
                All
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="bg-white py-4 md:py-7 px-4 md:px-8 xl:px-10">
        <div class="sm:flex items-center justify-between">
          <div class="flex items-center">
            <a
              @click="
                fetchTasks();
                selectButton('all');
              "
              class="hover:cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800"
            >
              <div
                :class="
                  isSelected('all')
                    ? 'py-2 px-8 bg-indigo-100 text-indigo-700'
                    : ''
                "
                class="py-2 px-8 text-gray-600 rounded-full"
              >
                <p>All</p>
              </div>
            </a>
            <a
              @click="
                fetchTasksDone();
                selectButton('done');
              "
              class="hover:cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8"
            >
              <div
                :class="
                  isSelected('done')
                    ? 'py-2 px-8 bg-indigo-100 text-indigo-700'
                    : ''
                "
                class="py-2 px-8 text-gray-600 hover:text-indigo-700 hover:bg-indigo-100 rounded-full"
              >
                <p>Done</p>
              </div>
            </a>
            <a
              @click="
                fetchTasksPending();
                selectButton('pending');
              "
              class="hover:cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8"
            >
              <div
                :class="
                  isSelected('pending')
                    ? 'py-2 px-8 bg-indigo-100 text-indigo-700'
                    : ''
                "
                class="py-2 px-8 text-gray-600 hover:text-indigo-700 hover:bg-indigo-100 rounded-full"
              >
                <p>Pending</p>
              </div>
            </a>
            <a
              v-if="this.filterDatesBool === false"
              @click="popupFilter = true"
              class="hover:cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8"
            >
              <div
                class="py-2 px-8 text-gray-600 hover:text-indigo-700 hover:bg-indigo-100 rounded-full"
              >
                <p>Filter</p>
              </div> </a
            ><a
              v-if="this.filterDatesBool === true"
              @click="UndoFilter()"
              class="hover:cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8"
            >
              <div
                class="py-2 px-8 text-gray-600 hover:text-indigo-700 hover:bg-indigo-100 rounded-full"
              >
                <p>Undo Filter</p>
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
                      <th class="py-3 px-6 text-left">Client</th>
                      <th
                        v-if="this.currentUserRole === 'ADMIN'"
                        class="py-3 px-6 text-left"
                      >
                        User
                      </th>
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
                      @task-deleted="fetchTasks"
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <add-task-popup
      :show-popup="popup"
      @close="popup = false"
      @task-added="fetchTasks"
    />
    <Filter
      :show-popup="popupFilter"
      @close="popupFilter = false"
      @task-filter="Filter"
    />
  </div>
</template>

<script>
import axios from "axios";
import AddTaskPopup from "./AddTaskPopup.vue";
import navbar from "./Navbar.vue";
import TableTr from "./TableTr.vue";
import Filter from "./Filter.vue";

export default {
  setup() {
    name: "hero";
  },
  mounted() {
    this.fetchUser();
    if (this.selected == "1") {
      this.fetchTasks();
    }
    if (this.selected == "2") {
      this.fetchTasks();
    }
    if (this.selected == "3") {
      this.fetchTasks();
    }
  },
  components: {
    TableTr,
    AddTaskPopup,
    Filter,
    navbar,
  },
  data() {
    return {
      currentUserRole: "",
      filterDates: [
        "Wed Dec 12 2012 00:00:00 GMT 0000 (GMT)",
        "Thu Dec 12 2999 00:00:00 GMT 0000 (GMT)",
      ],
      popup: false,
      popupFilter: false,
      tasks: [],
      selectedButton: "all",
      selected: "1",
      isdeleted: "undeleted",
      filterDatesBool: false,
    };
  },
  methods: {
    Filter(value) {
      console.log(value);
      if (value[1] == "") {
        this.filterDates = ["2012-12-12", "2999-12-12"];
        console.log("entered ");
      } else this.filterDates = value;

      this.filterDatesBool = true;

      this.filterDates[0] = this.convertDateAll(this.filterDates[0]);
      this.filterDates[1] = this.convertDateAll(this.filterDates[1]);
      console.log(this.filterDates);

      this.fetchTasks();
    },
    UndoFilter() {
      this.filterDatesBool = false;
      this.filterDates = [
        "Wed Dec 12 2012 00:00:00 GMT 0000 (GMT)",
        "Thu Dec 12 2999 00:00:00 GMT 0000 (GMT)",
      ];
      this.fetchTasks();
    },
    selectedFunc() {},
    selectButton(button) {
      this.selectedButton = button;
    },
    isSelected(button) {
      return this.selectedButton === button;
    },
    fetchTasks() {
      if (this.selected == "1") this.isdeleted = "undeleted";
      if (this.selected == "2") this.isdeleted = "deleted";
      if (this.selected == "3") this.isdeleted = "none";

      axios
        .get(
          `/tasks/latest?deleted=${this.isdeleted}&filter=${this.filterDates}`
        )
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
      if (this.selected == "1") this.isdeleted = "undeleted";
      if (this.selected == "2") this.isdeleted = "deleted";
      if (this.selected == "3") this.isdeleted = "none";
      axios
        .get(
          `/tasks/latest?type=Done&deleted=${this.isdeleted}&filter=${this.filterDates}`
        )
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
      if (this.selected == "1") this.isdeleted = "undeleted";
      if (this.selected == "2") this.isdeleted = "deleted";
      if (this.selected == "3") this.isdeleted = "none";
      axios
        .get(
          `/tasks/latest?type=Pending&deleted=${this.isdeleted}&filter=${this.filterDates}`
        )
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
    convertDateAll(timeString) {
      // Split the time string into year, month, and day
      const [year, month, day] = timeString.split("-");

      // Create a new Date object with the parsed year, month (0-indexed), and day
      const currentDate = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );

      return currentDate;
    },
    fetchUser() {
      axios
        .get(`/users/current-user-get`)
        .then((response) => {
          this.currentUserRole = response.data.role;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
<style></style>
