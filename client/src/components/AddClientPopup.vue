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
          <h5 @click="closePopup">X</h5>
        </div>
        <div>
          <div class="flex flex-wrap mt-4 -mx-3">
            <div class="w-full max-w-full px-3 flex-0 sm:w-6/12">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="full name"
                >Nom</label
              >
              <input
                v-model="name"
                type="text"
                name="full name"
                placeholder="full name.."
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div class="w-full max-w-full px-3 mt-4 flex-0 sm:mt-0 sm:w-6/12">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="number"
                >Number</label
              >
              <input
                v-model="number"
                type="text"
                name="number"
                placeholder="0600000000"
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div class="flex flex-wrap mt-4 -mx-3">
            <div class="w-full max-w-full px-3 flex-0 sm:w-6/12">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="distance"
                >Distance (km)</label
              >
              <input
                v-model="distance"
                type="text"
                name="distance"
                placeholder="14.."
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div class="w-full max-w-full px-3 flex-0 sm:w-6/12">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="image"
                >Image</label
              >
              <input
                class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id="file_input"
                type="file"
              />
            </div>
          </div>
          <div class="flex mt-6">
            <button
              @click="createClient()"
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
  },
  methods: {
    closePopup() {
      this.$emit("close");
    },
    addTask() {
      this.closePopup();
    },
    createClient() {
      const response = axios.post(`/clients/`, {
        name: this.name,
        number: this.number,
        distance: JSON.parse(this.distance),
        image: "test",
      });
      console.log(response);
    },
  },
  data() {
    return {
      name: "",
      number: "",
      distance: "",
    };
  },
};
</script>
