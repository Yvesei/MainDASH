import { createRouter, createWebHistory } from "vue-router";

import axios from "axios";

const Home = () => import("./pages/Home.vue");
const Login = () => import("./pages/Login.vue");
const Tasks = () => import("./pages/Tasks.vue");
const Settings = () => import("./pages/Settings.vue");
const Clients = () => import("./pages/Clients.vue");
const Result = () => import("./pages/Result.vue");

const NotFound = () => import("./pages/NotFound.vue");

const routes = [
  {
    path: "/",
    component: Home,
    meta: {
      requiresAuth: true,
      adminOnly: true,
      title: "MainDash - Dashboard",
    },
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
  { path: "/login", component: Login, meta: { title: "MainDash - Login" } },
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
  {
    path: "/:pathMatch(.*)*",
    component: NotFound,
    meta: { title: "MainDash - Page not found" },
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
      if (!response.data.success) {
        next({ path: "/login", query: { redirect: to.fullPath } });
      } else if (to.meta.adminOnly && response.data.role !== "ADMIN") {
        next("/tasks");
      } else {
        next();
      }
    } catch (error) {
      next({ path: "/login", query: { redirect: to.fullPath } });
    }
  } else {
    next();
  }
});

export default router;
