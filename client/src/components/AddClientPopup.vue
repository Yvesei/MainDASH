<template>
  <ClientForm
    :show-popup="showPopup"
    @close="$emit('close')"
    @saved="$emit('client-added')"
  />
</template>
<script>
import ClientForm from "./ClientForm.vue";
export default {
  components: { ClientForm },
  props: { showPopup: Boolean },
  emits: ["close", "client-added"],
};
</script>
