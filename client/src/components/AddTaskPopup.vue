<template>
  <div
    v-if="showPopup"
    ref="dialog"
    role="dialog"
    aria-modal="true"
    aria-label="Add task"
    @keydown.esc.stop.prevent="closePopup"
    @keydown.tab="trapFocus"
    class="task-dialog h-full overflow-auto w-full fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
  >
    <form
      @submit.prevent="currentDivIndex = 1"
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
          <div>
            <h2 tabindex="-1" class="task-dialog-title">Timeline</h2>
            <p class="task-step">Step 1 of 3</p>
          </div>

          <button type="button" aria-label="Close dialog" @click="closePopup">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="h-6"
            >
              <path
                d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"
              />
            </svg>
          </button>
        </div>

        <div>
          <div class="flex flex-wrap mt-4 -mx-3">
            <div class="w-full max-w-full px-3 flex-0">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="add-task-date"
                >Date (optional)</label
              >

              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                >
                  <svg
                    class="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
                    />
                  </svg>
                </div>
                <input
                  id="add-task-date"
                  v-model="providedDate"
                  type="date"
                  class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 border border-gray-300 text-gray-900 text-sm leading-5.6 ease block w-full rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Select date, ex: 21-01-2023"
                />
              </div>
            </div>
          </div>
          <div class="flex flex-wrap mt-4 -mx-3">
            <div class="w-full max-w-full px-3 flex-0 sm:w-6/12">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="add-task-start"
                >Start time (optional)</label
              >
              <input
                id="add-task-start"
                v-model="providedDateStart"
                type="time"
                name="startTime"
                placeholder="eg. 11:23"
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div class="w-full max-w-full px-3 mt-4 flex-0 sm:mt-0 sm:w-6/12">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="add-task-end"
                >End time</label
              >
              <input
                id="add-task-end"
                v-model="dateEnd"
                type="time"
                name="endTime"
                placeholder="eg. 11:23"
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <p v-if="error" role="alert" class="text-red-700 mt-4">{{ error }}</p>
          <div class="flex mt-6">
            <button
              @click="currentDivIndex = (currentDivIndex + 1) % 3"
              type="button"
              next-form-btn=""
              class="inline-block px-6 py-3 mb-0 ml-auto text-xs font-bold text-right text-white uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer hover:-translate-y-px active:opacity-85 hover:shadow-xs dark:bg-gradient-to-tl dark:from-slate-750 dark:to-gray-850 bg-gradient-to-tl from-zinc-800 to-zinc-700 leading-pro tracking-tight-rem bg-150 bg-x-25"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </form>

    <form
      @submit.prevent="currentDivIndex = 2"
      v-if="currentDivIndex === 1"
      class="relative w-2/3"
      style="height: 500px"
    >
      <div
        active=""
        form="user"
        class="absolute mt-[-5rem] flex flex-col visible w-full h-auto min-w-0 p-4 break-words bg-white border-0 shadow-xl opacity-100 dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border"
      >
        <div class="flex justify-between">
          <div>
            <h2 tabindex="-1" class="task-dialog-title">Client</h2>
            <p class="task-step">Step 2 of 3</p>
          </div>
          <button type="button" aria-label="Close dialog" @click="closePopup">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="h-6"
            >
              <path
                d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"
              />
            </svg>
          </button>
        </div>
        <div>
          <!-- file upload -->
          <div
            class="flex flex-row items-center justify-center bg-grey-lighter round"
            style="flex-direction: column"
          >
            <label
              v-bind:class="addedfile ? 'p-0' : 'p-5'"
              class="mb-4 mt-8 rounded-full border cursor-pointer"
            >
              <img
                class="w-20 h-20 rounded-full"
                width="80"
                height="80"
                v-if="addedfile"
                :src="selectedFileFront"
                alt=""
              />
              <svg
                v-if="!addedfile"
                class="w-10 h-10 fill-black"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  d="M272 54.6V368c0 8.8-7.2 16-16 16s-16-7.2-16-16V54.6L139.3 155.3c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l128-128c6.2-6.2 16.4-6.2 22.6 0l128 128c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0L272 54.6zM208 352H64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H448c17.7 0 32-14.3 32-32V384c0-17.7-14.3-32-32-32H304V320H448c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V384c0-35.3 28.7-64 64-64H208v32zm176 64a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"
                />
              </svg>

              <input
                type="file"
                class="sr-only"
                aria-label="Choose client image"
                accept="image/png,image/jpeg,image/gif,image/webp"
                @change="onFileChange"
              />
            </label>
            <p
              class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
            >
              Profile
            </p>
          </div>
          <!-- file upload -->
          <div class="flex flex-wrap mt-4 -mx-3">
            <div class="w-full max-w-full px-3 flex-0">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="add-task-client-name"
                >Name</label
              >
              <input
                @focus="
                  recommandations = true;
                  filterClients();
                "
                @input="
                  recommandations = true;
                  filterClients();
                "
                id="add-task-client-name"
                v-model="name"
                type="text"
                name="clientName"
                placeholder="eg. Michael"
                class="z-99 inputName focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
              <ul
                class="max-h-[10rem] bg-white w-full overflow-scroll border rounded"
                v-if="recommandations"
              >
                <li v-for="client in filteredClients" :key="client.id">
                  <button
                    type="button"
                    @click="selectClient(client)"
                    class="flex items-center w-full px-5 py-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 gap-x-2 focus:outline-none"
                  >
                    <div class="relative">
                      <img
                        class="object-cover w-8 h-8 rounded-full"
                        :src="getimg(client.image)"
                        alt=""
                        width="32"
                        height="32"
                      />
                    </div>
                    <div class="text-left rtl:text-right">
                      <h1
                        class="text-sm font-medium text-gray-700 capitalize dark:text-white"
                      >
                        {{ client.name }}
                      </h1>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ client.number }}
                      </p>
                    </div>
                  </button>
                </li>
              </ul>
            </div>
            <div class="w-full max-w-full px-3 mt-4 flex-0">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="add-task-phone"
                >Phone</label
              >
              <input
                id="add-task-phone"
                v-model="number"
                type="tel"
                autocomplete="tel"
                name="clientField"
                placeholder="eg. 06xxxxxxxx"
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div class="w-full max-w-full px-3 mt-4 flex-0">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="add-task-distance"
                >Distance</label
              >
              <input
                id="add-task-distance"
                v-model="distance"
                type="number"
                min="0"
                step="1"
                inputmode="numeric"
                name="clientField"
                placeholder="eg. 23"
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <p v-if="error" role="alert" class="text-red-700 mt-4">{{ error }}</p>
          <div class="flex mt-6">
            <button
              @click="currentDivIndex = (currentDivIndex - 1) % 3"
              type="button"
              prev-form-btn=""
              class="inline-block px-6 py-3 mb-0 text-xs font-bold text-right uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer hover:-translate-y-px active:opacity-85 hover:shadow-xs bg-gradient-to-tl from-gray-400 to-gray-100 leading-pro tracking-tight-rem bg-150 bg-x-25 text-slate-800"
            >
              Prev
            </button>
            <button
              @click="currentDivIndex = (currentDivIndex + 1) % 3"
              type="button"
              next-form-btn=""
              class="inline-block px-6 py-3 mb-0 ml-auto text-xs font-bold text-right text-white uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer hover:-translate-y-px active:opacity-85 hover:shadow-xs dark:bg-gradient-to-tl dark:from-slate-750 dark:to-gray-850 bg-gradient-to-tl from-zinc-800 to-zinc-700 leading-pro tracking-tight-rem bg-150 bg-x-25"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </form>

    <form
      @submit.prevent="handleSubmit"
      v-if="currentDivIndex === 2"
      class="absolute w-2/3 h-[160%]"
    >
      <div
        active=""
        form="user"
        class="absolute mt-[16rem] mb-4 flex flex-col visible w-full min-w-0 p-4 break-words bg-white border-0 shadow-xl opacity-100 dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border"
      >
        <div class="flex justify-between">
          <div>
            <h2 tabindex="-1" class="task-dialog-title">Task</h2>
            <p class="task-step">Step 3 of 3</p>
          </div>
          <button type="button" aria-label="Close dialog" @click="closePopup">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="h-6"
            >
              <path
                d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"
              />
            </svg>
          </button>
        </div>
        <div>
          <div class="flex flex-wrap mt-4 -mx-3">
            <div class="w-full max-w-full px-3 flex-0">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="add-task-type"
                >Maintenance type</label
              >
              <input
                id="add-task-type"
                v-model="type"
                type="text"
                name="First Name"
                placeholder=""
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div class="flex flex-wrap mt-4 -mx-3">
            <div class="w-full max-w-full px-3 flex-0">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="add-task-supply"
                >Supplies</label
              >
              <textarea
                id="add-task-supply"
                v-model="supply"
                name="Bio"
                rows="5"
                placeholder=""
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 min-h-unset text-sm leading-5.6 ease block h-auto w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              ></textarea>

              <!-- File uplaod -->
              <div class="bg-white p7 rounded mx-auto">
                <div class="relative flex flex-col p-4 text-gray-400">
                  <div
                    x-ref="dnd"
                    class="relative flex flex-col text-gray-400 border border-gray-200 border-dashed rounded cursor-pointer"
                  >
                    <input
                      @change="onFileChangeFourniture"
                      aria-label="Choose attachments"
                      accept=".png,.jpg,.jpeg,.gif,.webp,.pdf,.txt,.md,.doc,.docx"
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
                  <div
                    v-for="num in selectedFileFournitureFront.length"
                    v-bind:key="num"
                  >
                    <a
                      v-if="addedfilefourniture"
                      :href="getFile(num)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 mt-4 sm:mt-0 inline-flex items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded"
                    >
                      <p class="text-sm font-medium leading-none text-white">
                        View File
                      </p>
                    </a>
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
                for="add-task-devis"
                >Quote request</label
              >
              <input
                id="add-task-devis"
                v-model="devis"
                type="text"
                name="First Name"
                placeholder=""
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div class="flex flex-wrap mt-4 -mx-3">
            <div class="w-full max-w-full px-3 flex-0">
              <p
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
              >
                Maintenance outcome
              </p>
              <div role="group" aria-label="Maintenance outcome">
                <div class="grid sm:grid-cols-2 gap-2">
                  <label
                    for="add-task-favourable"
                    class="flex p-3 block w-full bg-white border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  >
                    <input
                      v-model="endTask"
                      :value="true"
                      type="radio"
                      name="taskEndRadio"
                      class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                      id="add-task-favourable"
                    />
                    <span class="text-sm text-gray-500 ml-3 dark:text-gray-400"
                      >Favourable</span
                    >
                  </label>

                  <label
                    for="add-task-unfavourable"
                    class="flex p-3 block w-full bg-white border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  >
                    <input
                      v-model="endTask"
                      :value="false"
                      type="radio"
                      name="taskEndRadio"
                      class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                      id="add-task-unfavourable"
                    />
                    <span class="text-sm text-gray-500 ml-3 dark:text-gray-400"
                      >Unfavourable</span
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
                for="add-task-result"
                >Result</label
              >
              <textarea
                id="add-task-result"
                v-model="result"
                name="Bio"
                rows="5"
                placeholder=""
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 min-h-unset text-sm leading-5.6 ease block h-auto w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              ></textarea>
            </div>
          </div>

          <div class="flex flex-wrap mt-4 -mx-3">
            <div class="w-full max-w-full px-3 flex-0">
              <p
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
              >
                Follow-up
              </p>
              <div role="group" aria-label="Follow-up">
                <div class="grid sm:grid-cols-2 gap-2">
                  <label
                    for="add-task-parts"
                    class="flex p-3 block w-full bg-white border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  >
                    <input
                      v-model="followupBool"
                      :value="true"
                      name="add-task-followup"
                      type="radio"
                      class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                      id="add-task-parts"
                    />
                    <span class="text-sm text-gray-500 ml-3 dark:text-gray-400"
                      >Parts needed</span
                    >
                  </label>

                  <label
                    for="add-task-other"
                    class="flex p-3 block w-full bg-white border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  >
                    <input
                      v-model="followupBool"
                      :value="false"
                      name="add-task-followup"
                      type="radio"
                      class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                      id="add-task-other"
                    />
                    <span class="text-sm text-gray-500 ml-3 dark:text-gray-400"
                      >Other</span
                    >
                  </label>
                </div>
              </div>
            </div>
          </div>
          <!-- when autre is check, show this, need a new function -->
          <div v-if="maintenanceAutre" class="flex flex-wrap mt-4 -mx-3">
            <div class="w-full max-w-full px-3 flex-0">
              <textarea
                aria-label="Other follow-up details"
                id="add-task-followup-other"
                v-model="followupAutre"
                name="Bio"
                rows="5"
                placeholder=""
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 min-h-unset text-sm leading-5.6 ease block h-auto w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              ></textarea>
            </div>
          </div>

          <p v-if="error" role="alert" class="text-red-700 mt-4">{{ error }}</p>
          <!--  Buttons  -->
          <div class="flex mt-6">
            <button
              @click="currentDivIndex = (currentDivIndex - 1) % 3"
              type="button"
              prev-form-btn=""
              class="inline-block px-6 py-3 mb-0 text-xs font-bold text-right uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer hover:-translate-y-px active:opacity-85 hover:shadow-xs bg-gradient-to-tl from-gray-400 to-gray-100 leading-pro tracking-tight-rem bg-150 bg-x-25 text-slate-800"
            >
              Prev
            </button>
            <button
              :disabled="saving"
              type="submit"
              next-form-btn=""
              class="inline-block px-6 py-3 mb-0 ml-auto text-xs font-bold text-right text-white uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer hover:-translate-y-px active:opacity-85 hover:shadow-xs dark:bg-gradient-to-tl dark:from-slate-750 dark:to-gray-850 bg-gradient-to-tl from-zinc-800 to-zinc-700 leading-pro tracking-tight-rem bg-150 bg-x-25"
            >
              {{ saving ? "Saving…" : "Save task" }}
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
  watch: {
    showPopup: {
      immediate: true,
      handler(open) {
        if (open) {
          this.returnFocus = document.activeElement;
          this.$nextTick(this.focusHeading);
        }
      },
    },
    currentDivIndex() {
      if (this.showPopup && !this.error) this.$nextTick(this.focusHeading);
    },
    followupBool(value) {
      this.maintenanceAutre = value === false || value === "false";
    },
  },
  mounted() {
    this.fetchClients();
  },
  methods: {
    focusHeading() {
      this.$refs.dialog?.querySelector(".task-dialog-title")?.focus();
    },
    trapFocus(event) {
      const focusable = [
        ...this.$refs.dialog.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        ),
      ].filter((el) => el.getClientRects().length);
      if (!focusable.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0],
        last = focusable[focusable.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          document.activeElement ===
            this.$refs.dialog.querySelector(".task-dialog-title"))
      ) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    closePopup() {
      const target = this.returnFocus;
      this.$emit("close");
      this.$nextTick(() => {
        if (target?.isConnected) target.focus();
      });
    },
    addTask() {
      this.closePopup();
    },
    async handleSubmit() {
      if (this.saving) return;
      this.error = "";
      if (!this.name.trim()) {
        this.currentDivIndex = 1;
        this.error = "Enter a client name.";
        this.$nextTick(() =>
          this.$refs.dialog?.querySelector("#add-task-client-name")?.focus()
        );
        return;
      }
      if (
        this.providedDateStart &&
        this.dateEnd &&
        this.dateEnd < this.providedDateStart
      ) {
        this.currentDivIndex = 0;
        this.error = "End time must be after start time.";
        this.$nextTick(() =>
          this.$refs.dialog?.querySelector("#add-task-end")?.focus()
        );
        return;
      }
      this.saving = true;
      try {
        const uploadedImageName = await this.onUploadFile();

        const uploadedFileNameFourniture = await this.onUploadFileFourniture();

        const response = await axios.post("tasks/", {
          name: this.name,
          number: this.number,
          distance: this.distance,
          image: uploadedImageName,
          providedDate: this.convertDateAll(this.providedDate),
          providedDateStart: this.convertDate(this.providedDateStart),
          dateEnd: this.convertDate(this.dateEnd),
          type: this.type,
          supply: this.supply,
          supplyFile: uploadedFileNameFourniture,
          devis: this.devis,
          endTask: this.endTask,
          result: this.result,
          followupBool: this.followupBool,
          followupAutre: this.followupAutre,
          status: false,
        });
        this.$emit("task-added");
        this.closePopup();
        Object.assign(this.$data, this.$options.data.call(this));
        this.fetchClients();
      } catch (error) {
        this.error =
          error.response?.data?.error ||
          error.response?.data?.msg ||
          "Could not save the task. Please try again.";
      } finally {
        this.saving = false;
      }
    },
    convertDateAll(timeString) {
      if (!timeString) return null;
      // Split the time string into year, month, and day
      const [year, month, day] = timeString.split("-");

      // Create a new Date object with the parsed year, month (0-indexed), and day
      const currentDate = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );

      return currentDate;
    },
    convertDate(timeString) {
      if (!timeString) return null;
      const currentDate = this.providedDate
        ? this.convertDateAll(this.providedDate)
        : new Date();
      const [hours, minutes] = timeString.split(":").map(Number);
      currentDate.setHours(hours, minutes, 0, 0);
      return currentDate;
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
      if (!this.selectedFile) return "avatar.png";
      try {
        const formData = new FormData();
        formData.append("file", this.selectedFile);
        const response = await axios.post("tasks/upload", formData);
        return response.data.name; // Return the image name
      } catch (error) {
        throw error;
      }
    },
    async onFileChangeFourniture(e) {
      for (const file of e.target.files) {
        this.selectedFileFourniture.push(file);
      }

      if (this.selectedFileFourniture) {
        this.selectedFileFournitureFront = [];
        for (const file of this.selectedFileFourniture) {
          this.selectedFileFournitureFront.push(URL.createObjectURL(file));
        }

        this.addedfilefourniture = true;
      }
    },
    getFile(num) {
      num--;

      if (this.selectedFileFourniture) {
        const blob = new Blob([this.selectedFileFourniture[num]], {
          type: this.selectedFileFourniture[num].type,
        });
        return URL.createObjectURL(blob);
      }
      return "";
    },
    async onUploadFileFourniture() {
      try {
        var responseName = [];
        for (const file of this.selectedFileFourniture) {
          const formData = new FormData();
          formData.append("file", file);
          const response = await axios.post("tasks/uploadSupply", formData);
          responseName.push(response.data.name);
        }

        return responseName; // Return the image name
      } catch (error) {
        throw error;
      }
    },
    fetchClients() {
      axios
        .get(`/clients`)
        .then((response) => {
          this.clients = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    selectClient(client) {
      this.name = client.name;
      this.number = client.number || "";
      this.distance = client.distance ?? "";
      this.recommandations = false;
      this.$nextTick(() =>
        this.$refs.dialog?.querySelector("#add-task-phone")?.focus()
      );
    },
    getimg(clientImage) {
      return `${axios.defaults.baseURL.replace(
        /\/$/,
        ""
      )}/uploads/tasks/${clientImage}`;
    },
    filterClients() {
      const searchQuery = this.name.toLowerCase();
      if (searchQuery === "") {
        // If the input is empty, show all clients
        this.filteredClients = this.clients;
      } else {
        // Otherwise, filter the clients based on the input value
        this.filteredClients = this.clients.filter((client) =>
          client.name.toLowerCase().includes(searchQuery)
        );
      }
    },
  },

  data() {
    return {
      currentDivIndex: 0, // Start with the first div
      saving: false,
      error: "",
      maintenanceAutre: false,
      // post
      name: "",
      number: "",
      distance: 0,
      image: "",
      providedDate: "",
      providedDateStart: "",
      dateEnd: "",
      type: "",
      supply: "",
      supplyFile: "",
      devis: "",
      endTask: null,
      result: "",
      followupBool: null,
      status: Boolean,
      followupAutre: "",
      selectedFileFront: "",
      selectedFile: "",
      selectedFileFourniture: [],
      addedfile: "",
      addedfilefourniture: "",
      selectedFileFournitureFront: [],
      recommandations: false,
      clients: [],
      filteredClients: [],
    };
  },
};
</script>

<style scoped>
.task-dialog {
  overscroll-behavior: contain;
  padding: 24px;
  align-items: flex-start;
  background: rgba(0, 0, 0, 0.5);
}
.task-dialog form {
  position: relative;
  width: min(100%, 720px);
  height: auto !important;
  margin: auto;
}
.task-dialog form > div[form="user"] {
  position: relative;
  top: auto;
  left: auto;
  margin: 0;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: white;
  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.16);
  color: #374151;
}
.task-dialog button:focus-visible,
.task-dialog a:focus-visible,
.task-dialog label:focus-within {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
.task-dialog button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.task-dialog-title {
  margin: 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 700;
}
.task-step {
  margin-top: 3px;
  color: #9ca3af;
  font-size: 12px;
}
.task-dialog label {
  color: #475569;
}
.task-dialog
  input:not([type="radio"]):not([type="checkbox"]):not([type="file"]),
.task-dialog textarea {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  color: #374151;
  box-shadow: none;
}
.task-dialog input:focus-visible,
.task-dialog textarea:focus-visible {
  outline: 2px solid #93c5fd;
  outline-offset: 1px;
}
.task-dialog input[type="radio"],
.task-dialog input[type="checkbox"] {
  accent-color: #4f46e5;
}
.task-dialog button[class*="bg-gradient"] {
  border-radius: 8px;
  background: #27272a;
  background-image: none;
  box-shadow: none;
  transform: none;
}
.task-dialog button[class*="bg-gradient"]:hover {
  background: #3f3f46;
}
.task-dialog button[aria-label="Close dialog"] svg {
  width: 20px;
  height: 20px;
  fill: #6b7280;
}
@media (max-width: 600px) {
  .task-dialog {
    padding: 12px;
  }
  .task-dialog form > div[form="user"] {
    padding: 20px;
  }
}
</style>
