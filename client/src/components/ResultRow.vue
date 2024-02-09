<template>
  <tr
    v-if="
      ShowDell() &&
      (this.currentUserId === this.task.createdBy ||
        this.currentUserRole === 'ADMIN')
    "
    :class="
      task.deleted == true
        ? 'bg-red-200 hover:bg-red-200'
        : 'border-gray-200 hover:bg-gray-100'
    "
    class="border-b"
  >
    <td>
      <div @click="addidtoarray()" class="ml-5">
        <div
          :class="this.clicked == true ? 'bg-blue-500' : 'bg-gray-200'"
          class="rounded-sm w-5 h-5 flex flex-shrink-0 justify-center items-center relative"
        ></div>
      </div>
    </td>

    <td class="py-3 px-6 text-center whitespace-nowrap">
      <div class="">
        <span class="font-medium">{{ task.Date }}</span>
      </div>
    </td>
    <td
      v-if="this.currentUserRole === 'ADMIN'"
      class="ml-6 py-3 px-6 text-center"
    >
      <div class="flex items-center">
        <div class="mr-2">
          <img class="w-6 h-6 rounded-full" :src="getimgUser()" alt="pic" />
        </div>
        <span>{{ user.name }}</span>
      </div>
    </td>
    <td class="py-3 px-6 text-center whitespace-nowrap">
      <div class="">
        <span
          :class="task.type == 'this case is empty' ? 'text-red-400' : ''"
          class="font-medium"
          >{{ task.type }}</span
        >
      </div>
    </td>
    <td class="py-3 px-6 text-center">
      <div>
        <span>{{ this.totalHours }}</span>
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
          @click="isOpen = !isOpen"
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
      </div>
    </td>
  </tr>
  <tr>
    <td :colspan="6">
      <!-- Dropdown menu -->
      <div v-if="isOpen">
        <div
          active=""
          form="user"
          class="mb-4 flex flex-col visible w-full min-w-0 p-4 break-words bg-white opacity-100 dark:bg-slate-850 bg-clip-border border"
        >
          <div>
            <div class="flex flex-wrap mt-4 -mx-3">
              <div class="w-full max-w-full px-3 flex-0">
                <label
                  class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                  for="First Name"
                  >Type de maintenance</label
                >
                <p
                  :class="
                    task.type == 'this case is empty' ? 'text-red-400' : ''
                  "
                  class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                >
                  {{ task.type }}
                </p>
              </div>
            </div>
            <div class="flex flex-wrap mt-4 -mx-3">
              <div class="w-full max-w-full px-3 flex-0">
                <label
                  class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                  for="First Name"
                  >Fourniture</label
                >
                <textarea
                  disabled
                  :class="
                    task.supply == 'this case is empty' ? 'text-red-400' : ''
                  "
                  v-model="task.supply"
                  name="Bio"
                  rows="5"
                  placeholder=""
                  class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 min-h-unset text-sm leading-5.6 ease block h-auto w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                ></textarea>

                <!-- File uplaod -->
                <div class="bg-white p7 rounded mx-auto">
                  <div class="relative flex flex-col p-4 text-gray-400">
                    <div v-if="task.supplyFile != ''" class="m-auto flex">
                      <div
                        v-for="num of task.supplyFile.length"
                        v-bind:key="num"
                      >
                        <a
                          :href="getFile(num)"
                          target="_blank"
                          class="m-2 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 mt-4 sm:mt-0 inline-flex items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded"
                        >
                          <p
                            class="text-sm font-medium leading-none text-white"
                          >
                            View File
                          </p>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- end file opload -->
              </div>
            </div>
            <div class="flex flex-wrap -mx-3">
              <div class="w-full max-w-full px-3 flex-0">
                <label
                  class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                  for="First Name"
                  >Demande de devis</label
                >
                <p
                  :class="
                    task.devis == 'this case is empty' ? 'text-red-400' : ''
                  "
                  class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                >
                  {{ task.devis }}
                </p>
              </div>
            </div>
            <div class="flex flex-wrap mt-4 -mx-3">
              <div class="w-full max-w-full px-3 flex-0">
                <label
                  class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                  for="First Name"
                  >Fin de maintenance</label
                >
                <div>
                  <div class="grid sm:grid-cols-2 gap-2">
                    <label
                      :class="task.endTask == true ? 'border-blue-500' : ''"
                      for="fav"
                      class="flex p-3 block w-full bg-white border rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                    >
                      <input
                        :checked="task.endTask == true"
                        type="radio"
                        disabled=""
                        class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                        id="fav"
                      />
                      <span
                        class="text-sm text-gray-500 ml-3 dark:text-gray-400"
                        >Favourable</span
                      >
                    </label>
                    <label
                      for="defa"
                      :class="task.endTask == false ? 'border-blue-500' : ''"
                      class="flex p-3 block w-full bg-white border rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                    >
                      <input
                        :checked="task.endTask == false"
                        disabled=""
                        type="radio"
                        class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                        id="defa"
                      />
                      <span
                        class="text-sm text-gray-500 ml-3 dark:text-gray-400"
                        >Defavourable</span
                      >
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap mt-4 -mx-3">
              <div class="w-full max-w-full px-3 flex-0">
                <label
                  class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                  for="First Name"
                  >Resultat</label
                >
                <p
                  :class="
                    task.result == 'this case is empty' ? 'text-red-400' : ''
                  "
                  class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                >
                  {{ task.result }}
                </p>
              </div>
            </div>

            <div class="flex flex-wrap mt-4 -mx-3">
              <div class="w-full max-w-full px-3 flex-0">
                <label
                  class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                  for="First Name"
                  >Maintenance a suivre</label
                >
                <div>
                  <div class="grid sm:grid-cols-2 gap-2">
                    <label
                      :class="
                        task.followupBool == true ? 'border-blue-500' : ''
                      "
                      for="a-suivre"
                      class="flex p-3 block w-full bg-white border rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                    >
                      <input
                        :checked="task.followupBool == true"
                        disabled=""
                        type="radio"
                        class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                        id="a-suivre"
                      />
                      <span
                        class="text-sm text-gray-500 ml-3 dark:text-gray-400"
                        >Manque des pièces</span
                      >
                    </label>

                    <label
                      for="Autre"
                      :class="
                        task.followupBool == false ? 'border-blue-500' : ''
                      "
                      class="flex p-3 block w-full bg-white border rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                    >
                      <input
                        :checked="task.followupBool == false"
                        disabled=""
                        type="radio"
                        class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                        id="Autre"
                      />
                      <span
                        class="text-sm text-gray-500 ml-3 dark:text-gray-400"
                        >Autre</span
                      >
                    </label>
                  </div>
                  <p
                    :class="
                      task.followupAutre == 'this case is empty'
                        ? 'text-red-400'
                        : ''
                    "
                    v-if="task.followupBool == false"
                    class="mt-2 focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                  >
                    {{ task.followupAutre }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
import axios from "axios";

import AddTaskPopup from "./AddTaskPopup.vue";

export default {
  setup() {
    name: "TableTr";
  },
  emits: ["add-id"],
  props: {
    task: {
      type: Object,
      required: true,
    },
    ShowDel: Boolean,
  },
  emits: ["addId"],
  methods: {
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
    getFile(num) {
      num--;
      return `http://localhost:3000/uploads/tasks/${this.task.supplyFile[num]}`;
    },
    vide() {
      const propertyKeys = Object.keys(this.task);

      for (const propertyKey of propertyKeys) {
        if (this.task[propertyKey] === "") {
          this.task[propertyKey] = "this case is empty";
        }
      }
    },
    addidtoarray() {
      this.clicked == false ? (this.clicked = true) : (this.clicked = false);
      this.$emit("add-id", this.task.id);
    },

    async totalTime() {
      await axios
        .get(`/tasks/calculate-time-difference/?id=${this.task.id}`)
        .then((response) => {
          this.totalHours = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    ShowDell() {
      if (this.ShowDel == 1 && this.task.deleted == true) {
        return 1;
      }
      if (this.ShowDel == 0 && this.task.deleted == false) {
        return 1;
      }
    },
    getimgUser() {
      return `http://localhost:3000/uploads/users/${this.user.image}`;
    },
    async fetchCreatedBy(id) {
      const response = await axios
        .get(`users/${id}`)
        .then((response) => {
          this.user = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    fetchUser() {
      axios
        .get(`/users/current-user-get`)
        .then((response) => {
          this.currentUserRole = response.data.role;
          this.currentUserId = response.data.id;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.fetchUser();
    this.task.supplyFile = this.task.supplyFile.split(",");
    this.vide();
    this.totalTime();
    this.fetchCreatedBy(this.task.createdBy);
  },
  components: {
    AddTaskPopup,
  },
  data() {
    return {
      currentUserId: Number,
      currentUserRole: "",
      popup: false,
      isOpen: false,
      clicked: false,
      totalHours: "",
      user: {},
    };
  },
};
</script>
