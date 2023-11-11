<template>
  <form class="relative w-2/3 flex mt-6">
    <div
      class="flex flex-row items-center justify-center bg-grey-lighter round"
      style="flex-direction: column"
    >
      <label
        class="flex flex-col items-center px-6 py-6 mb-4 mt-8 bg-white text-blue rounded-full shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-white"
      >
        <svg
          class="w-8 h-8"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z"
          />
        </svg>

        <input type="file" class="hidden" />
      </label>
      <label
        class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
        for="First Name"
        >Profile</label
      >
    </div>
    <div
      active=""
      form="user"
      class="absolute top-0 left-0 flex flex-col visible w-full h-auto min-w-0 p-4 break-words bg-white opacity-100 dark:bg-slate-850 rounded-2xl bg-clip-border"
    >
      <div class="flex justify-between">
        <h5
          class="flex items-center text-2xl mb-0 font-bold dark:text-white flex"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-8 h-8 mr-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Settings
        </h5>
      </div>
      <div>
        <!-- file upload -->
        <div
          class="flex flex-row items-center justify-center bg-grey-lighter round"
          style="flex-direction: column"
        >
          <label
            v-bind:class="selectedFileFront ? 'p-0' : 'p-5'"
            class="mb-4 mt-8 rounded-full border cursor-pointer"
          >
            <img
              v-if="selectedFileFront"
              class="w-20 h-20 rounded-full"
              :src="selectedFileFront ? selectedFileFront : getimg()"
              alt=""
            />
            <svg
              v-if="!selectedFileFront"
              class="w-10 h-10 fill-black"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                d="M272 54.6V368c0 8.8-7.2 16-16 16s-16-7.2-16-16V54.6L139.3 155.3c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l128-128c6.2-6.2 16.4-6.2 22.6 0l128 128c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0L272 54.6zM208 352H64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H448c17.7 0 32-14.3 32-32V384c0-17.7-14.3-32-32-32H304V320H448c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V384c0-35.3 28.7-64 64-64H208v32zm176 64a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"
              />
            </svg>

            <input type="file" class="hidden" @change="onFileChange" />
          </label>
          <label
            class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
            for="First Name"
            >Profile</label
          >
        </div>

        <div class="flex flex-wrap mt-4 -mx-3">
          <div class="w-full max-w-full px-3 flex-0">
            <label
              class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
              for="First Name"
              >Nom</label
            >
            <input
              v-model="name"
              type="text"
              name="First Name"
              placeholder="eg. Michael"
              class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div class="flex flex-wrap mt-4 -mx-3">
          <div class="w-full max-w-full px-3 mt-4 flex-0 sm:mt-0">
            <label
              class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
              for="email"
              >Email</label
            >
            <input
              v-model="email"
              type="text"
              name="email"
              placeholder="ex: user@tridentsystems.com"
              class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div class="flex flex-wrap mt-4 -mx-3">
          <div class="w-full max-w-full px-3 flex-0">
            <label
              class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
              for="password"
              >Password</label
            >
            <input
              v-model="password"
              type="password"
              name="password"
              class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div class="flex mt-6 justify-between">
          <button
            @click="editUser()"
            type="button"
            aria-controls="address"
            next-form-btn=""
            href="javascript:;"
            class="inline-block px-6 py-3 mb-0 ml-auto text-xs font-bold text-right text-white uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer hover:-translate-y-px active:opacity-85 hover:shadow-xs dark:bg-gradient-to-tl dark:from-slate-750 dark:to-gray-850 bg-gradient-to-tl from-zinc-800 to-zinc-700 leading-pro tracking-tight-rem bg-150 bg-x-25"
          >
            Modify
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import axios from "axios";

export default {
  methods: {
    // async editUser() {

    // },
    async editUser() {
      try {
        const uploadedImageName = await this.onUploadFile(); // uploaded
        const response = axios.patch("users/current-user", {
          name: this.name,
          image: uploadedImageName,
          email: this.email,
          password: this.password,
        });
      } catch (error) {
        console.error(error);
      }
    },
    async onFileChange(e) {
      const selectedFile = e.target.files[0];
      this.selectedFile = selectedFile;
      if (selectedFile) {
        this.selectedFileFront = URL.createObjectURL(selectedFile);
        this.addedfile = true;
      }
    },
    async onUploadFile() {
      try {
        const formData = new FormData();
        formData.append("file", this.selectedFile);
        const response = await axios.post("users/uploadEdit", formData);
        return response.data.name; // Return the image name
      } catch (error) {
        throw error;
      }
    },
    getimg() {
      return `http://192.168.1.146:3000/uploads/users/${this.user.image}`;
    },
  },
  data() {
    return {
      user: {
        type: Object,
      },
      name: "",
      image: "",
      email: "",
      password: "",
      selectedFileFront: "",
      selectedFile: "",
      addedfile: "",
    };
  },
};
</script>
