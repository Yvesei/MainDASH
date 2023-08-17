<template>
  <tr class="border-b border-gray-200 hover:bg-gray-100">
    <td>
      <div @click="addidtoarray()" class="ml-5">
        <div
          class="bg-gray-200 rounded-sm w-5 h-5 flex flex-shrink-0 justify-center items-center relative"
        >
          <input
            placeholder="checkbox"
            type="checkbox"
            class="focus:opacity-100 checkbox opacity-0 absolute cursor-pointer w-full h-full"
          />
          <div class="check-icon hidden bg-indigo-700 text-white rounded-sm">
            <svg
              class="icon icon-tabler icon-tabler-check"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z"></path>
              <path d="M5 12l5 5l10 -10"></path>
            </svg>
          </div>
        </div>
      </div>
    </td>
    <td class="py-3 px-6 text-center whitespace-nowrap">
      <div class="">
        <span class="font-medium">22-07-2022</span>
      </div>
    </td>
    <td class="py-3 px-6 text-center whitespace-nowrap">
      <div class="">
        <span class="font-medium">Carte graphique</span>
      </div>
    </td>
    <td class="py-3 px-6 text-center">
      <div>
        <span>1:30</span>
      </div>
    </td>

    <td class="py-3 px-6 text-center">
      <span class="bg-purple-200 text-purple-600 py-1 px-3 rounded-full text-xs"
        >Active</span
      >
    </td>
    <td class="py-3 px-6 text-center">
      <div class="flex item-center justify-center">
        <div
          @click="isOpen = !isOpen"
          class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </div>
      </div>
    </td>
  </tr>
  <tr>
    <td :colspan="6">
      <!-- Dropdown menu -->
      <div
        v-if="isOpen"
        x-transition:enter="transition ease-out duration-100"
        x-transition:enter-start="opacity-0 scale-90"
        x-transition:enter-end="opacity-100 scale-100"
        x-transition:leave="transition ease-in duration-100"
        x-transition:leave-start="opacity-100 scale-100"
        x-transition:leave-end="opacity-0 scale-90"
      >
        <div
          active=""
          form="user"
          class="mb-4 flex flex-col visible w-full min-w-0 p-4 break-words bg-white opacity-100 dark:bg-slate-850 rounded-2xl bg-clip-border"
        >
          <div>
            <div class="flex flex-wrap mt-4 -mx-3">
              <div class="w-full max-w-full px-3 flex-0">
                <label
                  class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                  for="First Name"
                  >Type de maintenance</label
                >
                <p
                  class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
                  quidem quam facilis dignissimos modi reprehenderit vel alias,
                  commodi magni perferendis?
                </p>
              </div>
            </div>
            <div class="flex flex-wrap mt-4 -mx-3">
              <div class="w-full max-w-full px-3 flex-0">
                <label
                  class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                  for="First Name"
                  >Fourniture</label
                >
                <p
                  class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
                  quidem quam facilis dignissimos modi reprehenderit vel alias,
                  commodi magni perferendis?
                </p>
                <!-- File uplaod -->
                <p>File ????</p>
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
                <p
                  class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                >
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Porro repellat voluptas autem aspernatur doloribus maiores ad
                  voluptatum veritatis eum sequi et odio enim libero laudantium
                  eius repudiandae praesentium, quisquam perspiciatis!
                </p>
              </div>
            </div>
            <div class="flex flex-wrap mt-4 -mx-3">
              <div class="w-full max-w-full px-3 flex-0">
                <label
                  class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                  for="First Name"
                  >Fin de maintenance</label
                >
                <div>
                  <div class="grid sm:grid-cols-2 gap-2">
                    <label
                      for="fav"
                      class="flex p-3 block w-full bg-white border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                    >
                      <input
                        checked
                        type="checkbox"
                        class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                        id="fav"
                      />
                      <span
                        class="text-sm text-gray-500 ml-3 dark:text-gray-400"
                        >Favourable</span
                      >
                    </label>
                    <!--    I'm gonna create a variable fav? and then display one based on it's value     -->
                    <label
                      for="defa"
                      class="hidden flex p-3 block w-full bg-white border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                    >
                      <input
                        type="checkbox"
                        class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                        id="defa"
                      />
                      <span
                        class="text-sm text-gray-500 ml-3 dark:text-gray-400"
                        >Defavourable</span
                      >
                    </label>
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
                <p
                  class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
                  quidem quam facilis dignissimos modi reprehenderit vel alias,
                  commodi magni perferendis?
                </p>
              </div>
            </div>

            <div class="flex flex-wrap mt-4 -mx-3">
              <div class="w-full max-w-full px-3 flex-0">
                <label
                  class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                  for="First Name"
                  >Maintenance a suivre</label
                >
                <div>
                  <div class="grid sm:grid-cols-2 gap-2">
                    <label
                      @click="maintenanceAutre = false"
                      for="a-suivre"
                      class="flex p-3 block w-full bg-white border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                    >
                      <input
                        type="checkbox"
                        class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                        id="a-suivre"
                      />
                      <span
                        class="text-sm text-gray-500 ml-3 dark:text-gray-400"
                        >Manque des pièces</span
                      >
                    </label>

                    <label
                      @click="maintenanceAutre = true"
                      for="Autre"
                      class="flex p-3 block w-full bg-white border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                    >
                      <input
                        type="checkbox"
                        class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                        id="Autre"
                      />
                      <span
                        class="text-sm text-gray-500 ml-3 dark:text-gray-400"
                        >Autre</span
                      >
                    </label>
                  </div>
                  <p
                    class="mt-2 focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                  >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Fugit quidem quam facilis dignissimos modi reprehenderit vel
                    alias, commodi magni perferendis?
                  </p>
                </div>
              </div>
            </div>
            <!-- when autre is check, show this, need a new function -->
            <div v-if="maintenanceAutre" class="flex flex-wrap mt-4 -mx-3">
              <div class="w-full max-w-full px-3 flex-0">
                <textarea
                  name="Bio"
                  rows="5"
                  placeholder="Say a few words about who you are or what you're working on."
                  class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 min-h-unset text-sm leading-5.6 ease block h-auto w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                ></textarea>
              </div>
            </div>

            <!--  Buttons  -->
          </div>
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
import AddTaskPopup from "./AddTaskPopup.vue";

export default {
  setup() {
    name: "TableTr";
  },
  components: {
    AddTaskPopup,
  },
  data() {
    return {
      popup: false,
      create: false,
      isOpen: false,
    };
  },
};
</script>
