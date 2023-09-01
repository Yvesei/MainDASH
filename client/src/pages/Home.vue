<script setup>
import Home from "../components/Home.vue";
import Navbar from "../components/Navbar.vue";
</script>

<template>
  <div class="flex justify-between">
    <Navbar />
    <Home />
  </div>
</template>

<script>
export default {
  name: "app",
  components: {
    Home,
    Navbar,
  },
};
</script>
