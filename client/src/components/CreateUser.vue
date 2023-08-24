<template>
  <div
    v-if="showUserPopup"
    class="h-full overflow-auto w-full fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
  >
    <form class="relative w-2/3 h-[80%]">
      <div
        active=""
        form="user"
        class="absolute top-0 left-0 flex flex-col visible w-full h-auto min-w-0 p-4 break-words bg-white border-0 shadow-xl opacity-100 dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border"
      >
        <div class="flex justify-between">
          <h5 class="mb-0 font-bold dark:text-white">Add New User</h5>

          <svg
            @click="closeUserPopup"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="h-6"
          >
            <path
              d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"
            />
          </svg>
        </div>
        <div>
          <!-- component -->

          <div
            class="flex flex-row items-center justify-center bg-grey-lighter round"
            style="flex-direction: column"
          >
            <div class="file-upload">
              <input type="file" @change="onFileChange" />
              <a
                @click="onUploadFile"
                class="upload-button"
                :disabled="!this.selectedFile"
              >
                Upload file
              </a>
            </div>
            <!-- <label
              class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
              for="First Name"
              >Profile</label> -->
          </div>
          <div class="flex flex-wrap mt-4 -mx-3">
            <div class="w-full max-w-full px-3 flex-0">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="First Name"
                >Nom</label
              >
              <input
                v-model="this.name"
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
                v-model="this.email"
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
                v-model="this.password"
                type="password"
                name="password"
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div class="flex flex-wrap mt-4 -mx-3">
            <div class="w-full max-w-full px-3 mt-4 flex-0 sm:mt-0">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="role"
                >type</label
              >
              <input
                v-model="this.role"
                type="text"
                name="role"
                placeholder="USER/ADMINr"
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div class="flex mt-6">
            <button
              @click="createUser(), closeUserPopup()"
              type="button"
              aria-controls="address"
              next-form-btn=""
              href="javascript:;"
              class="inline-block px-6 py-3 mb-0 ml-auto text-xs font-bold text-right text-white uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer hover:-translate-y-px active:opacity-85 hover:shadow-xs dark:bg-gradient-to-tl dark:from-slate-750 dark:to-gray-850 bg-gradient-to-tl from-zinc-800 to-zinc-700 leading-pro tracking-tight-rem bg-150 bg-x-25"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    showUserPopup: Boolean,
    create: Boolean,
  },
  methods: {
    async closeUserPopup() {
      this.$emit("close");
    },
    async addTask() {
      await this.closeUserPopup();
    },
    async createUser() {
      try {
        const uploadedImageName = await this.onUploadFile(); // Get the uploaded image name
        console.log("after upload : ");
        console.log(this.image);

        const response = await axios.post("users/", {
          name: this.name,
          image: uploadedImageName, // Use the uploaded image name
          email: this.email,
          password: this.password,
          role: this.role,
        });

        // Handle the response as needed
      } catch (error) {
        console.error(error);
      }
    },
    async onFileChange(e) {
      const selectedFile = e.target.files[0];
      this.selectedFile = selectedFile;
    },
    async onUploadFile() {
      try {
        const formData = new FormData();
        formData.append("file", this.selectedFile);

        const response = await axios.post("users/upload", formData);

        console.log("before affecting value to image : " + response.data.name);
        this.image = response.data.name;
        console.log("after affecting value to image : " + this.image);

        return response.data.name; // Return the image name
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },

  data() {
    return {
      name: "",
      email: "",
      password: "",
      role: "",
      image: "",
      selectedFile: "",
    };
  },
};
</script>
