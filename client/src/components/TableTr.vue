<template>
  <tr class="border-b border-gray-200 hover:bg-gray-100">
    <td class="ml-6 py-3 px-6 text-center">
      <div class="flex items-center">
        <div class="mr-2">
          <img class="w-6 h-6 rounded-full" :src="getimg()" alt="pic" />
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
      <span
        v-if="task.status === false"
        class="bg-purple-200 text-purple-600 py-1 px-3 rounded-full text-xs"
        >Pending</span
      ><span
        v-if="task.status == true"
        class="bg-blue-200 text-blue-600 py-1 px-3 rounded-full text-xs"
        >Done</span
      >
    </td>
    <td class="py-3 px-6 text-center">
      <div class="flex item-center justify-center">
        <div
          v-if="this.currentUserRole === 'ADMIN'"
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
        <div
          @click="editpopup = true"
          class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
        >
          <svg
            v-if="this.currentUserRole === 'USER'"
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

        <div class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
          <svg
            v-if="this.currentUserRole === 'ADMIN'"
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
      currentUserRole: "",
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
    this.fetchUser();
  },
  components: {
    AddTaskPopup,
    editTaskPopup,
  },
  methods: {
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
    async deleteTask() {
      const response = await axios.delete(`tasks/${this.task.id}`, {});
      this.$emit("task-deleted");
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
    getimg() {
      return `http://192.168.1.146:3000/uploads/tasks/${this.client.image}`;
    },
  },
};
</script>
