<template>
  <main id="main-content" tabindex="-1" class="settings-page">
    <header>
      <p class="eyebrow">WORKSPACE / SETTINGS</p>
      <h1>Settings</h1>
      <p>Manage your profile and sign-in details.</p>
    </header>
    <div v-if="loading" class="settings-card state" role="status">
      Loading your profile…
    </div>
    <div v-else-if="loadError" class="settings-card state" role="alert">
      Could not load your profile. <button @click="load">Try again</button>
    </div>
    <form v-else class="settings-card" @submit.prevent="save">
      <div class="card-heading">
        <div>
          <h2>Your profile</h2>
          <p>This information is visible to your team.</p>
        </div>
      </div>
      <div class="avatar-row">
        <img
          :src="preview || avatarUrl"
          alt="Your profile picture"
          width="72"
          height="72"
        />
        <div>
          <div class="avatar-control">
            <label for="avatar" class="upload-button">Choose photo</label
            ><input
              id="avatar"
              ref="file"
              class="sr-only"
              type="file"
              name="avatar"
              accept="image/png,image/jpeg,image/gif,image/webp"
              aria-describedby="avatar-help"
              @change="onFileChange"
            />
          </div>
          <p id="avatar-help">PNG, JPEG, GIF or WebP. Up to 5 MB.</p>
          <button
            v-if="selectedFile"
            type="button"
            class="text-button"
            @click="clearFile"
          >
            Remove selection
          </button>
        </div>
      </div>
      <div class="fields">
        <label for="profile-name"
          >Name<input
            id="profile-name"
            v-model.trim="name"
            name="name"
            required
            maxlength="191"
            autocomplete="name" /></label
        ><label for="profile-email"
          >Email or login<input
            id="profile-email"
            v-model.trim="email"
            name="username"
            required
            maxlength="191"
            autocomplete="username"
            spellcheck="false"
        /></label>
      </div>
      <div class="password-section">
        <h3>Sign-in details</h3>
        <p>Leave the new password blank to keep your current password.</p>
        <div class="fields">
          <label for="profile-new-password"
            >New password<input
              id="profile-new-password"
              v-model="password"
              name="new-password"
              type="password"
              maxlength="1024"
              autocomplete="new-password" /></label
          ><label v-if="needsPassword" for="profile-current-password"
            >Current password<input
              id="profile-current-password"
              ref="currentPasswordField"
              v-model="currentPassword"
              name="current-password"
              type="password"
              required
              autocomplete="current-password"
              aria-describedby="current-password-help"
            /><span id="current-password-help"
              >Required to change your login or password.</span
            ></label
          >
        </div>
      </div>
      <p v-if="error" class="feedback error" role="alert">{{ error }}</p>
      <p v-if="message" class="feedback" role="status">{{ message }}</p>
      <div class="form-footer">
        <button class="save-button" type="submit" :disabled="saving">
          {{ saving ? "Saving…" : "Save changes" }}
        </button>
      </div>
    </form>
  </main>
