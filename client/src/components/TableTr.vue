<template>
  <tr class="border-b border-gray-200 hover:bg-gray-100">
    <td>
      <div class="ml-5">
        <div
          class="bg-gray-200 rounded-sm w-5 h-5 flex flex-shrink-0 justify-center items-center relative"
        >
          <input
            placeholder="checkbox"
            type="checkbox"
            class="focus:opacity-100 checkbox opacity-0 absolute cursor-pointer w-full h-full"
          />
          <div class="check-icon hidden bg-indigo-700 text-white rounded-sm">
            <svg
              class="icon icon-tabler icon-tabler-check"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z"></path>
              <path d="M5 12l5 5l10 -10"></path>
            </svg>
          </div>
        </div>
      </div>
    </td>
    <td class="ml-6 py-3 px-6 text-center">
      <div class="flex items-center">
        <div class="mr-2">
          <img class="w-6 h-6 rounded-full" :src="getimg()" v-bind:alt="pic" />
        </div>
        <span>{{ client.name }}</span>
      </div>
    </td>
    <td class="py-3 px-6 text-center whitespace-nowrap">
      <div class="">
        <span class="font-medium">{{ task.Date }}</span>
      </div>
    </td>
    <td class="py-3 px-6 text-center">
      <div>
        <span>{{ task.dateStart }}-{{ task.dateEnd }}</span>
      </div>
    </td>

    <td class="py-3 px-6 text-center">
      <span class="bg-purple-200 text-purple-600 py-1 px-3 rounded-full text-xs"
        >Active</span
      >
    </td>
    <td class="py-3 px-6 text-center">
      <div class="flex item-center justify-center">
        <div class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </div>
        <div
          @click="editpopup = true"
          class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </div>
        <div class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
          <svg
            @click="deleteTask()"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
      </div>
    </td>
    <add-task-popup :show-popup="popup" @close="popup = false" />
    <edit-task-popup
      :task="task"
      :show-popup="editpopup"
      @close="editpopup = false"
    />
  </tr>
</template>

<script>
import axios from "axios";
import AddTaskPopup from "./AddTaskPopup.vue";
import editTaskPopup from "./editTaskPopup.vue";

export default {
  setup() {
    name: "TableTr";
  },
  data() {
    return {
      popup: false,
      editpopup: false,
      client: {},
    };
  },
  props: {
    task: {
      type: Object, // Specify the type of the prop
      required: true, // Set to true if the prop is required
    },
  },
  mounted() {
    this.fetchClient(this.task.clientId);
    this.task.Date = this.extractDate(this.task.Date);
    this.task.dateStart = this.extractHours(this.task.dateStart);
    this.task.dateEnd = this.extractHours(this.task.dateEnd);
  },
  components: {
    AddTaskPopup,
    editTaskPopup,
  },
  methods: {
    async deleteTask() {
      const response = await axios.delete(`tasks/${this.task.id}`, {});
    },
    async fetchClient(id) {
      const response = await axios
        .get(`clients/${id}`)
        .then((response) => {
          this.client = response.data;
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
    getimg() {
      return `http://localhost:3000/uploads/tasks/${this.client.image}`;
    },
  },
};
</script>
