import { createRouter, createWebHistory } from "vue-router";
import Cookies from "vue-cookies";

import axios from "axios";

import Home from "./pages/Home.vue";
import Login from "./pages/Login.vue";
import Tasks from "./pages/Tasks.vue";
import Settings from "./pages/Settings.vue";
import Clients from "./pages/Clients.vue";
import Result from "./pages/Result.vue";

const routes = [
  {
    path: "/",
    component: Home,
    meta: { requiresAuth: true, title: "MainDash - Dashboard" },
  },
  {
    path: "/tasks",
    component: Tasks,
    meta: { requiresAuth: true, title: "MainDash - Tasks" },
  },
  {
    path: "/clients",
    component: Clients,
    meta: { requiresAuth: true, title: "MainDash - Clients" },
  },
  { path: "/login", component: Login, title: "MainDash - Login" },
  {
    path: "/result",
    component: Result,
    meta: { requiresAuth: true, title: "MainDash - Result" },
  },
  {
    path: "/settings",
    component: Settings,
    meta: { requiresAuth: true, title: "MainDash - Settings" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    try {
      const response = await axios.get("users/verify-user", {
        withCredentials: true,
      });
      if (response.data.success) {
        next();
      } else {
        next("/login");
      }
    } catch (error) {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
