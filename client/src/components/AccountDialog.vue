<template>
  <div v-if="open" class="account-overlay" @click.self="close" @keydown.esc="close">
    <form class="account-dialog" role="dialog" aria-modal="true" :aria-labelledby="titleId" @submit.prevent="save">
      <div class="heading"><div><p class="eyebrow">WORKSPACE ACCOUNTS</p><h2 :id="titleId">{{ editing ? 'Edit account' : 'Add an account' }}</h2></div><button type="button" aria-label="Close" :disabled="busy" @click="close">×</button></div>
      <div class="avatar-row">
        <img :src="preview || avatar" alt="" />
        <label class="upload">Choose photo<input type="file" accept="image/png,image/jpeg,image/gif,image/webp" @change="onFileChange" /></label>
        <span>PNG, JPEG, GIF or WebP · 5 MB max</span>
      </div>
      <div class="fields">
        <label>Name<input ref="nameField" v-model.trim="form.name" required maxlength="191" autocomplete="name" /></label>
        <label>Email or username<input v-model.trim="form.email" required maxlength="191" autocomplete="off" /></label>
        <label>{{ editing ? 'New password (optional)' : 'Password' }}<input v-model="form.password" type="password" :required="!editing" maxlength="1024" autocomplete="new-password" :placeholder="editing ? 'Leave blank to keep current password' : ''" /></label>
        <label>Role<select v-model="form.role"><option value="USER">Team member</option><option value="ADMIN">Administrator</option></select></label>
      </div>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <div v-if="confirmDelete" class="delete-confirm" role="alert"><span>Delete {{ user.name }}? This cannot be undone.</span><div><button type="button" :disabled="busy" @click="confirmDelete = false">Cancel</button><button type="button" class="delete" :disabled="busy" @click="remove">Confirm delete</button></div></div>
      <div class="actions"><button v-if="editing && !confirmDelete" type="button" class="delete-link" :disabled="busy" @click="confirmDelete = true">Delete account</button><div class="right"><button type="button" :disabled="busy" @click="close">Cancel</button><button class="primary" type="submit" :disabled="busy">{{ busy ? 'Saving…' : (editing ? 'Save changes' : 'Create account') }}</button></div></div>
    </form>
  </div>
</template>
<script>
import axios from "axios";
export default {
  props: { open: Boolean, user: { type: Object, default: null } },
  emits: ["close", "saved"],
  data() { return { form: { name: "", email: "", password: "", role: "USER" }, file: null, preview: "", error: "", busy: false, confirmDelete: false }; },
  computed: {
    editing() { return !!this.user; },
    titleId() { return `account-dialog-${this.user?.id || 'new'}`; },
    avatar() { return `${axios.defaults.baseURL.replace(/\/$/, "")}/uploads/users/${this.user?.image || "avatar.png"}`; },
  },
  watch: {
    open(value) {
      if (!value) return;
      this.form = { name: this.user?.name || "", email: this.user?.email || "", password: "", role: this.user?.role || "USER" };
      this.clearFile(); this.error = ""; this.confirmDelete = false;
      this.$nextTick(() => this.$refs.nameField?.focus());
    },
  },
  beforeUnmount() { this.clearFile(); },
  methods: {
    clearFile() { if (this.preview) URL.revokeObjectURL(this.preview); this.preview = ""; this.file = null; },
    onFileChange(event) { this.clearFile(); this.file = event.target.files[0] || null; if (this.file) this.preview = URL.createObjectURL(this.file); },
    close() { if (!this.busy) this.$emit("close"); },
    async save() {
      if (this.busy) return;
      this.busy = true; this.error = "";
      try {
        const payload = { ...this.form };
        if (this.file) {
          if (this.file.size > 5 * 1024 * 1024) { this.error = "The photo must be 5 MB or smaller."; return; }
          const body = new FormData(); body.append("file", this.file);
          payload.image = (await axios.post(this.editing ? "/users/uploadEdit" : "/users/upload", body)).data.name;
        }
        if (this.editing) await axios.patch("/users", { ...payload, id: this.user.id });
        else await axios.post("/users", payload);
        this.$emit("saved"); this.$emit("close");
      } catch (error) { this.error = error.response?.data?.error || "Could not save this account. Please try again."; }
      finally { this.busy = false; }
    },
    async remove() {
      if (this.busy) return;
      this.busy = true; this.error = "";
      try { await axios.delete(`/users/${this.user.id}`); this.$emit("saved"); this.$emit("close"); }
      catch (error) { this.error = error.response?.data?.error || "Could not delete this account. Please try again."; }
      finally { this.busy = false; }
    },
  },
};
</script>
<style scoped>
.account-overlay { position:fixed; inset:0; z-index:100; display:grid; place-items:center; padding:18px; background:#192921a8; overflow:auto; }.account-dialog { width:min(100%,520px); max-height:calc(100vh - 36px); overflow:auto; padding:28px; border:1px solid #e5e7eb; border-radius:12px; background:#ffffff; color:#1f2937; }.heading { display:flex; justify-content:space-between; align-items:flex-start; }.heading button { font-size:26px; color:#6b7280; line-height:1; }.eyebrow { color:#6b7280; font-size:10px; font-weight:700; letter-spacing:.13em; }.heading h2 { margin-top:8px;  font-size:20px; font-weight:700; letter-spacing:-.03em; }.avatar-row { display:flex; flex-wrap:wrap; align-items:center; gap:12px; margin:24px 0; }.avatar-row img { width:52px; height:52px; object-fit:cover; border-radius:50%; background:#f8fafc; }.avatar-row span { color:#9ca3af; font-size:11px; }.upload { position:relative; padding:8px 10px; border:1px solid #e5e7eb; border-radius:8px; color:#4338ca; font-size:12px; font-weight:650; cursor:pointer; }.upload input { position:absolute; width:1px; height:1px; opacity:0; }.fields { display:grid; gap:15px; }.fields label { display:grid; gap:6px; color:#4b5563; font-size:12px; font-weight:650; }.fields input,.fields select { width:100%; border:1px solid #e5e7eb; border-radius:8px; padding:10px 12px; color:#1f2937; background:#fff; font-size:14px; font-weight:400; }.error { margin-top:14px; color:#b91c1c; font-size:13px; }.actions { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:24px; font-size:13px; font-weight:650; }.right { display:flex; align-items:center; gap:14px; margin-left:auto; }.primary { padding:11px 15px; border-radius:8px; background:#4338ca; color:white; }.delete-link,.delete { color:#b91c1c; }.delete-confirm { margin-top:20px; padding:12px; background:#fff4f1; border-radius:8px; color:#82423b; font-size:13px; }.delete-confirm div { display:flex; gap:14px; margin-top:10px; font-weight:650; }button:disabled { opacity:.55; cursor:wait; }
</style>
