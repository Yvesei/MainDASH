import axios from "axios";
import router from "./router";

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  process.env.VUE_APP_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:3000/`;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      router.currentRoute.value.path !== "/login" &&
      !String(error.config?.url || "").includes("verify-user")
    ) {
      router.replace({
        path: "/login",
        query: { redirect: router.currentRoute.value.fullPath },
      });
    }
    return Promise.reject(error);
  }
);
