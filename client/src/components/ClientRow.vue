<template>
  <tr class="border-b border-gray-200 hover:bg-gray-100">
    <td class="ml-6 py-3 px-6 text-center">
      <div @click="Result()" class="hover:cursor-pointer flex items-center">
        <div class="mr-2">
          <img class="w-6 h-6 rounded-full" :src="getimg()" alt="pic" />
        </div>
        <span>{{ client.name }}</span>
      </div>
    </td>
    <td class="py-3 px-6 text-center whitespace-nowrap">
      <div class="">
        <span class="font-medium">{{ client.number }}</span>
      </div>
    </td>
    <td class="py-3 px-6 text-center">
      <div>
        <span>{{ client.distance }}</span>
      </div>
    </td>

    <td class="py-3 px-6 text-center">
      <span
        class="bg-purple-200 text-purple-600 py-1 px-3 rounded-full text-xs"
        >{{ this.tasks }}</span
      >
    </td>
    <td class="py-3 px-6 text-center">
      <div class="flex item-center justify-center">
        <div class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
          <svg
            @click="popup = true"
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
            @click="deleteClient()"
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
    <edit-client-popup
      :show-popup="popup"
      :client="client"
      @close="popup = false"
    />
  </tr>
</template>

<script>
import axios from "axios";
import EditClientPopup from "./EditClientPopup.vue";

export default {
  setup() {
    name: "ClientRow";
  },
  data() {
    return {
      popup: false,
      tasks: "",
    };
  },
  components: {
    EditClientPopup,
  },
  props: {
    client: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getTasksNumber() {
      axios
        .get(`/tasks/count?id=${this.client.id}`)
        .then((response) => {
          this.tasks = response.data.taskCount;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deleteClient() {
      const response = axios.delete(`clients/${this.client.id}`, {});
      this.$emit("client-deleted");
    },
    getimg() {
      return `http://192.168.1.146:3000/uploads/uploads/tasks/${this.client.image}`;
    },
    Result() {
      localStorage.setItem("clientResult", this.client.id);
      this.$router.push("/result");
    },
  },
  mounted() {
    this.getTasksNumber();
  },
};
</script>
