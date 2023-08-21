import { createRouter, createWebHistory } from "vue-router";

import Login from "./pages/Login.vue";
import Home from "./pages/Home.vue";
import SignUp from "./pages/SignUp.vue";
import Settings from "./pages/Settings.vue";
import Clients from "./pages/Clients.vue";
import Result from "./pages/Result.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/clients", component: Clients },
  { path: "/login", component: Login },
  { path: "/result", component: Result },
  { path: "/signup", component: SignUp },
  { path: "/settings", component: Settings, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("token") !== null;

  if (to.matched.some((route) => route.meta.requiresAuth)) {
    if (isAuthenticated) {
      next();
    } else {
      next("/login");
    }
  } else if (to.matched.some((route) => route.meta.requiresGuest)) {
    if (isAuthenticated) {
      next("/");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
