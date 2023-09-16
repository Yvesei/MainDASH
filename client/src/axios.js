import axios from "axios";
axios.defaults.withCredentials = true;

axios.defaults.baseURL = env("BACK_URL");
