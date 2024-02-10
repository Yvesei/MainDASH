<template>
  <div class="result-layout">
    <Navbar />
    <main id="main-content" tabindex="-1" class="results">
      <header class="results-header">
        <div>
          <h1>Client results</h1>
          <p>Review work, track time and export a record of visits.</p>
        </div>
        <router-link to="/clients" class="secondary-link"
          >← All clients</router-link
        >
      </header>

      <div v-if="!clientId" class="state-card">
        <h2>Choose a client</h2>
        <p>Open a client from the client list to see its tasks and results.</p>
        <router-link to="/clients" class="primary-link"
          >Go to clients</router-link
        >
      </div>
      <template v-else>
        <div v-if="loading" class="state-card" role="status">
          Loading results…
        </div>
        <div v-else-if="error" class="state-card" role="alert">
          <p>{{ error }}</p>
          <button class="secondary-link" @click="load">Try again</button>
        </div>
        <template v-else>
          <section class="client-banner" aria-label="Client details">
            <img :src="clientImage" alt="" width="48" height="48" />
            <div>
              <p class="eyebrow">CLIENT</p>
              <h2>{{ client.name }}</h2>
              <p>
                {{ client.number || "No phone number"
                }}<span v-if="client.distance != null">
                  · {{ client.distance }} km per visit</span
                >
              </p>
            </div>
          </section>
          <p class="print-context">
            {{
              status === "all"
                ? "All statuses"
                : status === "done"
                ? "Done"
                : "Pending"
            }}<span v-if="dateRange">
              · {{ dateRange[0] || "Any date" }} to
              {{ dateRange[1] || "Any date" }}</span
            ><span v-if="search"> · Search: {{ search }}</span>
          </p>
          <section class="report-summary" aria-label="Report summary">
            <div>
              <span>VISIBLE TASKS</span
              ><strong>{{ visibleTasks.length }}</strong>
            </div>
            <div>
              <span>PENDING</span><strong>{{ pendingCount }}</strong>
            </div>
            <div>
              <span>RECORDED TIME</span><strong>{{ visibleHours }}</strong>
            </div>
            <p>Totals reflect the current filters.</p>
          </section>
          <section class="results-card">
            <div class="toolbar">
              <div class="status-tabs" aria-label="Task status">
                <button
                  v-for="tab in tabs"
                  :key="tab.value"
                  :class="{ active: status === tab.value }"
                  :aria-pressed="status === tab.value"
                  @click="status = tab.value"
                >
                  {{ tab.label }}
                </button>
              </div>
              <div class="toolbar-actions">
                <button class="secondary-link" @click="showFilter = true">
                  {{ dateRange ? "Edit dates" : "Filter dates" }}
                </button>
                <button
                  v-if="dateRange"
                  class="text-button"
                  @click="dateRange = null"
                >
                  Clear dates
                </button>
                <label v-if="isAdmin" class="hidden-toggle"
                  ><input v-model="showHidden" type="checkbox" /> Show
                  hidden</label
                >
              </div>
            </div>
            <div class="search-line">
              <label for="results-search">Search results</label
              ><input
                id="results-search"
                v-model.trim="search"
                name="search"
                type="search"
                autocomplete="off"
                placeholder="Search task details"
              /><span v-if="dateRange"
                >{{ dateRange[0] || "Any date" }} –
                {{ dateRange[1] || "Any date" }}</span
              >
            </div>
            <p v-if="actionMessage" class="notice" role="status">
              {{ actionMessage }}
            </p>
            <p v-if="actionError" class="notice error" role="alert">
              {{ actionError }}
            </p>
            <div class="selection-bar">
              <span role="status"
                ><strong>{{ selectedIds.length }}</strong> selected<span
                  v-if="selectedIds.length"
                >
                  · {{ selectedHours }} total hours<span
                    v-if="client.distance != null"
                  >
                    · {{ selectedDistance }} km</span
                  ></span
                ></span
              >
              <div>
                <button
                  class="secondary-link"
                  :disabled="!visibleTasks.length"
                  @click="printReport"
                >
                  Print</button
                ><button
                  class="secondary-link"
                  :disabled="!visibleTasks.length"
                  @click="exportCsv"
                >
                  Export CSV</button
                ><button
                  class="primary-link"
                  :disabled="!selectedPending.length || saving"
                  @click="markDone"
                >
                  {{ saving ? "Updating…" : "Mark selected done" }}
                </button>
              </div>
            </div>
            <p v-if="!visibleTasks.length" class="empty" role="status">
              No results match these filters.
            </p>
            <div
              v-else
              class="table-scroll"
              role="region"
              aria-label="Results table, scroll horizontally for more columns"
              tabindex="0"
            >
              <table>
                <thead>
                  <tr>
                    <th scope="col">
                      <input
                        type="checkbox"
                        :checked="allSelected"
                        :aria-label="
                          allSelected
                            ? 'Deselect all visible tasks'
                            : 'Select all visible tasks'
                        "
                        @change="toggleAll"
                      />
                    </th>
                    <th scope="col">Date</th>
                    <th v-if="isAdmin" scope="col">Team member</th>
                    <th scope="col">Maintenance</th>
                    <th scope="col">Hours</th>
                    <th scope="col">Status</th>
                    <th scope="col"><span class="sr-only">Details</span></th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="task in visibleTasks" :key="task.id"
                    ><tr :class="{ hiddenRow: task.deleted }">
                      <td>
                        <input
                          type="checkbox"
                          :checked="selectedIds.includes(task.id)"
                          :aria-label="`Select task ${task.id}`"
                          @change="toggle(task.id)"
                        />
                      </td>
                      <td>{{ formatDate(task.Date) }}</td>
                      <td v-if="isAdmin">
                        {{ userNames[task.createdBy] || "—" }}
                      </td>
                      <td>
                        {{ task.type || "—"
                        }}<small v-if="task.deleted" class="hidden-label"
                          >Hidden</small
                        >
                      </td>
                      <td>{{ duration(task) }}</td>
                      <td>
                        <span
                          class="status-pill"
                          :class="{ done: task.status }"
                          >{{ task.status ? "Done" : "Pending" }}</span
                        >
                      </td>
                      <td>
                        <button
                          class="text-button"
                          :aria-expanded="expanded === task.id"
                          :aria-controls="
                            expanded === task.id
                              ? `task-details-${task.id}`
                              : undefined
                          "
                          :aria-label="`${
                            expanded === task.id
                              ? 'Close details for'
                              : 'Show details for'
                          } ${task.type || 'task'}, ${task.id}`"
                          @click="
                            expanded = expanded === task.id ? null : task.id
                          "
                        >
                          {{ expanded === task.id ? "Close" : "Details" }}
                        </button>
                      </td>
                    </tr>
                    <tr
                      v-if="expanded === task.id"
                      :id="`task-details-${task.id}`"
                      class="detail-row"
                    >
                      <td :colspan="isAdmin ? 7 : 6">
                        <dl>
                          <div>
                            <dt>Supplies</dt>
                            <dd>{{ task.supply || "—" }}</dd>
                          </div>
                          <div>
                            <dt>Quote request</dt>
                            <dd>{{ task.devis || "—" }}</dd>
                          </div>
                          <div>
                            <dt>Result</dt>
                            <dd>{{ task.result || "—" }}</dd>
                          </div>
                          <div>
                            <dt>Maintenance outcome</dt>
                            <dd>
                              {{
                                task.endTask == null
                                  ? "—"
                                  : task.endTask
                                  ? "Favourable"
                                  : "Unfavourable"
                              }}
                            </dd>
                          </div>
                          <div>
                            <dt>Follow-up</dt>
                            <dd>
                              {{
                                task.followupBool == null
                                  ? "—"
                                  : task.followupBool
                                  ? "Parts needed"
                                  : task.followupAutre || "Other"
                              }}
                            </dd>
                          </div>
                          <div v-if="files(task).length">
                            <dt>Attachments</dt>
                            <dd>
                              <a
                                v-for="(file, index) in files(task)"
                                :key="file"
                                :href="fileUrl(file)"
                                target="_blank"
                                rel="noopener noreferrer"
                                >Attachment {{ index + 1 }}
                                <span aria-hidden="true">↗</span
                                ><span class="sr-only">
                                  (opens in a new tab)</span
                                ></a
                              >
                            </dd>
                          </div>
                        </dl>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            <p v-if="visibleTasks.length" class="table-hint">
              Scroll to see more columns →
            </p>
          </section>
        </template>
      </template>
      <Filter
        :show-popup="showFilter"
        :dates="dateRange"
        @close="showFilter = false"
        @task-filter="dateRange = $event"
      />
    </main>
  </div>
</template>
<script>
import axios from "axios";
import Navbar from "./Navbar.vue";
import Filter from "./Filter.vue";
export default {
  name: "Result",
  components: { Navbar, Filter },
  data() {
    return {
      clientId:
        Number(
          this.$route.query.client || localStorage.getItem("clientResult")
        ) || null,
      client: {},
      tasks: [],
      userNames: {},
      isAdmin: false,
      requestId: 0,
      loading: false,
      saving: false,
      error: "",
      actionError: "",
      actionMessage: "",
      status: "all",
      showHidden: false,
      showFilter: false,
      dateRange: null,
      search: "",
      selectedIds: [],
      expanded: null,
      tabs: [
        { value: "all", label: "All" },
        { value: "done", label: "Done" },
        { value: "pending", label: "Pending" },
      ],
    };
  },
  computed: {
    clientImage() {
      return `${axios.defaults.baseURL.replace(
        /\/$/,
        ""
      )}/uploads/tasks/${encodeURIComponent(
        this.client.image || "avatar.png"
      )}`;
    },
    visibleTasks() {
      const query = this.search.toLocaleLowerCase();
      return this.tasks.filter((task) => {
        if (!this.showHidden && task.deleted) return false;
        if (
          (this.status === "done" && !task.status) ||
          (this.status === "pending" && task.status)
        )
          return false;
        const day = this.dateValue(task.Date);
        if (
          this.dateRange &&
          (!day ||
            (this.dateRange[0] && day < this.dateRange[0]) ||
            (this.dateRange[1] && day > this.dateRange[1]))
        )
          return false;
        return (
          !query ||
          [
            task.type,
            task.supply,
            task.devis,
            task.result,
            task.followupAutre,
          ].some((value) =>
            String(value || "")
              .toLocaleLowerCase()
              .includes(query)
          )
        );
      });
    },
    allSelected() {
      return (
        this.visibleTasks.length > 0 &&
        this.visibleTasks.every((task) => this.selectedIds.includes(task.id))
      );
    },
    selectedTasks() {
      return this.visibleTasks.filter((task) =>
        this.selectedIds.includes(task.id)
      );
    },
    selectedPending() {
      return this.selectedTasks.filter((task) => !task.status && !task.deleted);
    },
    pendingCount() {
      return this.visibleTasks.filter((task) => !task.status).length;
    },
    visibleHours() {
      return this.formatMinutes(
        this.visibleTasks.reduce(
          (sum, task) => sum + this.durationMinutes(task),
          0
        )
      );
    },
    selectedHours() {
      const minutes = this.selectedTasks.reduce(
        (sum, task) => sum + this.durationMinutes(task),
        0
      );
      return this.formatMinutes(minutes);
    },
    selectedDistance() {
      return this.selectedTasks.length * Number(this.client.distance || 0);
    },
  },
  watch: {
    visibleTasks(tasks) {
      const ids = new Set(tasks.map((task) => task.id));
      this.selectedIds = this.selectedIds.filter((id) => ids.has(id));
      if (this.expanded && !ids.has(this.expanded)) this.expanded = null;
    },
    "$route.query.client"(value) {
      const id = Number(value);
      if (!Number.isInteger(id) || id <= 0 || id === this.clientId) return;
      this.clientId = id;
      localStorage.setItem("clientResult", String(id));
      this.selectedIds = [];
      this.expanded = null;
      this.actionMessage = "";
      this.actionError = "";
      this.load();
    },
  },
  mounted() {
    if (this.clientId) {
      localStorage.setItem("clientResult", String(this.clientId));
      this.load();
    }
  },
  methods: {
    async load() {
      const requestId = ++this.requestId;
      const clientId = this.clientId;
      this.loading = true;
      this.error = "";
      try {
        const [client, tasks, user] = await Promise.all([
          axios.get(`/clients/${clientId}`),
          axios.get("/tasks", { params: { clientId, includeHidden: true } }),
          axios.get("/users/current-user-get"),
        ]);
        if (!client.data || !client.data.id)
          throw new Error("Client not found");
        const userNames = { [user.data.id]: user.data.name };
        if (user.data.role === "ADMIN") {
          const users = await axios.get("/users");
          users.data.forEach((item) => {
            userNames[item.id] = item.name;
          });
        }
        if (requestId !== this.requestId) return false;
        this.client = client.data;
        this.tasks = tasks.data;
        this.isAdmin = user.data.role === "ADMIN";
        this.userNames = userNames;
        return true;
      } catch (error) {
        if (requestId === this.requestId)
          this.error =
            "Could not load this client's results. The client may no longer be available.";
        return false;
      } finally {
        if (requestId === this.requestId) this.loading = false;
      }
    },
    dateValue(value) {
      if (!value) return "";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "";
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;
    },
    formatDate(value) {
      if (!value) return "—";
      const date = new Date(value);
      return Number.isNaN(date.getTime())
        ? "—"
        : new Intl.DateTimeFormat(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          }).format(date);
    },
    durationMinutes(task) {
      if (!task.dateStart || !task.dateEnd) return 0;
      const minutes =
        (new Date(task.dateEnd) - new Date(task.dateStart)) / 60000;
      return Number.isFinite(minutes) ? Math.max(0, Math.floor(minutes)) : 0;
    },
    formatMinutes(minutes) {
      return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
        minutes % 60
      ).padStart(2, "0")}`;
    },
    duration(task) {
      return task.dateStart && task.dateEnd
        ? this.formatMinutes(this.durationMinutes(task))
        : "—";
    },
    files(task) {
      return String(task.supplyFile || "")
        .split(",")
        .filter(Boolean);
    },
    fileUrl(file) {
      return `${axios.defaults.baseURL.replace(
        /\/$/,
        ""
      )}/uploads/tasks/${encodeURIComponent(file)}`;
    },
    toggle(id) {
      this.selectedIds = this.selectedIds.includes(id)
        ? this.selectedIds.filter((item) => item !== id)
        : [...this.selectedIds, id];
    },
    toggleAll() {
      this.selectedIds = this.allSelected
        ? []
        : this.visibleTasks.map((task) => task.id);
    },
    async markDone() {
      if (!this.selectedPending.length || this.saving) return;
      this.saving = true;
      this.actionError = "";
      this.actionMessage = "";
      try {
        const count = this.selectedPending.length;
        await axios.patch("/tasks/markDone", {
          idArray: this.selectedPending.map((task) => task.id),
        });
        this.selectedIds = [];
        if (!(await this.load())) {
          if (this.error)
            this.error =
              "Tasks were marked done, but the results could not be refreshed. Please try again.";
          return;
        }
        this.actionMessage = `${count} ${
          count === 1 ? "task" : "tasks"
        } marked done.`;
      } catch (error) {
        this.actionError =
          "Could not update the selected tasks. Please try again.";
      } finally {
        this.saving = false;
      }
    },
    printReport() {
      window.print();
    },
    exportCsv() {
      const safe = (value) => {
        const text = String(value ?? "");
        return `"${
          (/^[\s]*[=+\-@\t\r]/.test(text) ? "'" : "") + text.replace(/"/g, '""')
        }"`;
      };
      const rows = [
        [
          "Date",
          "Client",
          "Team member",
          "Maintenance",
          "Hours",
          "Status",
          "Hidden",
          "Supplies",
          "Quote request",
          "Result",
        ],
        ...this.visibleTasks.map((task) => [
          this.dateValue(task.Date),
          this.client.name,
          this.userNames[task.createdBy] || "",
          task.type,
          this.duration(task),
          task.status ? "Done" : "Pending",
          task.deleted ? "Yes" : "No",
          task.supply,
          task.devis,
          task.result,
        ]),
      ];
      const blob = new Blob(
        ["\ufeff" + rows.map((row) => row.map(safe).join(",")).join("\r\n")],
        { type: "text/csv;charset=utf-8" }
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `client-${this.clientId}-results.csv`;
      link.click();
      URL.revokeObjectURL(url);
    },
  },
};
</script>
<style scoped>
.print-context {
  display: none;
}
.result-layout {
  display: flex;
  min-height: 100vh;
}
.results {
  flex: 1;
  min-width: 0;
  padding: 46px clamp(24px, 4vw, 64px);
  color: #1f2937;
}
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 34px;
}
.eyebrow {
  color: #77847b;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
}
.results h1 {
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
  margin: 12px 0 10px;
}
.results-header p:last-child,
.client-banner p:last-child {
  color: #6b7280;
  font-size: 14px;
}
.secondary-link,
.primary-link {
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d1d5db;
  padding: 10px 14px;
  background: #ffffff;
  color: #4338ca;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}
.primary-link {
  border-color: #4338ca;
  background: #4338ca;
  color: #fff;
}
.primary-link:disabled,
.secondary-link:disabled {
  opacity: 0.45;
}
.state-card,
.client-banner,
.results-card {
  border: 1px solid #e5e7eb;
  background: #ffffff;
}
.state-card {
  padding: 35px;
  text-align: center;
  color: #6b7280;
}
.state-card h2 {
  color: #1f2937;
  font-size: 24px;
}
.state-card p {
  margin: 10px 0 20px;
}
.client-banner {
  border-radius: 12px 12px 0 0;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 22px;
  border-bottom: 0;
}
.client-banner img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  background: #f3f4f6;
}
.client-banner h2 {
  margin: 5px 0;
  font-size: 18px;
  font-weight: 700;
}
.report-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
  align-items: stretch;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
}
.report-summary > div {
  min-width: 0;
  padding: 16px 22px;
  border-right: 1px solid #e5e7eb;
}
.report-summary span {
  display: block;
  color: #6b7280;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
}
.report-summary strong {
  display: block;
  margin-top: 7px;
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.report-summary p {
  align-self: center;
  padding: 12px 20px;
  color: #9ca3af;
  font-size: 11px;
}
.results-card {
  border-radius: 0 0 12px 12px;
  padding: 24px;
  border-top: 0;
}
.toolbar,
.selection-bar,
.search-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.status-tabs,
.toolbar-actions,
.selection-bar > div {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.status-tabs button {
  border-radius: 999px;
  padding: 9px 12px;
  border-bottom: 2px solid transparent;
  color: #6b7280;
  font-size: 13px;
  font-weight: 650;
}
.status-tabs button.active {
  border-color: transparent;
  background: #e0e7ff;
  color: #4338ca;
}
.hidden-toggle {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #6b7280;
  font-size: 13px;
}
.hidden-toggle input,
input[type="checkbox"] {
  accent-color: #4338ca;
}
.text-button {
  color: #4f46e5;
  font-size: 13px;
  font-weight: 650;
}
.search-line {
  justify-content: flex-start;
  margin-top: 22px;
  color: #6b7280;
  font-size: 13px;
}
.search-line label {
  font-weight: 650;
}
.search-line input {
  width: min(100%, 280px);
  padding: 9px 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
}
.selection-bar {
  padding: 16px 0;
  margin-top: 16px;
  border-top: 1px solid #e5e7eb;
  color: #6b7280;
  font-size: 13px;
}
.selection-bar strong {
  color: #1f2937;
}
.notice {
  margin-top: 16px;
  color: #4f46e5;
  font-size: 13px;
}
.notice.error {
  color: #b91c1c;
}
.empty {
  padding: 48px 12px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
}
.table-scroll {
  overflow-x: auto;
  border-top: 1px solid #e5e7eb;
}
table {
  width: 100%;
  min-width: 650px;
  border-collapse: collapse;
  text-align: left;
}
th,
td {
  padding: 14px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 13px;
}
th {
  color: #6b7280;
  font-size: 10px;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}
td {
  color: #374151;
}
.hiddenRow {
  background: #fef2f2;
}
.hidden-label {
  display: block;
  color: #b91c1c;
}
.status-pill {
  display: inline-block;
  padding: 4px 8px;
  background: #ede9fe;
  color: #7c3aed;
  font-size: 11px;
  font-weight: 700;
}
.status-pill.done {
  background: #dbeafe;
  color: #2563eb;
}
.detail-row td {
  background: #f9fafb;
}
.detail-row dl {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 20px;
  padding: 10px;
}
.detail-row dt {
  color: #6b7280;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.detail-row dd {
  margin-top: 6px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.detail-row a {
  display: block;
  color: #4f46e5;
  text-decoration: underline;
}
@media (max-width: 700px) {
  .results {
    padding: 28px 18px;
  }
  .results-header {
    align-items: flex-start;
    flex-direction: column;
  }
  .results-card {
    padding: 16px;
  }
  .selection-bar {
    align-items: flex-start;
    flex-direction: column;
  }
  .report-summary {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .report-summary > div {
    padding: 14px 10px;
  }
  .report-summary p {
    grid-column: 1 / -1;
    border-top: 1px solid #e5e7eb;
    padding: 10px;
  }
}
.client-banner > div {
  min-width: 0;
  overflow-wrap: anywhere;
}
.table-hint {
  display: none;
  margin-top: 8px;
  color: #6b7280;
  font-size: 11px;
}
.report-summary p,
.empty {
  color: #6b7280;
}
.detail-row a {
  position: relative;
}
.secondary-link:hover:not(:disabled) {
  background: #f3f4f6;
}
.primary-link:hover:not(:disabled) {
  background: #4f46e5;
}
.text-button:hover {
  text-decoration: underline;
}
td {
  font-variant-numeric: tabular-nums;
}
@media (max-width: 800px) {
  .table-hint {
    display: block;
  }
}
@media print {
  .print-context {
    display: block;
    margin: 10px 0;
    color: #555;
    font-size: 12px;
  }
  .results {
    padding: 0;
  }
  .results-header {
    margin-bottom: 20px;
  }
  .results-header .secondary-link,
  .toolbar,
  .search-line,
  .selection-bar,
  .notice,
  .table-scroll input,
  .table-hint,
  .text-button {
    display: none !important;
  }
  .results-card,
  .client-banner,
  .report-summary {
    border-color: #ccc;
  }
  .table-scroll {
    overflow: visible;
  }
  table {
    min-width: 0;
  }
}
</style>
