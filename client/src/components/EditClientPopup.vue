<template>
  <ClientForm
    :show-popup="showPopup"
    :client="client"
    @close="$emit('close')"
    @saved="$emit('client-updated')"
  />
</template>
<script>
import ClientForm from "./ClientForm.vue";
export default {
  components: { ClientForm },
  props: { showPopup: Boolean, client: { type: Object, required: true } },
  emits: ["close", "client-updated"],
};
</script>
