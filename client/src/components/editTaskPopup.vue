<template>
  <div
    v-if="showPopup"
    ref="dialog"
    role="dialog"
    aria-modal="true"
    aria-label="Edit task"
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
                for="edit-task-date"
                >Date</label
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
                  :disabled="
                    this.task.deleted ||
                    (this.currentUserRole === 'USER' && this.status === true)
                  "
                  id="edit-task-date"
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
                for="edit-task-start"
                >Start time</label
              >
              <input
                :disabled="
                  this.task.deleted ||
                  (this.currentUserRole === 'USER' && this.status === true)
                "
                id="edit-task-start"
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
                for="edit-task-end"
                >End time</label
              >
              <input
                :disabled="
                  this.task.deleted ||
                  (this.currentUserRole === 'USER' && this.status === true)
                "
                id="edit-task-end"
                v-model="this.dateEnd"
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
      style="height: 406px"
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
                width="80"
                height="80"
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

              <input
                :disabled="
                  this.task.deleted ||
                  (this.currentUserRole === 'USER' && this.status === true)
                "
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
          <div class="flex flex-wrap mt-4 -mx-3">
            <div class="w-full max-w-full px-3 flex-0">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="edit-task-client-name"
                >Name</label
              >
              <input
                :disabled="
                  this.task.deleted ||
                  (this.currentUserRole === 'USER' && this.status === true)
                "
                id="edit-task-client-name"
                v-model="client.name"
                type="text"
                name="First Name"
                placeholder="eg. Michael"
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div class="w-full max-w-full px-3 mt-4 flex-0">
              <label
                class="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
                for="edit-task-phone"
                >Phone</label
              >
              <input
                :disabled="
                  this.task.deleted ||
                  (this.currentUserRole === 'USER' && this.status === true)
                "
                id="edit-task-phone"
                v-model="client.number"
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
                for="edit-task-distance"
                >Distance</label
              >
              <input
                :disabled="
                  this.task.deleted ||
                  (this.currentUserRole === 'USER' && this.status === true)
                "
                id="edit-task-distance"
                v-model="client.distance"
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
      @submit.prevent="AlterTask"
      v-if="currentDivIndex === 2"
      class="absolute w-2/3 h-[160%]"
    >
      <div
        active=""
        form="user"
        class="absolute mt-[20rem] mb-4 flex flex-col visible w-full min-w-0 p-4 break-words bg-white border-0 shadow-xl opacity-100 dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border"
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
                for="edit-task-type"
                >Maintenance type</label
              >
              <input
                :disabled="
                  this.task.deleted ||
                  (this.currentUserRole === 'USER' && this.status === true)
                "
                id="edit-task-type"
                v-model="this.type"
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
                for="edit-task-supply"
                >Supplies</label
              >

              <textarea
                :disabled="
                  this.task.deleted ||
                  (this.currentUserRole === 'USER' && this.status === true)
                "
                id="edit-task-supply"
                v-model="this.supply"
                name="Bio"
                rows="5"
                placeholder=""
                class="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 min-h-unset text-sm leading-5.6 ease block h-auto w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
              ></textarea>
              <!-- File upload -->
              <div class="bg-white p7 rounded mx-auto">
                <div class="relative flex flex-col p-4 text-gray-400">
                  <div
                    x-ref="dnd"
                    class="relative flex flex-col text-gray-400 border border-gray-200 border-dashed rounded cursor-pointer"
                  >
                    <input
                      :disabled="
                        this.task.deleted ||
                        (this.currentUserRole === 'USER' &&
                          this.status === true)
                      "
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
                  <div class="flex mt-6 margin-auto">
                    <div
                      v-for="num in this.supplyFile.length"
                      v-bind:key="num"
                      class="p-2 flex items-center"
                    >
                      <a
                        v-if="task.supplyFile != ''"
                        :href="getFile(num)"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="p-2 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 mt-4 sm:mt-0 inline-flex items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded"
                      >
                        <p
                          class="text-sm font-medium leading-none text-white text-center"
                        >
                          View Old File
                        </p>
                      </a>

                      <button
                        type="button"
                        :aria-label="`Remove attachment ${num}`"
                        v-if="
                          !this.task.deleted &&
                          (this.currentUserRole === 'ADMIN' ||
                            this.status === false)
                        "
                        @click="deleteFile(num)"
                      >
                        <svg
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          class="h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                    <div
                      v-for="num in selectedFileFournitureFront.length"
                      v-bind:key="num"
                    >
                      <a
                        v-if="addedfilefourniture"
                        :href="getFileFront(num)"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="ml-5 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 mt-4 sm:mt-0 inline-flex items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded"
                      >
                        <p class="text-sm font-medium leading-none text-white">
                          View New File
                        </p>
                      </a>
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
                for="edit-task-devis"
                >Quote request</label
              >
              <input
                :disabled="
                  this.task.deleted ||
                  (this.currentUserRole === 'USER' && this.status === true)
                "
                id="edit-task-devis"
                v-model="this.devis"
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
                    :class="endTask === true ? 'border-blue-500' : ''"
                    for="edit-task-favourable"
                    class="flex p-3 block w-full bg-white border rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  >
                    <input
                      :disabled="
                        this.task.deleted ||
                        (this.currentUserRole === 'USER' &&
                          this.status === true)
                      "
                      v-model="endTask"
                      name="edit-task-outcome"
                      :value="true"
                      type="radio"
                      class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                      id="edit-task-favourable"
                    />
                    <span class="text-sm text-gray-500 ml-3 dark:text-gray-400"
                      >Favourable</span
                    >
                  </label>

                  <label
                    :class="endTask === false ? 'border-blue-500' : ''"
                    for="edit-task-unfavourable"
                    class="flex p-3 block w-full bg-white border rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  >
                    <input
                      :disabled="
                        this.task.deleted ||
                        (this.currentUserRole === 'USER' &&
                          this.status === true)
                      "
                      v-model="endTask"
                      name="edit-task-outcome"
                      :value="false"
                      type="radio"
                      class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                      id="edit-task-unfavourable"
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
                for="edit-task-result"
                >Result</label
              >
              <textarea
                :disabled="
                  this.task.deleted ||
                  (this.currentUserRole === 'USER' && this.status === true)
                "
                id="edit-task-result"
                v-model="this.result"
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
                    :class="followupBool === true ? 'border-blue-500' : ''"
                    for="edit-task-parts"
                    class="flex p-3 block w-full bg-white border rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  >
                    <input
                      :disabled="
                        this.task.deleted ||
                        (this.currentUserRole === 'USER' &&
                          this.status === true)
                      "
                      v-model="followupBool"
                      :value="true"
                      name="edit-task-followup"
                      type="radio"
                      class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                      id="edit-task-parts"
                    />
                    <span class="text-sm text-gray-500 ml-3 dark:text-gray-400"
                      >Parts needed</span
                    >
                  </label>

                  <label
                    :class="followupBool === false ? 'border-blue-500' : ''"
                    for="edit-task-other"
                    class="flex p-3 block w-full bg-white border rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                  >
                    <input
                      :disabled="
                        this.task.deleted ||
                        (this.currentUserRole === 'USER' &&
                          this.status === true)
                      "
                      v-model="followupBool"
                      :value="false"
                      name="edit-task-followup"
                      type="radio"
                      class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                      id="edit-task-other"
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
          <div class="flex flex-wrap mt-4 -mx-3">
            <div class="w-full max-w-full px-3 flex-0">
              <textarea
                :disabled="
                  task.deleted ||
                  (currentUserRole === 'USER' && status === true)
                "
                aria-label="Other follow-up details"
                id="edit-task-followup-other"
                v-model="this.followupAutre"
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
              :disabled="
                saving ||
                task.deleted ||
                (currentUserRole === 'USER' && status === true)
              "
              type="submit"
              next-form-btn=""
              class="inline-block px-6 py-3 mb-0 ml-auto text-xs font-bold text-right text-white uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer hover:-translate-y-px active:opacity-85 hover:shadow-xs dark:bg-gradient-to-tl dark:from-slate-750 dark:to-gray-850 bg-gradient-to-tl from-zinc-800 to-zinc-700 leading-pro tracking-tight-rem bg-150 bg-x-25"
            >
              {{ saving ? "Saving…" : "Save changes" }}
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
    task: {
      type: Object, // Specify the type of the prop
      required: true, // Set to true if the prop is required
    },
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
  },
  mounted() {
    if (this.task.supplyFile) {
      this.supplyFile = this.task.supplyFile.split(",");
    }
    this.fetchClient(this.task.clientId);
    this.taskId = this.task.id;
    this.providedDate = this.task.Date;
    this.providedDateStart = this.task.dateStart;
    this.dateEnd = this.task.dateEnd;
    this.type = this.task.type;
    this.supply = this.task.supply;
    this.devis = this.task.devis;
    this.endTask = this.task.endTask;
    this.result = this.task.result;
    this.followupBool = this.task.followupBool;
    this.followupAutre = this.task.followupAutre;
    this.status = this.task.status;
    this.id = this.client.id;
    this.fetchUser();
  },
  methods: {
    convertDate(timeString) {
      if (!timeString) return null;
      const currentDate = this.providedDate
        ? new Date(`${this.providedDate}T00:00:00`)
        : new Date();
      const [hours, minutes] = timeString.split(":").map(Number);
      currentDate.setHours(hours, minutes, 0, 0);
      return currentDate;
    },
    convertDateAll(timeString) {
      return timeString ? new Date(`${timeString}T00:00:00`) : null;
    },
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
    fetchClient(id) {
      axios
        .get(`clients/${id}`)
        .then((response) => {
          this.client = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    async AlterTask() {
      if (
        this.saving ||
        this.task.deleted ||
        (this.currentUserRole === "USER" && this.status === true)
      )
        return;
      this.error = "";
      if (!this.client.name?.trim()) {
        this.currentDivIndex = 1;
        this.error = "Enter a client name.";
        this.$nextTick(() =>
          this.$refs.dialog?.querySelector("#edit-task-client-name")?.focus()
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
          this.$refs.dialog?.querySelector("#edit-task-end")?.focus()
        );
        return;
      }
      this.saving = true;
      try {
        const uploadedImageName = await this.onUploadFile();
        const uploadedFileNameFourniture = await this.onUploadFileFourniture();
        const providedDate = await this.convertDateAll(this.providedDate);
        const response = await axios.patch("tasks/", {
          taskId: this.taskId,
          id: this.client.id,
          name: this.client.name,
          number: this.client.number,
          distance: this.client.distance,
          image: uploadedImageName,
          providedDate: providedDate,
          providedDateStart: this.convertDate(this.providedDateStart),
          dateEnd: this.convertDate(this.dateEnd),
          type: this.type,
          supply: this.supply,
          supplyFile: uploadedFileNameFourniture,
          devis: this.devis,
          endTask:
            this.endTask == null
              ? null
              : this.endTask === true || this.endTask === "true",
          result: this.result,
          followupBool:
            this.followupBool == null
              ? null
              : this.followupBool === true || this.followupBool === "true",
          followupAutre: this.followupAutre,
        });
        this.$emit("task-updated");
        this.closePopup();
      } catch (error) {
        this.error =
          error.response?.data?.error ||
          error.response?.data?.msg ||
          "Could not save changes. Please try again.";
      } finally {
        this.saving = false;
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
      if (!this.selectedFile) return this.client.image;
      try {
        const formData = new FormData();
        formData.append("file", this.selectedFile);
        const response = await axios.post("tasks/uploadEdit", formData);
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

    async onUploadFileFourniture() {
      try {
        var responseName = [];
        for (const file of this.selectedFileFourniture) {
          const formData = new FormData();
          formData.append("file", file);
          const response = await axios.post("tasks/uploadFileEdit", formData);
          responseName.push(response.data.name);
        }
        for (const file of this.supplyFile) responseName.push(file);

        return responseName; // Return the image name
      } catch (error) {
        throw error;
      }
    },
    getimg() {
      return `${axios.defaults.baseURL.replace(/\/$/, "")}/uploads/tasks/${
        this.client.image
      }`;
    },
    getFile(num) {
      num--;
      return `${axios.defaults.baseURL.replace(/\/$/, "")}/uploads/tasks/${
        this.supplyFile[num]
      }`;
    },
    deleteFile(num) {
      num--;
      this.supplyFile.splice(num, 1);
    },
    getFileFront(num) {
      num--;

      if (this.selectedFileFourniture) {
        const blob = new Blob([this.selectedFileFourniture[num]], {
          type: this.selectedFileFourniture[num].type,
        });
        return URL.createObjectURL(blob);
      }
      return "";
    },
    fetchUser() {
      axios
        .get(`/users/current-user-get`)
        .then((response) => {
          this.currentUserRole = response.data.role;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  data() {
    return {
      currentUserRole: "",
      saving: false,
      error: "",
      currentDivIndex: 0,
      maintenanceAutre: false,
      client: {
        type: Object,
      },
      id: "",
      taskId: "",
      name: "",
      number: "",
      distance: 0,
      image: "",
      Date: "",
      dateStart: "",
      dateEnd: "",
      type: "",
      supply: "",
      supplyFile: [],
      devis: "",
      endTask: Boolean,
      result: "",
      followupBool: Boolean,
      followupAutre: "",
      clientId: "",
      selectedFileFront: "",
      selectedFile: "",
      addedfile: "",
      addedfilefourniture: "",
      selectedFileFourniture: [],
      selectedFileFournitureFront: [],
      providedDate: "",
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
