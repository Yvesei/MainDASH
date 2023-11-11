<script setup>
import SignUp from "./components/SignUp.vue";
import Login from "./components/Login.vue";
import Navbar from "./components/Navbar.vue";
import Hero from "./components/Hero.vue";
import Result from "./components/Result.vue";
</script>

<template>
  <router-view></router-view>
</template>

<script>
export default {
  watch: {
    $route: {
      immediate: true,
      handler(to, from) {
        document.title = to.meta.title || "MainDash";
      },
    },
  },
  name: "app",
  components: {
    SignUp,
    Login,
    Navbar,
    Hero,
    Result,
  },
};
</script>
