<script setup>
import SignUp from "./components/SignUp.vue";
import Login from "./components/Login.vue";
import Navbar from "./components/Navbar.vue";
import Hero from "./components/Hero.vue";
</script>

<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "app",
  components: {
    SignUp,
    Login,
    Navbar,
    Hero,
  },
};
</script>
