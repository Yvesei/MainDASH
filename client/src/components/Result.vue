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
                      14:21
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
                      34 km
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
    async fetchUser() {
      const id = localStorage.getItem("clientResult");
      await axios
        .get(`/clients/${id}`)
        .then((response) => {
          this.client = response.data;
          axios
            .get(`/tasks?clientId=${response.data.id}`)
            .then((response) => {
              this.tasks = response.data;
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getimg() {
      return `http://localhost:3000/uploads/tasks/${this.client.image}`;
    },
  },
  mounted() {
    this.fetchUser();
  },
  data() {
    return {
      popup: false,
      client: {},
      tasks: [],
    };
  },
};
</script>
<style></style>
