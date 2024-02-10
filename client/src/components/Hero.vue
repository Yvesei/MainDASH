<template>
  <div class="task-layout">
    <Navbar />
    <main id="main-content" tabindex="-1" class="task-page">
      <header class="page-head">
        <h1>Tasks</h1>
        <label class="visibility-control"
          >Show:
          <select v-model="selected" @change="fetchTasks">
            <option value="1">Active tasks</option>
            <option value="2">Archived tasks</option>
            <option value="3">All tasks</option>
          </select>
        </label>
      </header>

      <section class="task-section" aria-label="Task list">
        <div class="task-toolbar">
          <div class="task-tabs" aria-label="Task status">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              :class="{ active: selectedButton === tab.value }"
              :aria-pressed="selectedButton === tab.value"
              @click="selectStatus(tab.value)"
            >
              {{ tab.label }}
            </button>
            <button class="filter-button" @click="popupFilter = true">
              {{ filterDatesBool ? "Edit filter" : "Filter" }}
            </button>
            <button
              v-if="filterDatesBool"
              class="filter-button"
              @click="UndoFilter"
            >
              Clear filter
            </button>
          </div>
          <button class="primary-action" @click="popup = true">Add Task</button>
        </div>
        <div class="task-search-row">
          <label class="search-box"
            ><span class="sr-only">Search tasks</span
            ><input
              v-model.trim="search"
              type="search"
              placeholder="Search client, work or notes"
          /></label>
          <label class="sort-label"
            >Sort by
            <select v-model="sortBy">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="client">Client A–Z</option>
              <option value="pending">Pending first</option>
            </select></label
          >
        </div>
        <div v-if="selectedIds.length" class="selection-bar">
          <span
            ><strong>{{ selectedIds.length }}</strong>
            {{ selectedIds.length === 1 ? "task" : "tasks" }} selected</span
          >
          <div>
            <button class="text-control" @click="selectedIds = []">Clear</button
            ><button
              class="complete-selected"
              :disabled="bulkSaving"
              @click="completeSelected"
            >
              {{ bulkSaving ? "Updating…" : "Complete selected" }}
            </button>
          </div>
        </div>
        <p v-if="actionMessage" class="task-notice" role="status">
          {{ actionMessage }}
          <button
            v-if="undoTaskId"
            type="button"
            class="text-control"
            :disabled="undoBusy"
            @click="undoArchive"
          >
            {{ undoBusy ? "Restoring…" : "Undo" }}
          </button>
        </p>
        <p v-if="actionError" class="task-notice task-error" role="alert">
          {{ actionError }}
        </p>
        <p v-if="error" role="alert" class="task-feedback">
          {{ error }} <button @click="initialize">Try again</button>
        </p>
        <p v-else-if="loading" role="status" class="task-feedback">
          Loading tasks…
        </p>
        <div v-else-if="!visibleTasks.length" class="task-feedback">
          <strong>No tasks found.</strong>
          <p>Try another search or change the filters.</p>
          <button
            v-if="
              search ||
              filterDatesBool ||
              selectedButton !== 'all' ||
              selected !== '1'
            "
            @click="clearFilters"
          >
            Clear filters
          </button>
        </div>
        <div
          v-else
          class="table-wrap"
          role="region"
          aria-label="Task table, scroll horizontally for more columns"
          tabindex="0"
        >
          <table>
            <thead>
              <tr>
                <th class="select-column">
                  <input
                    type="checkbox"
                    :checked="allEligibleSelected"
                    :disabled="!eligibleTasks.length"
                    aria-label="Select all visible pending tasks"
                    @change="toggleAll"
                  />
                </th>
                <th>Client</th>
                <th v-if="currentUserRole === 'ADMIN'">User</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <TableTr
                v-for="task in visibleTasks"
                :key="task.id"
                :task="task"
                :current-user-role="currentUserRole"
                :current-user-id="currentUserId"
                :clients="clients"
                :users="users"
                :selected="selectedIds.includes(task.id)"
                :open-request="openTaskId === task.id"
                @select="toggleTask"
                @task-deleted="handleTaskChanged"
                @task-closed="closeRequestedTask"
              />
            </tbody>
          </table>
        </div>
        <p v-if="!loading && !error && visibleTasks.length" class="scroll-hint">
          Scroll to see more columns →
        </p>
        <footer
          v-if="!loading && !error && visibleTasks.length"
          class="table-footer"
        >
          <span
            >{{ visibleTasks.length }}
            {{ visibleTasks.length === 1 ? "task" : "tasks" }}</span
          ><span>{{ activeFilterLabel }}</span>
        </footer>
      </section>
    </main>
    <AddTaskPopup
      :show-popup="popup"
      @close="popup = false"
      @task-added="fetchTasks"
    />
    <Filter
      :show-popup="popupFilter"
      :dates="filterDatesBool ? filterDates : null"
      @close="popupFilter = false"
      @task-filter="applyDateFilter"
    />
  </div>
