<template>
  <div
    v-if="showPopup"
    class="h-full overflow-auto w-full fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
  >
    <form class="relative w-2/3" style="height: 406px">
      <div
        active=""
        form="user"
        class="absolute top-0 left-0 flex flex-col visible w-full h-auto min-w-0 p-4 break-words bg-white border-0 shadow-xl opacity-100 dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border"
      >
        <div class="flex justify-between">
          <h5 class="mb-0 font-bold dark:text-white">Client</h5>
          <svg
            @click="closePopup"
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
          <div
            class="flex flex-row items-center justify-center bg-grey-lighter round"
            style="flex-direction: column"
          >
            <label
              v-bind:class="client.image ? 'p-0' : 'p-5'"
              class="mb-4 mt-8 rounded-full border cursor-pointer"
            >
              <img
                v-if="client.image"
                class="w-20 h-20 rounded-full"
                :src="selectedFileFront ? selectedFileFront : getimg()"
                alt=""
              />
              <svg
                v-if="!client.image"
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
                for="full name"
                >Nom</label
              >
              <input
                v-model="client.name"
                type="text"
                name="full name"
                placeholder="full name.."
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div class="w-full max-w-full px-3 mt-4 flex-0">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="number"
                >Number</label
              >
              <input
                v-model="client.number"
                type="text"
                name="number"
                placeholder="0600000000"
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div class="flex flex-wrap mt-4 -mx-3">
            <div class="w-full max-w-full px-3 flex-0">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="distance"
                >Distance (km)</label
              >
              <input
                v-model="client.distance"
                type="text"
                name="distance"
                placeholder="14.."
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div class="flex mt-6">
            <button
              @click="editClient()"
              type="button"
              aria-controls="address"
              next-form-btn=""
              href="javascript:;"
              class="inline-block px-6 py-3 mb-0 ml-auto text-xs font-bold text-right text-white uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer hover:-translate-y-px active:opacity-85 hover:shadow-xs dark:bg-gradient-to-tl dark:from-slate-750 dark:to-gray-850 bg-gradient-to-tl from-zinc-800 to-zinc-700 leading-pro tracking-tight-rem bg-150 bg-x-25"
            >
              Next
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
    showPopup: Boolean,
    client: {
      type: Object,
      required: true,
    },
  },
  methods: {
    closePopup() {
      this.$emit("close");
    },
    addTask() {
      this.closePopup();
    },
    async editClient() {
      try {
        const uploadedImageName = await this.onUploadFile();
        const response = axios.patch("/clients/", {
          id: this.client.id,
          name: this.client.name,
          number: this.client.number,
          distance: this.client.distance,
          image: uploadedImageName,
        });

        this.closePopup();
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
        const response = await axios.post("tasks/uploadEdit", formData);
        return response.data.name; // Return the image name
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    getimg() {
      return `http://192.168.1.146:3000/uploads/uploads/tasks/${this.client.image}`;
    },
  },
  data() {
    return {
      selectedFileFront: "",
      selectedFile: "",
      addedfile: "",
    };
  },
};
</script>
