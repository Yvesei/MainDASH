<template>
  <section class="border-red-500 min-h-screen flex items-center justify-center">
    <div
      style="border: 1px solid #f7f7f7"
      class="w-[26rem] p-5 flex justify-center rounded-2xl shadow-lg"
    >
      <div class="px-5">
        <h2 class="mt-4 text-2xl font-bold text-[#002D74]">Login</h2>
        <p class="text-sm mt-4 text-[#002D74]">
          If you have an account, please login
        </p>
        <form @submit.prevent class="w-[20rem] mt-6" action="#" method="POST">
          <div>
            <label class="block text-gray-700">Email Address</label>
            <input
              v-model="email"
              type="email"
              name=""
              placeholder="Enter Email Address"
              class="w-full px-4 py-3 rounded-lg mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
              autofocus
              autocomplete
              required
            />
            <p v-if="WrongCred" class="text-red-500 mt-2">
              Email or Password are incorrect
            </p>
          </div>

          <div class="mt-4">
            <label class="block text-gray-700">Password</label>
            <input
              v-model="password"
              type="password"
              name=""
              placeholder="Enter Password"
              minlength="6"
              class="w-full px-4 py-3 rounded-lg mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
              required
            />
            <p v-if="WrongCred" class="text-red-500 mt-2">
              Email or Password are incorrect
            </p>
          </div>

          <div class="text-right mt-2">
            <a
              href="#"
              class="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700"
              >Forgot Password?</a
            >
          </div>

          <button
            @click="handleSubmit()"
            type="submit"
            class="w-full block bg-blue-700 hover:bg-blue-800 focus:bg-blue-400 text-white font-semibold rounded-lg px-4 py-3 mt-6 mb-6"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import Cookies from "vue-cookies";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      WrongCred: "",
    };
  },
  methods: {
    async handleSubmit() {
      const response = await axios.post("login", {
        email: this.email,
        password: this.password,
      });

      if (response.data.success) {
        Cookies.set("token", response.data.token);
        if (response.data.role === "ADMIN") this.$router.push("/");
        else this.$router.push("/tasks");
      } else {
        this.WrongCred = true;
      }
    },
  },
};
</script>
