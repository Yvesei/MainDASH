<template>
  <main id="main-content" tabindex="-1" class="login-page">
    <section class="login-card">
      <h1>Login</h1>
      <p class="description">Sign in to your account.</p>
      <p v-if="$route.query.passwordChanged" class="login-notice" role="status">
        Your password was updated. Please sign in again.
      </p>
      <form @submit.prevent="handleSubmit">
        <label for="email">Email or username</label>
        <input
          id="email"
          v-model.trim="email"
          name="email"
          type="text"
          autocomplete="username"
          placeholder="Enter email or username"
          required
        />
        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          name="password"
          type="password"
          autocomplete="current-password"
          placeholder="Enter password"
          required
        />
        <p v-if="error" class="login-error" role="alert">{{ error }}</p>
        <button type="submit" :disabled="loading">
          {{ loading ? "Signing in…" : "Log in" }}
        </button>
      </form>
      <p class="login-help">
        Need access? Contact your workspace administrator.
      </p>
    </section>
  </main>
</template>
<script>
import axios from "axios";
export default {
  name: "Login",
  data() {
    return { email: "", password: "", error: "", loading: false };
  },
  methods: {
    async handleSubmit() {
      if (this.loading) return;
      this.error = "";
      this.loading = true;
      try {
        const { data } = await axios.post("login", {
          email: this.email,
          password: this.password,
        });
        if (data.success) {
          const redirect = this.$route.query.redirect;
          const destination =
            typeof redirect === "string" &&
            redirect.startsWith("/") &&
            !redirect.startsWith("//")
              ? redirect
              : data.role === "ADMIN"
              ? "/"
              : "/tasks";
          this.$router.push(destination);
        } else this.error = "The email address or password is incorrect.";
      } catch (error) {
        this.error =
          error.response?.status === 429
            ? "Too many sign-in attempts. Please wait and try again."
            : "Could not sign in. Please check your connection and try again.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #fff;
  color: #002d74;
}
.login-card {
  width: min(100%, 416px);
  padding: 36px 40px;
  border: 1px solid #f3f4f6;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}
.login-card h1 {
  font-size: 24px;
  font-weight: 700;
}
.description {
  margin-top: 10px;
  font-size: 14px;
}
.login-card form {
  margin-top: 24px;
}
.login-card label {
  display: block;
  margin: 16px 0 8px;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
}
.login-card input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #111827;
}
.login-card input:focus {
  border-color: #3b82f6;
}
.login-card form button {
  width: 100%;
  margin-top: 24px;
  padding: 12px;
  border-radius: 8px;
  background: #1d4ed8;
  color: #fff;
  font-weight: 600;
}
.login-card form button:hover {
  background: #1e40af;
}
.login-card form button:disabled {
  opacity: 0.65;
}
.login-notice {
  margin-top: 16px;
  color: #1d4ed8;
  font-size: 13px;
}
.login-error {
  margin-top: 12px;
  color: #dc2626;
  font-size: 13px;
}
.login-help {
  margin-top: 20px;
  color: #6b7280;
  font-size: 12px;
  line-height: 1.5;
}
@media (max-width: 480px) {
  .login-card {
    padding: 28px 24px;
  }
}
</style>
