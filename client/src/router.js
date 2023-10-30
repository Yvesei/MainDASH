import { createRouter, createWebHistory } from "vue-router";
import Cookies from "vue-cookies";

import axios from "axios";

import Home from "./pages/Home.vue";
import Login from "./pages/Login.vue";
import Tasks from "./pages/Tasks.vue";
import SignUp from "./pages/SignUp.vue";
import Settings from "./pages/Settings.vue";
import Clients from "./pages/Clients.vue";
import Result from "./pages/Result.vue";

const routes = [
  { path: "/", component: Home, meta: { requiresAuth: true } },
  { path: "/tasks", component: Tasks, meta: { requiresAuth: true } },
  { path: "/clients", component: Clients, meta: { requiresAuth: true } },
  { path: "/login", component: Login },
  { path: "/result", component: Result, meta: { requiresAuth: true } },
  { path: "/signup", component: SignUp, meta: { requiresAuth: true } },
  { path: "/settings", component: Settings, meta: { requiresAuth: true } },
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
