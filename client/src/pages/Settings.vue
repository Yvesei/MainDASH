<script setup>
import Settings from "../components/Settings.vue";
import Hero from "../components/Hero.vue";
import Navbar from "../components/Navbar.vue";
</script>

<template>
  <div class="flex justify-between">
    <Navbar />
    <Settings />
    <div></div>
  </div>
</template>

<script>
export default {
  name: "app",
  components: {
    Navbar,
    Hero,
    Settings,
  },
};
</script>
