<template>
  <div
    v-if="showPopup"
    class="h-full overflow-auto w-full fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
  >
    <form
      v-if="currentDivIndex === 0"
      class="relative w-2/3"
      style="height: 406px"
    >
      <div
        active=""
        form="user"
        class="absolute top-0 left-0 flex flex-col visible w-full h-auto min-w-0 p-4 break-words bg-white border-0 shadow-xl opacity-100 dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border"
      >
        <div class="flex justify-between">
          <h5 class="mb-0 font-bold dark:text-white">Timeline</h5>
          <h5 @click="closePopup">X</h5>
        </div>

        <div>
          <div class="flex flex-wrap mt-4 -mx-3">
            <div class="w-full max-w-full px-3 flex-0 sm:w-6/12">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="First Name"
                >Date</label
              >
              <input
                type="text"
                name="First Name"
                placeholder="eg. Michael"
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div class="w-full max-w-full px-3 mt-4 flex-0 sm:mt-0 sm:w-6/12">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="Last Name"
                >Distance</label
              >
              <input
                type="text"
                name="Last Name"
                placeholder="eg. Prior"
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div class="flex flex-wrap mt-4 -mx-3">
            <div class="w-full max-w-full px-3 flex-0 sm:w-6/12">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="Company"
                >Heure debut</label
              >
              <input
                type="text"
                name="Company"
                placeholder="eg. Creative Tim"
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div class="w-full max-w-full px-3 mt-4 flex-0 sm:mt-0 sm:w-6/12">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="Email Address"
                >Heure fin</label
              >
              <input
                type="email"
                name="Email Address"
                placeholder="eg. soft@dashboard.com"
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div class="flex mt-6">
            <button
              @click="currentDivIndex = (currentDivIndex + 1) % 3"
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

    <form
      v-if="currentDivIndex === 1"
      class="relative w-2/3"
      style="height: 406px"
    >
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
                for="First Name"
                >Nom</label
              >
              <input
                type="text"
                name="First Name"
                placeholder="eg. Michael"
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div class="w-full max-w-full px-3 mt-4 flex-0 sm:mt-0 sm:w-6/12">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="Last Name"
                >Num Tel</label
              >
              <input
                type="text"
                name="Last Name"
                placeholder="eg. Prior"
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div class="flex mt-6">
            <button
              @click="currentDivIndex = (currentDivIndex - 1) % 3"
              type="button"
              aria-controls="user"
              prev-form-btn=""
              href="javascript:;"
              class="inline-block px-6 py-3 mb-0 text-xs font-bold text-right uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer hover:-translate-y-px active:opacity-85 hover:shadow-xs bg-gradient-to-tl from-gray-400 to-gray-100 leading-pro tracking-tight-rem bg-150 bg-x-25 text-slate-800"
            >
              Prev
            </button>
            <button
              @click="currentDivIndex = (currentDivIndex + 1) % 3"
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

    <form v-if="currentDivIndex === 2" class="absolute w-2/3 h-[160%]">
      <div
        active=""
        form="user"
        class="absolute mt-[20rem] mb-4 flex flex-col visible w-full min-w-0 p-4 break-words bg-white border-0 shadow-xl opacity-100 dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border"
      >
        <div class="flex justify-between">
          <h5 class="mb-0 font-bold dark:text-white">Task</h5>
          <h5 @click="closePopup">X</h5>
        </div>
        <div>
          <div class="flex flex-wrap mt-4 -mx-3">
            <div class="w-full max-w-full px-3 flex-0">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="First Name"
                >Type de maintenance</label
              >
              <input
                type="text"
                name="First Name"
                placeholder="eg. Michael"
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div class="flex flex-wrap mt-4 -mx-3">
            <div class="w-full max-w-full px-3 flex-0">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="First Name"
                >Fourniture</label
              >
              <input
                type="text"
                name="First Name"
                placeholder="eg. Michael"
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
              <!-- File uplaod -->
              <div class="bg-white p7 rounded mx-auto">
                <div
                  x-data="dataFileDnD()"
                  class="relative flex flex-col p-4 text-gray-400"
                >
                  <div
                    x-ref="dnd"
                    class="relative flex flex-col text-gray-400 border border-gray-200 border-dashed rounded cursor-pointer"
                  >
                    <input
                      accept="*"
                      type="file"
                      multiple
                      class="absolute inset-0 z-50 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"
                    />

                    <div
                      class="flex flex-col items-center justify-center py-10 text-center"
                    >
                      <svg
                        class="w-6 h-6 mr-1 text-current-50"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p class="m-0">
                        Drag your files here or click in this area.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <!-- end file opload -->
            </div>
          </div>
          <div class="flex flex-wrap mt-4 -mx-3">
            <div class="w-full max-w-full px-3 flex-0">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="First Name"
                >Demande de devis</label
              >
              <input
                type="text"
                name="First Name"
                placeholder="eg. Michael"
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div class="flex flex-wrap mt-4 -mx-3">
            <div class="w-full max-w-full px-3 flex-0">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="First Name"
                >Fin de maintenance</label
              >
              <div class="flex justify-around">
                <div
                  class="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700"
                >
                  <input
                    id="bordered-checkbox-1"
                    type="checkbox"
                    value=""
                    name="bordered-checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="bordered-checkbox-1"
                    class="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Favourable</label
                  >
                </div>
                <div
                  class="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700"
                >
                  <input
                    checked
                    id="bordered-checkbox-2"
                    type="checkbox"
                    value=""
                    name="bordered-checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="bordered-checkbox-2"
                    class="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Defavourable</label
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap mt-4 -mx-3">
            <div class="w-full max-w-full px-3 flex-0">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="First Name"
                >Resultat</label
              >
              <textarea
                name="Bio"
                rows="5"
                placeholder="Say a few words about who you are or what you're working on."
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 min-h-unset text-sm leading-5.6 ease block h-auto w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              ></textarea>
            </div>
          </div>
          <div class="flex mt-6">
            <button
              @click="currentDivIndex = (currentDivIndex - 1) % 3"
              type="button"
              aria-controls="user"
              prev-form-btn=""
              href="javascript:;"
              class="inline-block px-6 py-3 mb-0 text-xs font-bold text-right uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer hover:-translate-y-px active:opacity-85 hover:shadow-xs bg-gradient-to-tl from-gray-400 to-gray-100 leading-pro tracking-tight-rem bg-150 bg-x-25 text-slate-800"
            >
              Prev
            </button>
            <button
              v-if="create"
              @click="SubmitTask()"
              type="button"
              aria-controls="address"
              next-form-btn=""
              href="javascript:;"
              class="inline-block px-6 py-3 mb-0 ml-auto text-xs font-bold text-right text-white uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer hover:-translate-y-px active:opacity-85 hover:shadow-xs dark:bg-gradient-to-tl dark:from-slate-750 dark:to-gray-850 bg-gradient-to-tl from-zinc-800 to-zinc-700 leading-pro tracking-tight-rem bg-150 bg-x-25"
            >
              Save
            </button>
            <button
              v-if="!create"
              @click="SubmitTask()"
              type="button"
              aria-controls="address"
              next-form-btn=""
              href="javascript:;"
              class="inline-block px-6 py-3 mb-0 ml-auto text-xs font-bold text-right text-white uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer hover:-translate-y-px active:opacity-85 hover:shadow-xs dark:bg-gradient-to-tl dark:from-slate-750 dark:to-gray-850 bg-gradient-to-tl from-zinc-800 to-zinc-700 leading-pro tracking-tight-rem bg-150 bg-x-25"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    showPopup: Boolean,
    create: Boolean,
  },
  methods: {
    closePopup() {
      this.$emit("close");
    },
    addTask() {
      this.closePopup();
    },
  },
  data() {
    return {
      currentDivIndex: 0, // Start with the first div
    };
  },
};
</script>
