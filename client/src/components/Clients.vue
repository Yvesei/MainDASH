<template>
  <div class="client-layout">
    <Navbar />
    <main id="main-content" class="client-page" tabindex="-1">
      <header class="page-header"><h1>Clients</h1></header>
      <section class="directory" aria-label="Client list">
        <div class="toolbar">
          <div class="tabs" aria-label="Filter by task status">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              type="button"
              :class="{ selected: selected === tab.value }"
              :aria-pressed="selected === tab.value"
              @click="selected = tab.value"
            >
              {{ tab.label }}
            </button>
          </div>
          <div class="toolbar-actions">
            <button
              type="button"
              class="export-button"
              :disabled="loading || !!error || !visibleClients.length"
              @click="exportCsv"
            >
              Export CSV</button
            ><button type="button" class="primary-button" @click="popup = true">
              Add Client
            </button>
          </div>
        </div>
        <div class="filter-row">
          <label class="search-label" for="client-search"
            ><span class="sr-only">Search clients</span
            ><input
              id="client-search"
              v-model.trim="search"
              type="search"
              name="client-search"
              autocomplete="off"
              placeholder="Search name or phone…"
          /></label>
          <div class="filter-controls">
            <label class="select-label"
              >Show
              <select v-model="visibility">
                <option value="active">Active clients</option>
                <option value="hidden">Archived clients</option>
                <option value="all">All clients</option>
              </select></label
            ><label class="select-label"
              >Sort by
              <select v-model="sort">
                <option value="name">Name A–Z</option>
                <option value="recent">Latest task</option>
                <option value="pending">Most pending</option>
                <option value="distance">Distance</option>
              </select></label
            >
          </div>
        </div>
        <p v-if="notice" class="archive-notice" role="status">
          {{ notice.name }} {{ notice.archived ? "archived." : "restored." }}
          <button
            v-if="notice.archived"
            type="button"
            :disabled="undoBusy"
            @click="undoArchive"
          >
            {{ undoBusy ? "Restoring…" : "Undo" }}
          </button>
        </p>
        <p v-if="undoError" class="archive-error" role="alert">
          {{ undoError }}
        </p>
        <p v-if="loading" class="feedback" role="status">Loading clients…</p>
        <p v-else-if="error" class="feedback" role="alert">
          {{ error }} <button @click="fetchClients">Try again</button>
        </p>
        <div v-else-if="!visibleClients.length" class="empty">
          <strong>No clients found</strong>
          <p>
            {{
              search || selected !== "all" || visibility !== "active"
                ? "Try a different search or filter."
                : "Add a client to get started."
            }}
          </p>
          <button
            v-if="!search && selected === 'all' && visibility === 'active'"
            @click="popup = true"
          >
            Add Client
          </button>
        </div>
        <div
          v-else
          class="table-wrap"
          tabindex="0"
          role="region"
          aria-label="Clients; scroll horizontally for more columns"
        >
          <table>
            <thead>
              <tr>
                <th scope="col">Client</th>
                <th scope="col">Phone</th>
                <th scope="col">Distance</th>
                <th scope="col">Tasks</th>
                <th scope="col">Latest task</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <ClientRow
                v-for="client in visibleClients"
                :key="client.id"
                :client="client"
                :is-admin="isAdmin"
                @client-changed="clientChanged"
              />
            </tbody>
          </table>
        </div>
        <p
          v-if="!loading && !error && visibleClients.length"
          class="table-hint"
        >
          Scroll to see more columns →
        </p>
        <div
          v-if="!loading && !error"
          class="directory-footer"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span
            >Showing {{ visibleClients.length }}
            {{ visibleClients.length === 1 ? "client" : "clients" }}</span
          ><span
            >{{ withPending }} with pending work ·
            {{ archivedCount }} archived</span
          >
        </div>
      </section>
    </main>
    <AddClientPopup
      :show-popup="popup"
      @close="popup = false"
      @client-added="fetchClients"
    />
  </div>
</template>
<script>
import axios from "axios";
import AddClientPopup from "./AddClientPopup.vue";
import ClientRow from "./ClientRow.vue";
import Navbar from "./Navbar.vue";

