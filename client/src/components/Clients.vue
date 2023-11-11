<template>
  <!-- component -->
  <div class="flex">
    <navbar />
    <div class="sm:px-6 w-full">
      <div class="px-4 md:px-10 py-4 md:py-7">
        <div class="flex items-center justify-between">
          <p
            tabindex="0"
            class="focus:outline-none text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800"
          >
            Clients
          </p>
        </div>
      </div>
      <div class="bg-white py-4 md:py-7 px-4 md:px-8 xl:px-10">
        <div class="sm:flex items-center justify-between">
          <div class="flex items-center">
            <a
              @click="
                fetchClients();
                selectButton('all');
              "
              class="rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800"
              href=" javascript:void(0)"
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
              class="rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8"
              href="javascript:void(0)"
            >
              <div
                :class="
                  isSelected('done')
                    ? 'py-2 px-8 bg-indigo-100 text-indigo-700'
                    : ''
                "
                @click="
                  fetchClientsDone();
                  selectButton('done');
                "
                class="py-2 px-8 text-gray-600 rounded-full"
              >
                <p>Done</p>
              </div>
            </a>
            <a
              class="rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8"
              href="javascript:void(0)"
            >
              <div
                :class="
                  isSelected('pending')
                    ? 'py-2 px-8 bg-indigo-100 text-indigo-700'
                    : ''
                "
                @click="
                  fetchClientsPending();
                  selectButton('pending');
                "
                class="py-2 px-8 text-gray-600 rounded-full"
              >
                <p>Pending</p>
              </div>
            </a>
            <a
              class="rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8"
              href="javascript:void(0)"
            >
              <div
                @click="ShowHidden()"
                class="py-2 px-8 text-gray-600 hover:text-indigo-700 hover:bg-indigo-100 rounded-full"
              >
                <p>Show Hidden</p>
              </div>
            </a>
          </div>
          <button
            @click="popup = true"
            class="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 mt-4 sm:mt-0 inline-flex items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded"
          >
            <p class="text-sm font-medium leading-none text-white">
              Add Client
            </p>
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
                      <th class="py-3 px-6 text-center">Number</th>
                      <th class="py-3 px-6 text-center">Distance</th>
                      <th class="py-3 px-6 text-center">Tasks</th>
                      <th class="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="text-gray-600 text-sm font-light">
                    <ClientRow
                      v-for="client in clients"
                      v-bind:key="client.id"
                      :ShowDel="ShowDel"
                      :client="client"
                      @client-deleted="fetchClients"
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <add-client-popup
      :show-popup="popup"
      @close="popup = false"
      @client-added="fetchClients"
    />
  </div>
</template>

<script>
import axios from "axios";

import AddClientPopup from "./AddClientPopup.vue";
import ClientRow from "./ClientRow.vue";
import navbar from "./Navbar.vue";

export default {
  setup() {
    name: "hero";
  },
  components: {
    ClientRow,
    AddClientPopup,
    navbar,
  },
  mounted() {
    this.fetchClients();
  },
  methods: {
    ShowHidden() {
      this.ShowDel = !this.ShowDel;
    },
    async fetchClientsDone() {
      this.clients = [];
      var clients = await axios.get(`/clients`);
      clients = clients.data;
      for (var client of clients) {
        axios
          .get(`/tasks?clientId=${client.id}`)
          .then((response) => {
            for (const task of response.data) {
              if (task.status === false) {
                clients = clients.filter((c) => c.id !== task.clientId);
              }
            }
            this.clients = clients;
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    async fetchClientsPending() {
      try {
        this.clients = [];
        const clients = await axios.get(`/clients`);

        // Use Promise.all to wait for all tasks requests to complete
        await Promise.all(
          clients.data.map(async (client) => {
            const response = await axios.get(`/tasks?clientId=${client.id}`);
            const tasks = response.data;

            // Check if at least one task has status === false
            if (tasks.some((task) => !task.status)) {
              this.clients.push(client);
            }
          })
        );

        // Now, this.clients will only contain clients with at least one task with status === false
      } catch (error) {
        console.error(error);
      }
    },

    // async fetchClientsPending() {
    //   this.clients = [];
    //   await axios
    //     .get(`/tasks/latest?type=Pending&deleted=undeleted`)
    //     .then((response) => {
    //       const taskPromises = [];

    //       for (const task of Object.values(response.data)) {
    //         const clientPromise = axios
    //           .get(`/clients/${task.clientId}`)
    //           .then((response) => {
    //             this.clients.push(response.data);
    //           });
    //         taskPromises.push(clientPromise);
    //       }
    //     })
    //     .then(() => {
    //       console.log(this.clients);
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    //   this.clients = Array.from(
    //     new Map(this.clients.map((client) => [client.id, client])).values()
    //   );
    //   console.log(this.clients);
    // },
    fetchClients() {
      axios
        .get(`/clients`)
        .then((response) => {
          this.clients = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    isSelected(button) {
      return this.selectedButton === button;
    },
    selectButton(button) {
      this.selectedButton = button;
    },
  },
  data() {
    return {
      popup: false,
      clients: [],
      ShowDel: false,
      selectedButton: "all",
    };
  },
};
</script>
<style></style>
