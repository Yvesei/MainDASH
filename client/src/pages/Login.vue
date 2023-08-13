<script setup>
import Login from "../components/Login.vue";
</script>

<template>
  <header>
    <Login />
  </header>
</template>

<script>
export default {
  name: "app",
  components: {
    Login,
  },
};
</script>
