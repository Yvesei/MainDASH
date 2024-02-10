<template>
  <div v-if="showPopup" class="client-overlay" @click.self="close">
    <form ref="dialog" class="client-dialog" role="dialog" aria-modal="true" :aria-labelledby="titleId" @submit.prevent="save">
      <div class="dialog-heading"><h2 :id="titleId">{{ client ? 'Edit Client' : 'Add Client' }}</h2><button type="button" class="close-button" aria-label="Close" @click="close">×</button></div>
      <div class="photo-row"><img :src="preview || imageUrl" alt="" width="60" height="60" /><label class="photo-control">{{ file ? 'Change photo' : 'Choose photo' }}<input type="file" name="photo" accept="image/png,image/jpeg,image/gif,image/webp" :aria-describedby="`${titleId}-photo-hint`" @change="onFileChange" /></label><span :id="`${titleId}-photo-hint`">Optional · PNG, JPG, GIF or WebP · up to 5 MB</span></div>
      <label class="field">Name <span class="required" aria-hidden="true">*</span><input ref="nameInput" v-model.trim="name" type="text" name="name" maxlength="191" autocomplete="organization" required /></label>
      <div class="field-grid"><label class="field">Phone number<input v-model.trim="number" type="tel" name="phone" maxlength="191" autocomplete="tel" placeholder="Optional" /></label><label class="field">Distance (km)<input v-model="distance" type="number" name="distance" min="0" max="2147483647" step="1" inputmode="numeric" autocomplete="off" placeholder="Optional" /></label></div>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      <div class="dialog-actions"><button type="button" class="cancel" :disabled="saving" @click="close">Cancel</button><button type="submit" class="save" :disabled="saving">{{ saving ? 'Saving…' : client ? 'Save changes' : 'Add client' }}</button></div>
    </form>
  </div>
</template>
<script>
import axios from "axios";
export default {
  props: { showPopup: Boolean, client: { type: Object, default: null } },
  emits: ["close", "saved"],
  data() { return { name: "", number: "", distance: "", file: null, preview: "", error: "", saving: false, previousFocus: null }; },
  computed: {
    titleId() { return this.client ? `edit-client-${this.client.id}` : "add-client-title"; },
    imageUrl() { return `${axios.defaults.baseURL.replace(/\/$/, "")}/uploads/tasks/${this.client?.image || "avatar.png"}`; },
    dirty() { return this.name !== (this.client?.name || "") || this.number !== (this.client?.number || "") || String(this.distance) !== String(this.client?.distance ?? "") || !!this.file; },
  },
  watch: {
    showPopup(open) {
      if (open) {
        this.previousFocus = document.activeElement;
        this.name = this.client?.name || "";
        this.number = this.client?.number || "";
        this.distance = this.client?.distance ?? "";
        this.file = null;
        this.clearPreview();
        this.error = "";
        document.addEventListener("keydown", this.onKeydown);
        this.$nextTick(() => this.$refs.nameInput?.focus());
      } else { document.removeEventListener("keydown", this.onKeydown); this.clearPreview(); if (this.previousFocus?.isConnected) this.previousFocus.focus(); this.previousFocus = null; }
    },
  },
  beforeUnmount() { document.removeEventListener("keydown", this.onKeydown); this.clearPreview(); },
  methods: {
    onKeydown(event) {
      if (event.key === "Escape" && !this.saving) { event.preventDefault(); this.close(); return; }
      if (event.key !== "Tab" || !this.$refs.dialog) return;
      const focusable = [...this.$refs.dialog.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]')].filter(element => element.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    },
    close() { if (!this.saving && (!this.dirty || window.confirm("Discard your changes?"))) this.$emit("close"); },
    clearPreview() { if (this.preview) URL.revokeObjectURL(this.preview); this.preview = ""; },
    onFileChange(event) {
      this.clearPreview();
      this.file = event.target.files[0] || null;
      if (this.file && (!['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(this.file.type) || this.file.size > 5 * 1024 * 1024)) {
        this.file = null; event.target.value = ""; this.error = "Choose a PNG, JPEG, GIF or WebP image under 5 MB."; return;
      }
      this.error = "";
      if (this.file) this.preview = URL.createObjectURL(this.file);
    },
    async save() {
      if (this.saving) return;
      if (!this.name.trim()) { this.error = "Enter a client name."; return; }
      this.error = ""; this.saving = true;
      try {
        let image;
        if (this.file) {
          const form = new FormData(); form.append("file", this.file);
          image = (await axios.post("/tasks/upload", form)).data.name;
        }
        const data = { name: this.name, number: this.number, distance: this.distance, ...(image ? { image } : {}) };
        if (this.client) await axios.patch("/clients", { ...data, id: this.client.id });
        else await axios.post("/clients", { ...data, image: image || "avatar.png" });
        this.$emit("saved"); this.$emit("close");
      } catch (error) { this.error = error.response?.data?.error || error.response?.data?.msg || "Could not save this client. Please try again."; if (error.response?.status === 409) this.$nextTick(() => this.$refs.nameInput?.focus()); }
      finally { this.saving = false; }
    },
  },
};
</script>
<style scoped>
.client-overlay { position:fixed; inset:0; z-index:60; display:flex; align-items:center; justify-content:center; padding:20px; background:rgba(0,0,0,.5); overflow-y:auto; overscroll-behavior:contain; }
.client-dialog { width:min(100%,520px); max-height:calc(100vh - 40px); overflow-y:auto; padding:26px; background:white; border-radius:16px; box-shadow:0 20px 40px rgba(0,0,0,.15); color:#374151; }
.dialog-heading { display:flex; justify-content:space-between; align-items:center; gap:16px; }.dialog-heading h2 { font-size:18px; font-weight:700; }.close-button { color:#6b7280; font-size:26px; line-height:1; }.close-button:hover { color:#111827; }
.photo-row { display:flex; align-items:center; gap:12px; flex-wrap:wrap; padding:24px 0 4px; }.photo-row img { width:60px; height:60px; border-radius:50%; object-fit:cover; background:#f3f4f6; }.photo-control { position:relative; cursor:pointer; color:#4338ca; font-size:13px; font-weight:600; }.photo-control input { position:absolute; width:1px; height:1px; opacity:0; }.photo-control:focus-within { outline:2px solid #6366f1; outline-offset:3px; }.photo-row span { color:#6b7280; font-size:12px; }
.field { display:block; margin-top:18px; color:#4b5563; font-size:12px; font-weight:700; }.required { color:#dc2626; }.field input { display:block; width:100%; margin-top:7px; padding:10px 12px; border:1px solid #d1d5db; border-radius:6px; color:#374151; background:white; font-size:14px; font-weight:400; }.field input:focus { border-color:#6366f1; outline:2px solid #c7d2fe; }.field-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }.form-error { margin-top:14px; color:#b91c1c; font-size:13px; }.dialog-actions { display:flex; justify-content:flex-end; gap:10px; padding-top:22px; margin-top:12px; font-size:13px; font-weight:600; }.dialog-actions button { padding:10px 16px; border-radius:6px; }.dialog-actions button:disabled { opacity:.6; cursor:wait; }.cancel { color:#4b5563; }.cancel:hover { background:#f3f4f6; }.save { color:white; background:#4338ca; }.save:hover { background:#4f46e5; }
@media(max-width:500px) { .client-dialog { padding:20px; }.field-grid { grid-template-columns:1fr; gap:0; } }
</style>
