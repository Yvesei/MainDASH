<template>
  <div class="w-full px-6 py-6 mx-auto mt-6">
    <!-- first line -->
    <div class="flex flex-wrap -mx-3">
      <div class="mb-2 w-full max-w-full px-3 sm:w-1/2 sm:flex-none xl:w-1/4">
        <div
          class="bg-[#cce4ff] relative flex flex-col min-w-0 break-words bg-white border dark:bg-slate-850 rounded-2xl bg-clip-border"
        >
          <div class="flex-auto p-4">
            <div class="flex flex-row justify-between -mx-3">
              <div class="flex-none w-2/3 max-w-full px-3">
                <div>
                  <p
                    class="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60"
                  >
                    Bonjour,
                  </p>
                  <h5 class="mb-2 font-bold dark:text-white">
                    {{ currentuser.name }}
                  </h5>
                  <router-link
                    to="/settings"
                    class="cursor-pointer flex items-center mb-0 dark:text-white dark:opacity-60"
                  >
                    Profile Settings
                    <svg
                      class="h-3 ml-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 384 512"
                    >
                      <path class="fa-primary" d="" />
                      <path
                        class="fa-secondary"
                        d="M3.4 81.7c-7.9 15.8-1.5 35 14.3 42.9L280.5 256 17.7 387.4C1.9 395.3-4.5 414.5 3.4 430.3s27.1 22.2 42.9 14.3l320-160c10.8-5.4 17.7-16.5 17.7-28.6s-6.8-23.2-17.7-28.6l-320-160c-15.8-7.9-35-1.5-42.9 14.3z"
                      />
                    </svg>
                  </router-link>
                </div>
              </div>

              <div
                class="mr-2 flex justify-center items-center rounded-full inline-block w-12 h-12 text-center rounded-circle bg-gradient-to-tl from-orange-500 to-yellow-500"
              >
                <svg
                  class="h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path
                    d="M320 128a96 96 0 1 0 -192 0 96 96 0 1 0 192 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM32 480H416c-1.2-79.7-66.2-144-146.3-144H178.3c-80 0-145 64.3-146.3 144zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-2 w-full max-w-full px-3 sm:w-1/2 sm:flex-none xl:w-1/4">
        <div
          class="relative flex flex-col min-w-0 break-words bg-white border dark:bg-slate-850 rounded-2xl bg-clip-border"
        >
          <div class="flex-auto p-4">
            <div class="flex flex-row justify-between -mx-3">
              <div class="flex-none w-2/3 max-w-full px-3">
                <div>
                  <p
                    class="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60"
                  >
                    Users
                  </p>
                  <h5 class="mb-2 font-bold dark:text-white">
                    {{ this.users.userCount }}
                  </h5>
                  <p
                    class="cursor-pointer flex items-center mb-0 dark:text-white opacity-0"
                  >
                    kkk
                  </p>
                </div>
              </div>

              <div
                class="mr-2 flex justify-center items-center rounded-full inline-block w-12 h-12 text-center rounded-circle bg-gradient-to-tl from-blue-500 to-violet-500"
              >
                <svg
                  class="h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                >
                  <path
                    d="M224 240a112 112 0 1 0 0-224 112 112 0 1 0 0 224zm-45.7 80C88.7 320 16 392.7 16 482.3c0 7.6 6.1 13.7 13.7 13.7H418.3c5.6 0 10.4-3.3 12.5-8.1l11.7 11.7c-5.4 7.5-14.2 12.5-24.2 12.5H29.7C13.3 512 0 498.7 0 482.3C0 383.8 79.8 304 178.3 304h91.4c17.5 0 34.3 2.5 50.3 7.2v16.8c-15.8-5.2-32.7-7.9-50.3-7.9H178.3zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM384 240c-8.8 0-16 7.2-16 16v82.7c0 12.7 5.1 24.9 14.1 33.9L489.4 480c12.5 12.5 32.8 12.5 45.3 0L608 406.6c12.5-12.5 12.5-32.8 0-45.3L500.7 254.1c-9-9-21.2-14.1-33.9-14.1H384zm-32 16c0-17.7 14.3-32 32-32h82.7c17 0 33.3 6.7 45.3 18.7L619.3 350.1c18.7 18.7 18.7 49.1 0 67.9l-73.4 73.4c-18.7 18.7-49.1 18.7-67.9 0L370.7 384c-12-12-18.7-28.3-18.7-45.3V256zm56 40a16 16 0 1 1 32 0 16 16 0 1 1 -32 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-2 w-full max-w-full px-3 sm:w-1/2 sm:flex-none xl:w-1/4">
        <div
          class="relative flex flex-col min-w-0 break-words bg-white border dark:bg-slate-850 rounded-2xl bg-clip-border"
        >
          <div class="flex-auto p-4">
            <div class="flex flex-row justify-between -mx-3">
              <div class="flex-none w-2/3 max-w-full px-3">
                <div>
                  <p
                    class="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60"
                  >
                    Clients
                  </p>
                  <h5 class="mb-2 font-bold dark:text-white">
                    {{ clients.clientCount }}
                  </h5>
                  <router-link
                    to="/clients"
                    class="cursor-pointer flex items-center mb-0 dark:text-white dark:opacity-60"
                  >
                    See all clients
                    <svg
                      class="h-3 ml-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 384 512"
                    >
                      <path class="fa-primary" d="" />
                      <path
                        class="fa-secondary"
                        d="M3.4 81.7c-7.9 15.8-1.5 35 14.3 42.9L280.5 256 17.7 387.4C1.9 395.3-4.5 414.5 3.4 430.3s27.1 22.2 42.9 14.3l320-160c10.8-5.4 17.7-16.5 17.7-28.6s-6.8-23.2-17.7-28.6l-320-160c-15.8-7.9-35-1.5-42.9 14.3z"
                      />
                    </svg>
                  </router-link>
                </div>
              </div>

              <div
                class="mr-2 flex justify-center items-center rounded-full inline-block w-12 h-12 text-center rounded-circle bg-gradient-to-tl from-red-600 to-orange-600"
              >
                <svg
                  class="h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                >
                  <path
                    d="M96 80a48 48 0 1 1 96 0A48 48 0 1 1 96 80zm128 0A80 80 0 1 0 64 80a80 80 0 1 0 160 0zm96 80a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm0 160a96 96 0 1 0 0-192 96 96 0 1 0 0 192zm-58.7 64H378.7c54.2 0 98.4 42.5 101.2 96H160.1c2.8-53.5 47-96 101.2-96zm0-32C187.7 352 128 411.7 128 485.3c0 14.7 11.9 26.7 26.7 26.7H485.3c14.7 0 26.7-11.9 26.7-26.7C512 411.7 452.3 352 378.7 352H261.3zM512 32a48 48 0 1 1 0 96 48 48 0 1 1 0-96zm0 128A80 80 0 1 0 512 0a80 80 0 1 0 0 160zm16 64c44.2 0 80 35.8 80 80c0 8.8 7.2 16 16 16s16-7.2 16-16c0-61.9-50.1-112-112-112H444c2.6 10.2 4 21 4 32h80zm-336 0c0-11 1.4-21.8 4-32H112C50.1 192 0 242.1 0 304c0 8.8 7.2 16 16 16s16-7.2 16-16c0-44.2 35.8-80 80-80h80z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-2 w-full max-w-full px-3 sm:w-1/2 sm:flex-none xl:w-1/4">
        <div
          class="relative flex flex-col min-w-0 break-words bg-white border dark:bg-slate-850 rounded-2xl bg-clip-border"
        >
          <div class="flex-auto p-4">
            <div class="flex flex-row justify-between -mx-3">
              <div class="flex-none w-2/3 max-w-full px-3">
                <div>
                  <p
                    class="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60"
                  >
                    Tasks
                  </p>
                  <h5 class="mb-2 font-bold dark:text-white">
                    {{ tasks.taskCount }}
                  </h5>
                  <p class="mb-0 dark:text-white dark:opacity-60">
                    <span class="text-sm font-bold leading-normal text-red-600"
                      >{{ tasks.percent }}%</span
                    >
                    Are Done
                  </p>
                </div>
              </div>

              <div
                class="mr-2 flex justify-center items-center rounded-full inline-block w-12 h-12 text-center rounded-circle bg-gradient-to-tl from-emerald-500 to-teal-400"
              >
                <svg
                  class="h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M156.3 58.2c5.7-6.8 4.7-16.9-2-22.5s-16.9-4.7-22.5 2L62.9 120.3 27.3 84.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l48 48c3.2 3.2 7.5 4.9 12 4.7s8.7-2.3 11.6-5.7l80-96zm0 160c5.7-6.8 4.7-16.9-2-22.5s-16.9-4.7-22.5 2L62.9 280.3 27.3 244.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l48 48c3.2 3.2 7.5 4.9 12 4.7s8.7-2.3 11.6-5.7l80-96zM192 96c0 8.8 7.2 16 16 16H496c8.8 0 16-7.2 16-16s-7.2-16-16-16H208c-8.8 0-16 7.2-16 16zm0 160c0 8.8 7.2 16 16 16H496c8.8 0 16-7.2 16-16s-7.2-16-16-16H208c-8.8 0-16 7.2-16 16zM160 416c0 8.8 7.2 16 16 16H496c8.8 0 16-7.2 16-16s-7.2-16-16-16H176c-8.8 0-16 7.2-16 16zm-64 0a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-2 flex flex-wrap mt-6 -mx-3">
      <div class="mb-2 w-full max-w-full px-3 mt-0 lg:w-8/12 lg:flex-none">
        <div
          class="border-black/12.5 dark:bg-slate-850 relative z-20 flex min-w-0 flex-col break-words rounded-2xl border border-solid bg-white bg-clip-border"
        >
          <div
            class="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pt-4 pb-0"
          >
            <h6 class="capitalize dark:text-white">Tasks overview</h6>
            <p
              class="mb-0 text-sm leading-normal dark:text-white dark:opacity-60"
            >
              <i class="fa fa-arrow-up text-emerald-500" aria-hidden="true"></i>
              <span class="font-semibold">This year</span>
            </p>
          </div>
          <div class="flex-auto p-4">
            <div>
              <linechart />
            </div>
          </div>
        </div>
      </div>
      <div class="mb-2 w-full max-w-full px-3 mt-0 lg:w-4/12 lg:flex-none">
        <div
          class="border-black/12.5 dark:bg-slate-850 relative z-20 flex min-w-0 flex-col break-words rounded-2xl border border-solid bg-white bg-clip-border"
        >
          <div
            class="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pt-4 pb-0"
          >
            <h6 class="capitalize dark:text-white">Tasks Done & Pending</h6>
            <p
              class="p-5 text-sm leading-normal dark:text-white dark:opacity-60"
            ></p>
          </div>
          <div class="flex-auto p-4">
            <div class="flex justify-center items-center">
              <piechart />
            </div>
          </div>
        </div>
        <router-link to="/tasks" class="mt-5 w-full max-w-full px-3">
          <div
            class="bg-[#027bff] text-white relative flex flex-col min-w-0 break-words border dark:bg-slate-850 rounded-2xl bg-clip-border"
          >
            <div class="flex-auto p-4">
              <div class="flex flex-row justify-between -mx-3">
                <div class="flex-none w-2/3 max-w-full px-3">
                  <h5 class="font-bold dark:text-white">See all Tasks</h5>
                </div>

                <div
                  class="mr-2 flex justify-center items-center rounded-full inline-block text-center rounded-circle"
                >
                  <svg
                    fill="white"
                    class="h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      d="M445.5 261.8c1.6-1.5 2.5-3.6 2.5-5.8s-.9-4.3-2.5-5.8l-192-184c-3.2-3.1-8.3-2.9-11.3 .2s-2.9 8.3 .2 11.3L420.1 248 8 248c-4.4 0-8 3.6-8 8s3.6 8 8 8l412.1 0L242.5 434.2c-3.2 3.1-3.3 8.1-.2 11.3s8.1 3.3 11.3 .2l192-184z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import Chart from "chart.js/auto";
import linechart from "./linechart.vue";
import piechart from "./piechart.vue";
import Chart from "chart.js/auto";

export default {
  components: {
    linechart,
    piechart,
  },
  setup() {
    name: "Home";
  },
  mounted() {
    this.fetchAll();
  },
  methods: {
    fetchAll() {
      axios
        .get(`/users/current-user-get`)
        .then((response) => {
          this.currentuser = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
      axios
        .get(`/tasks/countAll`)
        .then((response) => {
          this.tasks = response.data;
        })
        .catch((error) => {
          console.error(error);
        });

      axios
        .get(`/clients/countAll`)
        .then((response) => {
          this.clients = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
      //users
      axios
        .get(`/users/countAll`)
        .then((response) => {
          this.users = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },

  data() {
    return {
      currentuser: {},
      tasks: 0,
      clients: 0,
      users: 0,
    };
  },
};
</script>
<style></style>
