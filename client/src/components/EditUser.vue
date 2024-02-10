<template>
  <AccountDialog
    :open="showUserPopup"
    :user="user"
    @close="$emit('close')"
    @saved="$emit('updated')"
  />
</template>
<script>
import AccountDialog from "./AccountDialog.vue";
export default {
  components: { AccountDialog },
  props: { showUserPopup: Boolean, user: { type: Object, required: true } },
  emits: ["close", "updated"],
};
</script>
