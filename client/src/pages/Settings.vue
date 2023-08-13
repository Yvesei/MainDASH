<script setup>
import Settings from "../components/Settings.vue";
import Hero from "../components/Hero.vue";
import Navbar from "../components/Navbar.vue";
</script>

<template>
  <header>
    <Navbar />
    <Settings />
    <Footer />
  </header>
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
