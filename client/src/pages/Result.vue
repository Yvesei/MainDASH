<script setup>
import Result from "../components/Result.vue";
import Hero from "../components/Hero.vue";
</script>

<template>
  <div>
    <Result />
  </div>
</template>

<script>
export default {
  name: "app",
  components: {
    Hero,
    Result,
  },
};
</script>
