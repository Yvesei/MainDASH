<template>
  <AccountDialog
    :open="showUserPopup"
    @close="$emit('close')"
    @saved="$emit('user-added')"
  />
</template>
<script>
import AccountDialog from "./AccountDialog.vue";
export default {
  components: { AccountDialog },
  props: { showUserPopup: Boolean },
  emits: ["close", "user-added"],
};
</script>
