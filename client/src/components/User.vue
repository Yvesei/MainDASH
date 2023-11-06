<template>
  <div>
    <button
      @click="edituserpopup = true"
      class="flex items-center w-full px-5 py-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 gap-x-2 focus:outline-none"
    >
      <div class="relative">
        <img
          class="object-cover w-8 h-8 rounded-full"
          :src="getimg()"
          alt="pic"
        />
        <span
          class="h-2 w-2 rounded-full bg-emerald-500 absolute right-0.5 ring-1 ring-white bottom-0"
        ></span>
      </div>

      <div class="text-left rtl:text-right">
        <h1
          class="text-sm font-medium text-gray-700 capitalize dark:text-white"
        >
          {{ user.name }}
        </h1>

        <p class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</p>
      </div>
    </button>
    <EditUser
      :show-user-popup="edituserpopup"
      :user="user"
      @close="edituserpopup = false"
    />
  </div>
</template>
<script>
import EditUser from "./EditUser.vue";
import axios from "axios";

export default {
  name: "Navbar",
  components: {
    EditUser,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getimg() {
      return `http://192.168.1.146:3000/uploads/uploads/users/${this.user.image}`;
    },
  },
  data() {
    return {
      edituserpopup: false,
    };
  },
};
</script>
