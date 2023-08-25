<template>
  <aside class="flex">
    <div
      class="flex flex-col items-center w-16 h-screen py-8 space-y-8 bg-white dark:bg-gray-900 dark:border-gray-700"
    >
      <a href="#">
        <img class="w-auto h-6" src="" alt="" />
      </a>

      <router-link
        to="/"
        href="#"
        class="p-1.5 text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      </router-link>
      <!--
  text-blue-500
bg-blue-100
dark:text-blue-400
 dark:bg-gray-800
-->
      <a
        @click="showusers = !showusers"
        href="#"
        class="p-1.5 text-gray-500 transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
          />
        </svg>
      </a>

      <router-link
        to="/clients"
        href="#"
        class="p-1.5 text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
          />
        </svg>
      </router-link>

      <router-link
        to="result"
        href="#"
        class="p-1.5 text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100"
      >
        <svg
          class="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
        >
          <!--! Font Awesome Pro 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
          <path
            d="M64 16C37.5 16 16 37.5 16 64V448c0 26.5 21.5 48 48 48H320c26.5 0 48-21.5 48-48V64c0-26.5-21.5-48-48-48H64zM0 64C0 28.7 28.7 0 64 0H320c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zM96 80c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16H288c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H96zM64 96c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V96zM80 224a16 16 0 1 0 32 0 16 16 0 1 0 -32 0zm16 32a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm0 80a16 16 0 1 0 0-32 16 16 0 1 0 0 32zm32-16a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm64 80H96c-8.8 0-16 7.2-16 16s7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16zM96 384h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm96-144a16 16 0 1 0 0-32 16 16 0 1 0 0 32zm32-16a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm-48 96a16 16 0 1 0 32 0 16 16 0 1 0 -32 0zm16 32a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm96-112a16 16 0 1 0 0-32 16 16 0 1 0 0 32zm32-16a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm-48 96a16 16 0 1 0 32 0 16 16 0 1 0 -32 0zm16 32a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm0 80a16 16 0 1 0 0-32 16 16 0 1 0 0 32zm32-16a32 32 0 1 1 -64 0 32 32 0 1 1 64 0z"
          />
        </svg>
      </router-link>

      <router-link
        to="/settings"
        href="#"
        class="p-1.5 text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </router-link>
    </div>
    <!-- accounts -->

    <div
      v-if="showusers"
      class="h-screen py-8 overflow-y-auto bg-white border-l border-r sm:w-64 w-60 dark:bg-gray-900 dark:border-gray-700"
    >
      <h2 class="px-5 text-lg font-medium text-gray-800 dark:text-white">
        Accounts
      </h2>
      <!-- users -->
      <div class="mt-8 space-y-4 flex" style="flex-direction: column">
        <User v-for="user in users" v-bind:key="user.id" :user="user" />
        <button
          @click="Userpopup = true"
          class="mx-4 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 mt-4 sm:mt-0 items-start justify-center px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded"
        >
          <p class="text-sm font-medium leading-none text-white">Add User</p>
        </button>
      </div>
    </div>
    <create-user :show-user-popup="Userpopup" @close="Userpopup = false" />
  </aside>
</template>

<script>
import axios from "axios";
import CreateUser from "./CreateUser.vue";
import User from "./User.vue";

export default {
  name: "Navbar",
  components: {
    CreateUser,
    User,
  },
  data() {
    return {
      users: [],
      showusers: false,
      Userpopup: false,
    };
  },
  methods: {
    fetchUsers() {
      axios
        .get(`/users`)
        .then((response) => {
          this.users = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>
<style>
a.router-link-active {
  color: #007bff;
  background-color: #cce4ff;
  /* color: #0055d4;
  background-color: #292b2c; */
}
</style>
