<template>
  <a class="skip-link" href="#main-content">Skip to content</a><router-view />
</template>
<script>
export default {
  name: "App",
  watch: {
    $route: {
      immediate: true,
      handler(to) {
        document.title = to.meta.title || "MainDash";
      },
    },
  },
};
</script>