</template>
<script>
import axios from "axios";
export default {
  name: "Settings",
  data() {
    return {
      user: {},
      name: "",
      email: "",
      password: "",
      currentPassword: "",
      selectedFile: null,
      preview: "",
      loading: true,
      loadError: false,
      saving: false,
      error: "",
      message: "",
    };
  },
  computed: {
    avatarUrl() {
      return `${axios.defaults.baseURL.replace(
        /\/$/,
        ""
      )}/uploads/users/${encodeURIComponent(this.user.image || "avatar.png")}`;
    },
    needsPassword() {
      return this.email !== this.user.email || !!this.password;
    },
  },
  mounted() {
    this.load();
  },
  beforeUnmount() {
    if (this.preview) URL.revokeObjectURL(this.preview);
  },
  methods: {
    async load() {
      this.loading = true;
      this.loadError = false;
      try {
        const { data } = await axios.get("/users/current-user-get");
        this.user = data;
        this.name = data.name;
        this.email = data.email;
      } catch (error) {
        this.loadError = true;
      } finally {
        this.loading = false;
      }
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      if (
        !["image/png", "image/jpeg", "image/gif", "image/webp"].includes(
          file.type
        ) ||
        file.size > 5 * 1024 * 1024
      ) {
        this.clearFile();
        this.error = "Choose a PNG, JPEG, GIF or WebP image under 5 MB.";
        return;
      }
      if (this.preview) URL.revokeObjectURL(this.preview);
      this.preview = URL.createObjectURL(file);
      this.selectedFile = file;
      this.error = "";
    },
    clearFile() {
      if (this.preview) URL.revokeObjectURL(this.preview);
      this.preview = "";
      this.selectedFile = null;
      if (this.$refs.file) this.$refs.file.value = "";
    },
    async save() {
      if (this.saving) return;
      this.saving = true;
      this.error = "";
      this.message = "";
      try {
        let image = this.user.image;
        if (this.selectedFile) {
          const data = new FormData();
          data.append("file", this.selectedFile);
          image = (await axios.post("/users/uploadEdit", data)).data.name;
        }
        const passwordChanged = !!this.password;
        const payload = { name: this.name, email: this.email, image };
        if (this.password) payload.password = this.password;
        if (this.needsPassword) payload.currentPassword = this.currentPassword;
        const { data } = await axios.patch("/users/current-user", payload);
        if (passwordChanged) {
          this.$router.replace({
            path: "/login",
            query: { passwordChanged: "1" },
          });
          return;
        }
        this.user = data;
        this.name = data.name;
        this.email = data.email;
        this.password = "";
        this.currentPassword = "";
        this.clearFile();
        this.message = "Your profile has been updated.";
        window.dispatchEvent(new Event("maindash-profile-updated"));
      } catch (error) {
        this.error =
          error.response?.status === 403
            ? "Your current password is incorrect."
            : error.response?.data?.error ||
              "Could not save your changes. Please try again.";
        if (error.response?.status === 403 && this.needsPassword)
          this.$nextTick(() => this.$refs.currentPasswordField?.focus());
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>
<style scoped>
.settings-page {
  flex: 1;
  min-width: 0;
  max-width: 1000px;
  margin: 0 auto;
  padding: 48px clamp(24px, 4vw, 64px);
  color: #1f2937;
}
.eyebrow {
  color: #6b7280;
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.14em;
}
.settings-page h1 {
  margin: 8px 0 6px;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.045em;
}
.settings-page header > p:last-child,
.card-heading p,
.avatar-row p,
.password-section > p {
  color: #6b7280;
  font-size: 14px;
}
.settings-card {
  margin-top: 32px;
  padding: 28px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
}
.settings-card.state {
  color: #6b7280;
}
.state button,
.text-button {
  color: #4f46e5;
  font-size: 13px;
  font-weight: 650;
  text-decoration: underline;
}
.card-heading h2 {
  font-size: 19px;
  font-weight: 700;
}
.card-heading p {
  margin-top: 5px;
  font-size: 13px;
}
.avatar-row {
  display: flex;
  align-items: center;
  gap: 18px;
  margin: 26px 0;
}
.avatar-row img {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 50%;
  background: #f8fafc;
}
.avatar-row p {
  margin-top: 8px;
  font-size: 12px;
}
.upload-button {
  display: inline-flex;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 12px;
  color: #4338ca;
  font-size: 13px;
  font-weight: 650;
}
.text-button {
  display: block;
  margin-top: 5px;
}
.fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.fields label {
  display: grid;
  gap: 8px;
  color: #4b5563;
  font-size: 13px;
  font-weight: 650;
}
.fields input {
  width: 100%;
  padding: 11px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #1f2937;
  font-weight: 400;
}
.fields label span {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 400;
}
.password-section {
  margin-top: 30px;
  padding-top: 25px;
  border-top: 1px solid #e5e7eb;
}
.password-section h3 {
  font-size: 16px;
  font-weight: 700;
}
.password-section > p {
  margin: 5px 0 20px;
  font-size: 13px;
}
.form-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 25px;
  margin-top: 25px;
  border-top: 1px solid #e5e7eb;
}
.save-button {
  padding: 11px 17px;
  border-radius: 8px;
  background: #4338ca;
  color: white;
  font-size: 13px;
  font-weight: 650;
}
.save-button:disabled {
  opacity: 0.6;
  cursor: wait;
}
.feedback {
  margin-top: 20px;
  color: #4f46e5;
  font-size: 13px;
}
.feedback.error {
  color: #b91c1c;
}
@media (max-width: 650px) {
  .settings-page {
    padding: 28px 18px;
  }
  .settings-card {
    padding: 20px;
  }
  .fields {
    grid-template-columns: 1fr;
  }
}
.avatar-control:focus-within .upload-button {
  outline: 2px solid #3b82f6;
  outline-offset: 3px;
}
.upload-button:hover {
  background: #f3f4f6;
}
.save-button:hover:not(:disabled) {
  background: #4f46e5;
}
</style>
