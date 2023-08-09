<script setup>
import SignUp from "../components/SignUp.vue";
import Login from "../components/Login.vue";
import Canva from "../components/Canva.vue";
import Hero from "../components/Hero.vue";
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
</script>

<template>
  <header>
    <Hero />
  </header>
</template>

<script>
export default {
  name: "app",
  components: {
    SignUp,
    Login,
    Navbar,
    Canva,
    Hero,
    Footer,
  },
};
</script>