</template>
<script>
import axios from "axios";
import AddTaskPopup from "./AddTaskPopup.vue";
import Navbar from "./Navbar.vue";
import TableTr from "./TableTr.vue";
import Filter from "./Filter.vue";

export default {
  name: "TasksView",
  components: { TableTr, AddTaskPopup, Filter, Navbar },
  data() {
    return {
      currentUserRole: "",
      currentUserId: null,
      clients: [],
      users: [],
      search: "",
      sortBy: "newest",
      loading: true,
      error: "",
      requestId: 0,
      routeRequestId: 0,
      filterDates: ["2012-12-12", "2999-12-12"],
      popup: false,
      popupFilter: false,
      tasks: [],
      selectedButton: "all",
      selected: "1",
      filterDatesBool: false,
      selectedIds: [],
      bulkSaving: false,
      actionError: "",
      actionMessage: "",
      undoTaskId: null,
      undoBusy: false,
      openTaskId: null,
      initialized: false,
      tabs: [
        { value: "all", label: "All" },
        { value: "done", label: "Done" },
        { value: "pending", label: "Pending" },
      ],
    };
  },
  computed: {
    visibleTasks() {
      const query = this.search.toLocaleLowerCase();
      const clients = new Map(
        this.clients.map((client) => [client.id, client.name || ""])
      );
      const users = new Map(
        this.users.map((user) => [user.id, user.name || ""])
      );
      const filtered = this.tasks.filter((task) => {
        if (
          this.currentUserRole !== "ADMIN" &&
          task.createdBy !== this.currentUserId
        )
          return false;
        return (
          !query ||
          [
            clients.get(task.clientId),
            users.get(task.createdBy),
            task.type,
            task.result,
            task.supply,
            task.devis,
            task.followupAutre,
          ].some((value) =>
            String(value || "")
              .toLocaleLowerCase()
              .includes(query)
          )
        );
      });
      return filtered.sort((a, b) => {
        if (this.sortBy === "client")
          return (
            (clients.get(a.clientId) || "").localeCompare(
              clients.get(b.clientId) || ""
            ) || b.id - a.id
          );
        if (this.sortBy === "pending" && !!a.status !== !!b.status)
          return a.status ? 1 : -1;
        if (!a.Date && b.Date) return 1;
        if (a.Date && !b.Date) return -1;
        const comparison = (a.Date || "").localeCompare(b.Date || "");
        return (
          (this.sortBy === "oldest" ? comparison : -comparison) || b.id - a.id
        );
      });
    },
    eligibleTasks() {
      return this.visibleTasks.filter((task) => !task.status && !task.deleted);
    },
    allEligibleSelected() {
      return (
        this.eligibleTasks.length > 0 &&
        this.eligibleTasks.every((task) => this.selectedIds.includes(task.id))
      );
    },
    activeFilterLabel() {
      const status = { all: "All statuses", done: "Done", pending: "Pending" }[
        this.selectedButton
      ];
      const visibility = { 1: "active", 2: "archived", 3: "all" }[
        this.selected
      ];
      const range = this.filterDatesBool
        ? ` · ${
            this.filterDates[0] === "2012-12-12"
              ? "any start"
              : this.filterDates[0]
          } – ${
            this.filterDates[1] === "2999-12-12"
              ? "any end"
              : this.filterDates[1]
          }`
        : "";
      return `${status} · ${visibility}${range}`;
    },
  },
  watch: {
    visibleTasks(tasks) {
      const ids = new Set(
        tasks
          .filter((task) => !task.status && !task.deleted)
          .map((task) => task.id)
      );
      this.selectedIds = this.selectedIds.filter((id) => ids.has(id));
    },
    "$route.query": {
      async handler() {
        if (this.initialized) await this.applyRoute();
      },
      deep: true,
    },
  },
  mounted() {
    this.initialize();
  },
  methods: {
    async initialize() {
      this.loading = true;
      this.error = "";
      try {
        const [user, clients] = await Promise.all([
          axios.get("/users/current-user-get"),
          axios.get("/clients", { params: { includeHidden: true } }),
        ]);
        this.currentUserRole = user.data.role;
        this.currentUserId = user.data.id;
        this.clients = clients.data;
        if (this.currentUserRole === "ADMIN") {
          try {
            this.users = (await axios.get("/users")).data;
          } catch (error) {
            this.users = [];
          }
        }
        this.initialized = true;
        await this.applyRoute();
      } catch (error) {
        this.loading = false;
        this.error = "Could not load your tasks.";
      }
    },
    async applyRoute() {
      const routeRequestId = ++this.routeRequestId;
      const status = this.$route.query.status;
      this.selectedButton =
        status === "pending" || status === "done" ? status : "all";
      const requested = Number(this.$route.query.task);
      this.openTaskId = null;
      if (Number.isInteger(requested) && requested > 0) {
        try {
          const { data: task } = await axios.get(`/tasks/${requested}`);
          if (routeRequestId !== this.routeRequestId) return;
          this.selected = task.deleted ? "2" : "1";
          this.selectedButton = "all";
          this.filterDatesBool = false;
          this.search = "";
          await this.fetchTasks();
          if (routeRequestId !== this.routeRequestId) return;
          if (this.tasks.some((item) => item.id === requested))
            this.openTaskId = requested;
          else this.actionError = "This task could not be opened.";
        } catch (error) {
          if (routeRequestId !== this.routeRequestId) return;
          this.actionError =
            "This task is unavailable or you do not have access to it.";
          await this.fetchTasks();
        }
      } else await this.fetchTasks();
    },
    closeRequestedTask() {
      if (!this.openTaskId) return;
      this.openTaskId = null;
      const query = { ...this.$route.query };
      delete query.task;
      this.$router.replace({ query });
    },
    selectStatus(value) {
      this.selectedButton = value;
      this.actionMessage = "";
      this.actionError = "";
      const query = { ...this.$route.query };
      delete query.task;
      if (value === "all") delete query.status;
      else query.status = value;
      if (
        (this.$route.query.status || "all") === value &&
        !this.$route.query.task
      )
        this.fetchTasks();
      else this.$router.replace({ query });
    },
    applyDateFilter(value) {
      this.filterDates = [value[0] || "2012-12-12", value[1] || "2999-12-12"];
      this.filterDatesBool = true;
      this.fetchTasks();
    },
    UndoFilter() {
      this.filterDatesBool = false;
      this.filterDates = ["2012-12-12", "2999-12-12"];
      this.fetchTasks();
    },
    clearFilters() {
      this.search = "";
      this.selectedButton = "all";
      this.selected = "1";
      this.filterDatesBool = false;
      this.actionError = "";
      if (this.$route.query.status || this.$route.query.task) {
        const query = { ...this.$route.query };
        delete query.status;
        delete query.task;
        this.$router.replace({ query });
      } else this.fetchTasks();
    },
    toggleTask(id) {
      this.selectedIds = this.selectedIds.includes(id)
        ? this.selectedIds.filter((item) => item !== id)
        : [...this.selectedIds, id];
    },
    toggleAll() {
      this.selectedIds = this.allEligibleSelected
        ? []
        : this.eligibleTasks.map((task) => task.id);
    },
    async completeSelected() {
      if (!this.selectedIds.length || this.bulkSaving) return;
      this.bulkSaving = true;
      this.actionError = "";
      this.actionMessage = "";
      const count = this.selectedIds.length;
      try {
        await axios.patch("/tasks/markDone", { idArray: this.selectedIds });
        this.selectedIds = [];
        if (await this.fetchTasks())
          this.actionMessage = `${count} ${
            count === 1 ? "task" : "tasks"
          } marked complete.`;
        else
          this.actionError =
            "Tasks were completed, but the list could not be refreshed.";
      } catch (error) {
        this.actionError =
          error.response?.data?.error ||
          "Could not complete the selected tasks.";
      } finally {
        this.bulkSaving = false;
      }
    },
    async handleTaskChanged(change) {
      const refreshed = await this.fetchTasks();
      if (!refreshed) return;
      this.actionError = "";
      if (change?.archived) {
        this.undoTaskId = change.id;
        this.actionMessage = "Task archived.";
      } else if (change) {
        this.undoTaskId = null;
        this.actionMessage = "Task restored.";
      }
    },
    async undoArchive() {
      if (!this.undoTaskId || this.undoBusy) return;
      this.undoBusy = true;
      this.actionError = "";
      try {
        const { data: task } = await axios.get(`/tasks/${this.undoTaskId}`);
        if (task.deleted) await axios.delete(`/tasks/${this.undoTaskId}`);
        this.undoTaskId = null;
        if (await this.fetchTasks()) this.actionMessage = "Task restored.";
        else
          this.actionError =
            "Task restored, but the list could not be refreshed.";
      } catch (error) {
        this.actionError = "Could not restore the task. Please try again.";
      } finally {
        this.undoBusy = false;
      }
    },
    async fetchTasks() {
      const requestId = ++this.requestId;
      this.loading = true;
      this.error = "";
      this.selectedIds = [];
      const deleted = { 1: "undeleted", 2: "deleted", 3: "none" }[
        this.selected
      ];
      const params = { deleted };
      if (this.selectedButton !== "all")
        params.type = this.selectedButton === "done" ? "Done" : "Pending";
      if (this.filterDatesBool) {
        if (this.filterDates[0] !== "2012-12-12")
          params.filterStart = new Date(
            `${this.filterDates[0]}T00:00:00`
          ).toISOString();
        if (this.filterDates[1] !== "2999-12-12") {
          const end = new Date(`${this.filterDates[1]}T00:00:00`);
          end.setDate(end.getDate() + 1);
          params.filterEndExclusive = end.toISOString();
        }
      }
      try {
        const [response, clients] = await Promise.all([
          axios.get("/tasks/latest", { params }),
          axios.get("/clients", { params: { includeHidden: true } }),
        ]);
        if (requestId !== this.requestId) return;
        this.clients = clients.data;
        this.tasks = response.data.map((task) => ({
          ...task,
          Date: this.extractDate(task.Date),
          dateStart: this.extractHours(task.dateStart),
          dateEnd: this.extractHours(task.dateEnd),
        }));
        return true;
      } catch (error) {
        if (requestId === this.requestId)
          this.error = "Could not load your tasks.";
      } finally {
        if (requestId === this.requestId) this.loading = false;
      }
    },
    extractDate(value) {
      if (!value) return "";
      const date = new Date(value);
      return Number.isNaN(date.getTime())
        ? ""
        : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(date.getDate()).padStart(2, "0")}`;
    },
    extractHours(value) {
      if (!value) return "";
      const date = new Date(value);
      return Number.isNaN(date.getTime())
        ? ""
        : `${String(date.getHours()).padStart(2, "0")}:${String(
            date.getMinutes()
          ).padStart(2, "0")}`;
    },
  },
};
</script>
<style scoped>
.task-layout {
  display: flex;
  width: 100%;
  min-width: 0;
  min-height: 100vh;
  background: #f8fafc;
  color: #1f2937;
}
.task-page {
  flex: 1 1 0;
  width: 0;
  min-width: 0;
  padding: 28px clamp(16px, 3vw, 40px) 56px;
}
.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  padding: 0 0 24px;
}
.page-head h1 {
  font-size: 24px;
  line-height: 1.3;
  font-weight: 700;
}
.visibility-control {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 6px;
  background: #e5e7eb;
  color: #4b5563;
  font-size: 13px;
  font-weight: 500;
}
.visibility-control select {
  max-width: 150px;
  border: 0;
  background: transparent;
  color: #374151;
}
.task-section {
  width: 100%;
  min-width: 0;
  padding: 28px clamp(16px, 3vw, 40px);
  background: #fff;
  border-radius: 8px;
}
.task-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.task-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.task-tabs button {
  padding: 9px 18px;
  border-radius: 999px;
  color: #4b5563;
  font-size: 14px;
}
.task-tabs button:hover,
.task-tabs button.active {
  color: #4338ca;
  background: #e0e7ff;
}
.task-tabs .filter-button {
  color: #4b5563;
}
.primary-action,
.complete-selected {
  padding: 12px 20px;
  border-radius: 4px;
  background: #4338ca;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}
.primary-action:hover,
.complete-selected:hover {
  background: #4f46e5;
}
.task-search-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin: 24px 0 16px;
}
.search-box {
  width: min(100%, 340px);
}
.search-box input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  color: #374151;
  font-size: 13px;
}
.sort-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 13px;
}
.sort-label select {
  padding: 9px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
}
.selection-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 6px;
  background: #eef2ff;
  color: #4b5563;
  font-size: 13px;
}
.selection-bar > div {
  display: flex;
  align-items: center;
  gap: 16px;
}
.text-control {
  color: #4338ca;
  font-weight: 600;
  font-size: 13px;
}
.complete-selected {
  padding: 9px 12px;
}
.complete-selected:disabled {
  opacity: 0.5;
}
.task-notice {
  padding: 10px 0;
  color: #2563a6;
  font-size: 13px;
}
.task-error {
  color: #b91c1c;
}
.task-feedback {
  padding: 48px 16px;
  color: #6b7280;
  text-align: center;
  font-size: 14px;
}
.task-feedback strong {
  display: block;
  color: #374151;
}
.task-feedback p {
  margin: 7px 0 12px;
}
.task-feedback button {
  color: #4338ca;
  text-decoration: underline;
  font-weight: 600;
}
.table-wrap {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.06);
}
table {
  width: 100%;
  min-width: 790px;
  border-collapse: collapse;
  text-align: left;
}
th {
  position: relative;
  padding: 14px 16px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}
th.select-column {
  width: 38px;
  padding-right: 0;
}
input[type="checkbox"] {
  accent-color: #4f46e5;
}
.scroll-hint {
  display: none;
  color: #6b7280;
  font-size: 11px;
  padding-top: 10px;
}
.table-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 0 0;
  color: #6b7280;
  font-size: 12px;
}
@media (max-width: 700px) {
  .task-page {
    padding: 20px 12px 40px;
  }
  .page-head {
    padding-bottom: 16px;
  }
  .page-head h1 {
    font-size: 21px;
  }
  .task-section {
    padding: 20px 14px;
  }
  .task-toolbar {
    align-items: flex-start;
  }
  .task-tabs {
    gap: 4px;
  }
  .task-tabs button {
    padding: 8px 12px;
  }
  .task-search-row {
    align-items: flex-start;
    flex-direction: column;
  }
  .search-box {
    width: 100%;
  }
  .scroll-hint {
    display: block;
  }
  .table-footer span:last-child {
    display: none;
  }
}
</style>