function filtersFromQuery(query) {
  return {
    search: typeof query.q === "string" ? query.q : "",
    selected: ["all", "done", "pending"].includes(query.status)
      ? query.status
      : "all",
    visibility: ["active", "hidden", "all"].includes(query.visibility)
      ? query.visibility
      : "active",
    sort: ["name", "recent", "pending", "distance"].includes(query.sort)
      ? query.sort
      : "name",
  };
}
export default {
  components: { ClientRow, AddClientPopup, Navbar },
  data() {
    return {
      popup: false,
      clients: [],
      isAdmin: false,
      loading: true,
      error: "",
      requestId: 0,
      ...filtersFromQuery(this.$route.query),
      filterSyncTimer: null,
      notice: null,
      undoBusy: false,
      undoError: "",
      tabs: [
        { value: "all", label: "All" },
        { value: "done", label: "Done" },
        { value: "pending", label: "Pending" },
      ],
    };
  },
  computed: {
    activeClients() {
      return this.clients.filter((client) => !client.deleted);
    },
    withPending() {
      return this.activeClients.filter((client) => client.pendingCount > 0)
        .length;
    },
    archivedCount() {
      return this.clients.filter((client) => client.deleted).length;
    },
    visibleClients() {
      const search = this.search.toLocaleLowerCase();
      const clients = this.clients.filter((client) => {
        if (this.visibility === "active" && client.deleted) return false;
        if (this.visibility === "hidden" && !client.deleted) return false;
        if (this.selected === "pending" && !client.pendingCount) return false;
        if (
          this.selected === "done" &&
          (!client.taskCount || client.pendingCount)
        )
          return false;
        return (
          !search ||
          [client.name, client.number].some((value) =>
            String(value || "")
              .toLocaleLowerCase()
              .includes(search)
          )
        );
      });
      return clients.sort((a, b) => {
        let comparison = 0;
        if (this.sort === "recent")
          comparison =
            (Date.parse(b.latestTaskDate) || 0) -
            (Date.parse(a.latestTaskDate) || 0);
        if (this.sort === "pending")
          comparison = (b.pendingCount || 0) - (a.pendingCount || 0);
        if (this.sort === "distance")
          comparison = (a.distance ?? Infinity) - (b.distance ?? Infinity);
        return (
          comparison ||
          a.name.localeCompare(b.name, undefined, {
            sensitivity: "base",
            numeric: true,
          })
        );
      });
    },
  },
  watch: {
    search() {
      this.scheduleFilterSync();
    },
    selected() {
      this.scheduleFilterSync();
    },
    visibility() {
      this.scheduleFilterSync();
    },
    sort() {
      this.scheduleFilterSync();
    },
    "$route.query"(query) {
      clearTimeout(this.filterSyncTimer);
      Object.assign(this, filtersFromQuery(query));
    },
  },
  mounted() {
    this.fetchClients();
  },
  beforeUnmount() {
    clearTimeout(this.filterSyncTimer);
  },
  methods: {
    scheduleFilterSync() {
      clearTimeout(this.filterSyncTimer);
      this.filterSyncTimer = setTimeout(() => {
        if (this.$route.path !== "/clients") return;
        const query = { ...this.$route.query };
        for (const [key, value, defaultValue] of [
          ["q", this.search, ""],
          ["status", this.selected, "all"],
          ["visibility", this.visibility, "active"],
          ["sort", this.sort, "name"],
        ]) {
          if (value === defaultValue) delete query[key];
          else query[key] = value;
        }
        if (JSON.stringify(query) !== JSON.stringify(this.$route.query))
          this.$router.replace({ query });
      }, 250);
    },
    clientChanged(action) {
      if (action && typeof action === "object" && action.id) {
        this.notice = action;
        this.undoError = "";
      }
      this.fetchClients();
    },
    async undoArchive() {
      if (!this.notice?.archived || this.undoBusy) return;
      const action = this.notice;
      this.undoBusy = true;
      this.undoError = "";
      try {
        await axios.delete(`/clients/${action.id}`);
        if (this.notice === action)
          this.notice = { ...action, archived: false };
        await this.fetchClients();
      } catch (error) {
        this.undoError = "Could not restore the client. Try again.";
      } finally {
        this.undoBusy = false;
      }
    },
    async fetchClients() {
      const requestId = ++this.requestId;
      this.loading = true;
      this.error = "";
      try {
        const [clients, user] = await Promise.all([
          axios.get("/clients", {
            params: { includeHidden: true, summary: true },
          }),
          axios.get("/users/current-user-get"),
        ]);
        if (requestId !== this.requestId) return;
        this.clients = clients.data;
        this.isAdmin = user.data.role === "ADMIN";
      } catch (error) {
        if (requestId === this.requestId)
          this.error = "Could not load your clients.";
      } finally {
        if (requestId === this.requestId) this.loading = false;
      }
    },
    exportCsv() {
      const escape = (value) => {
        const string = String(value ?? "");
        return `"${
          (/^[\s]*[=+\-@\t\r]/.test(string) ? "'" : "") +
          string.replace(/"/g, '""')
        }"`;
      };
      const rows = [
        [
          "Client",
          "Phone",
          "Distance (km)",
          "Tasks",
          "Pending",
          "Latest task",
          "Archived",
        ],
        ...this.visibleClients.map((client) => [
          client.name,
          client.number,
          client.distance,
          client.taskCount,
          client.pendingCount,
          client.latestTaskDate
            ? new Date(client.latestTaskDate).toLocaleDateString()
            : "",
          client.deleted ? "Yes" : "No",
        ]),
      ];
      const url = URL.createObjectURL(
        new Blob(
          ["\ufeff", rows.map((row) => row.map(escape).join(",")).join("\r\n")],
          { type: "text/csv;charset=utf-8" }
        )
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "clients.csv";
      link.click();
      URL.revokeObjectURL(url);
    },
  },
};
</script>
<style scoped>
.client-layout {
  display: flex;
  width: 100%;
  min-width: 0;
  min-height: 100vh;
  background: #f9fafb;
}
.client-page {
  flex: 1 1 0%;
  min-width: 0;
  width: 0;
  padding: 28px clamp(20px, 4vw, 48px) 48px;
  color: #1f2937;
}
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.page-header h1 {
  font-size: 24px;
  line-height: 1.35;
  font-weight: 700;
}
.directory {
  min-width: 0;
  max-width: 100%;
  padding: 28px 32px;
  background: white;
}
.toolbar,
.toolbar-actions,
.tabs,
.filter-controls,
.filter-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.toolbar,
.filter-row {
  justify-content: space-between;
}
.tabs {
  gap: 8px;
}
.tabs button {
  padding: 9px 20px;
  border-radius: 999px;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
}
.tabs button:hover {
  background: #f5f3ff;
  color: #4338ca;
}
.tabs button.selected {
  background: #e0e7ff;
  color: #4338ca;
}
.toolbar-actions {
  margin-left: auto;
}
.primary-button {
  padding: 12px 22px;
  border-radius: 4px;
  background: #4338ca;
  color: white;
  font-size: 14px;
  font-weight: 600;
}
.primary-button:hover {
  background: #4f46e5;
}
.export-button {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  color: #4b5563;
  font-size: 13px;
  font-weight: 600;
}
.export-button:hover {
  background: #f9fafb;
}
.export-button:disabled {
  opacity: 0.5;
}
.filter-row {
  margin: 24px 0 4px;
}
.search-label {
  width: min(100%, 280px);
}
.search-label input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 5px;
  background: white;
  color: #374151;
  font-size: 14px;
}
.filter-controls {
  gap: 16px;
}
.select-label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 13px;
}
.select-label select {
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: white;
  color: #374151;
  font-size: 13px;
}
.table-wrap {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  margin-top: 22px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}
.table-wrap table {
  width: 100%;
  min-width: 760px;
  text-align: left;
}
.table-wrap th {
  padding: 13px 20px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.table-wrap th:not(:first-child) {
  text-align: center;
}
.table-wrap th:last-child {
  width: 100px;
}
.archive-notice,
.archive-error {
  margin-top: 18px;
  padding: 10px 12px;
  border-radius: 4px;
  font-size: 13px;
}
.archive-notice {
  background: #eef2ff;
  color: #3730a3;
}
.archive-notice button {
  margin-left: 8px;
  font-weight: 700;
  text-decoration: underline;
}
.archive-notice button:disabled {
  opacity: 0.6;
}
.archive-error {
  background: #fef2f2;
  color: #b91c1c;
}
.feedback,
.empty {
  margin-top: 22px;
  padding: 44px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  color: #6b7280;
  text-align: center;
  font-size: 14px;
}
.feedback button,
.empty button {
  color: #4338ca;
  font-weight: 600;
  text-decoration: underline;
}
.empty strong {
  display: block;
  color: #374151;
  font-weight: 600;
}
.empty p {
  margin: 8px 0 16px;
}
.table-hint {
  display: none;
  padding-top: 10px;
  color: #6b7280;
  font-size: 12px;
}
.directory-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-top: 14px;
  color: #6b7280;
  font-size: 12px;
}
@media (max-width: 900px) {
  .table-hint {
    display: block;
  }
}
@media (max-width: 700px) {
  .client-page {
    padding: 24px 16px 40px;
  }
  .directory {
    padding: 20px 16px;
  }
  .toolbar-actions {
    margin-left: 0;
  }
  .tabs button {
    padding: 8px 13px;
  }
  .filter-row {
    align-items: stretch;
    flex-direction: column;
  }
  .search-label {
    width: 100%;
  }
  .directory-footer {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
