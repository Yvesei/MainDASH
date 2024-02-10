<template>
  <aside class="sidebar">
    <div class="sidebar-main">
      <router-link
        to="/settings"
        class="avatar-link"
        title="Profile settings"
        aria-label="Profile settings"
      >
        <img :src="getimg()" alt="" width="32" height="32" />
      </router-link>
      <nav class="nav-links" aria-label="Main navigation">
        <router-link
          v-if="currentuser.role === 'ADMIN'"
          to="/"
          class="nav-link"
          title="Overview"
          aria-label="Overview"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
          >
            <path
              d="M3 10.5 12 3l9 7.5M5.5 9.5V20h5v-6h3v6h5V9.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            /></svg
          ><span>Overview</span>
        </router-link>
        <router-link
          to="/tasks"
          class="nav-link"
          title="Tasks"
          aria-label="Tasks"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
          >
            <path
              d="m4 7 2 2 3-3M11 8h9M4 16l2 2 3-3m2 1h9"
              stroke-linecap="round"
              stroke-linejoin="round"
            /></svg
          ><span>Tasks</span>
        </router-link>
        <router-link
          to="/clients"
          class="nav-link"
          title="Clients"
          aria-label="Clients"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
          >
            <circle cx="9" cy="8" r="3" />
            <path
              d="M3.5 20v-1.5a5.5 5.5 0 0 1 11 0V20M16 5.3a3 3 0 0 1 0 5.4M17 14a5 5 0 0 1 3.5 4.8V20"
              stroke-linecap="round"
            /></svg
          ><span>Clients</span>
        </router-link>
        <router-link
          to="/result"
          class="nav-link"
          title="Reports"
          aria-label="Reports"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
          >
            <path
              d="M4 20h16M7 17v-5m5 5V5m5 12V9"
              stroke-linecap="round"
            /></svg
          ><span>Reports</span>
        </router-link>
        <button
          v-if="currentuser.role === 'ADMIN'"
          ref="accountToggle"
          class="nav-link"
          :class="{ 'is-active': showusers }"
          :aria-expanded="showusers"
          aria-controls="accounts-panel"
          @keydown.esc.stop="closeAccounts"
          title="Accounts"
          aria-label="Accounts"
          @click="showusers = !showusers"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
          >
            <circle cx="12" cy="8" r="3" />
            <path d="M5 20a7 7 0 0 1 14 0" stroke-linecap="round" /></svg
          ><span>Accounts</span>
        </button>
      </nav>
      <div class="sidebar-bottom">
        <router-link
          to="/settings"
          class="nav-link"
          title="Settings"
          aria-label="Settings"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
          >
            <circle cx="12" cy="12" r="3" />
            <path
              d="M19 12a7 7 0 0 0-.1-1l1.4-1.1-1.5-2.6-1.7.7a7 7 0 0 0-1.7-1L15 5H9l-.4 2a7 7 0 0 0-1.7 1l-1.7-.7-1.5 2.6L5.1 11a7 7 0 0 0 0 2l-1.4 1.1 1.5 2.6 1.7-.7a7 7 0 0 0 1.7 1l.4 2h6l.4-2a7 7 0 0 0 1.7-1l1.7.7 1.5-2.6-1.4-1.1a7 7 0 0 0 .1-1Z"
              stroke-linejoin="round"
            /></svg
          ><span>Settings</span>
        </router-link>
        <button
          class="nav-link"
          title="Sign out"
          aria-label="Sign out"
          @click="logOut"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
          >
            <path
              d="M10 4H5v16h5m5-4 4-4-4-4m4 4H9"
              stroke-linecap="round"
              stroke-linejoin="round"
            /></svg
          ><span>Sign out</span>
        </button>
      </div>
    </div>
    <div
      v-if="showusers"
      id="accounts-panel"
      class="accounts-panel"
      @keydown.esc.stop="closeAccounts"
    >
      <div class="accounts-heading">
        <div><h2>Accounts</h2></div>
        <button aria-label="Close accounts" @click="closeAccounts">×</button>
      </div>
      <div class="accounts-list">
        <User
          v-for="user in users"
          :key="user.id"
          :user="user"
          @updated="fetchUser"
        />
      </div>
      <button class="add-account" @click="Userpopup = true">+ Add user</button>
    </div>
    <create-user
      :show-user-popup="Userpopup"
      @close="Userpopup = false"
      @user-added="fetchUsers"
    />
  </aside>
</template>

<script>
import axios from "axios";
import CreateUser from "./CreateUser.vue";
import User from "./User.vue";

export default {
  name: "Navbar",
  components: { CreateUser, User },
  data() {
    return { users: [], currentuser: {}, showusers: false, Userpopup: false };
  },
  methods: {
    closeAccounts() {
      this.showusers = false;
      this.$nextTick(() => this.$refs.accountToggle?.focus());
    },
    async fetchUsers() {
      try {
        this.users = (await axios.get("/users")).data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchUser() {
      try {
        this.currentuser = (await axios.get("/users/current-user-get")).data;
        if (this.currentuser.role === "ADMIN") this.fetchUsers();
        else {
          this.showusers = false;
          this.users = [];
          if (this.$route.path === "/") this.$router.replace("/tasks");
        }
      } catch (error) {
        console.error(error);
      }
    },
    getimg() {
      return `${axios.defaults.baseURL.replace(/\/$/, "")}/uploads/users/${
        this.currentuser.image || "avatar.png"
      }`;
    },
    async logOut() {
      try {
        await axios.post("/login/logout");
        this.$router.push("/login");
      } catch (error) {
        console.error("Error during logout:", error);
      }
    },
  },
  mounted() {
    this.fetchUser();
    window.addEventListener("maindash-profile-updated", this.fetchUser);
  },
  beforeUnmount() {
    window.removeEventListener("maindash-profile-updated", this.fetchUser);
  },
};
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-shrink: 0;
  min-height: 100vh;
  position: relative;
  z-index: 20;
}
.sidebar-main {
  width: 64px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0 24px;
  background: #fff;
}
.avatar-link {
  margin-bottom: 30px;
  border-radius: 50%;
}
.avatar-link img {
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 50%;
  background: #f3f4f6;
}
.nav-links,
.sidebar-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
}
.sidebar-bottom {
  margin-top: 22px;
}
.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  text-decoration: none;
}
.nav-link span {
  display: none;
}
.nav-link svg {
  width: 22px;
  height: 22px;
}
.nav-link:hover {
  background: #f3f4f6;
  color: #374151;
}
.nav-link.router-link-exact-active,
.nav-link.is-active {
  background: #cce4ff;
  color: #007bff;
}
.accounts-panel {
  width: 250px;
  min-height: 100vh;
  padding: 32px 16px;
  background: white;
  border-left: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
}
.accounts-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 4px 20px;
}
.accounts-heading h2 {
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
}
.accounts-heading button {
  color: #6b7280;
  font-size: 24px;
  line-height: 1;
}
.accounts-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.add-account {
  width: 100%;
  padding: 11px;
  margin-top: 20px;
  border-radius: 6px;
  background: #4338ca;
  color: #fff;
  font-weight: 600;
  font-size: 13px;
}
.add-account:hover {
  background: #4f46e5;
}
@media (max-width: 800px) {
  .accounts-panel {
    position: absolute;
    left: 64px;
    top: 0;
    box-shadow: 8px 0 24px #1118271a;
  }
}
</style>
