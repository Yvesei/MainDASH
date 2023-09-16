import axios from "axios";
axios.defaults.withCredentials = true;

axios.defaults.baseURL = process.env.BACK_URL;
