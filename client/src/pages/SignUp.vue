<script setup>
import Login from "../components/Login.vue";
import Navbar from "../components/Navbar.vue";
</script>

<template>
  <header>
    <Navbar />
    <SignUp />
    <Footer />
  </header>
</template>

<script>
export default {
  name: "app",
  components: {
    Login,
    Navbar,
  },
};
</script>
