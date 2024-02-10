<template>
  <main id="main-content" tabindex="-1" class="dashboard">
    <header class="page-heading">
      <div>
        <h1>Dashboard</h1>
        <p>Tasks, clients and recorded time.</p>
      </div>
      <div class="heading-actions">
        <span class="today">{{ today }}</span
        ><button class="add-button" type="button" @click="taskPopup = true">
          <span aria-hidden="true">+</span> New task
        </button>
      </div>
    </header>
    <div v-if="error" class="notice" role="alert">
      Some workspace data could not be loaded.
      <button type="button" @click="loadDashboard">Try again</button>
    </div>
    <section class="focus-panel" aria-labelledby="focus-heading">
      <div class="focus-kicker">Next task</div>
      <template v-if="nextTask">
        <div class="focus-task">
          <span class="focus-number" aria-hidden="true">{{
            String(nextTask.id).padStart(2, "0")
          }}</span>
          <div class="focus-copy">
            <h2 id="focus-heading">{{ nextTask.type || "Untitled task" }}</h2>
            <p>
              {{ clientName(nextTask.clientId) }}
              <span aria-hidden="true">·</span>
              {{ taskScheduleLabel(nextTask) }}
            </p>
          </div>
          <div class="focus-actions">
            <router-link :to="{ path: '/tasks', query: { task: nextTask.id } }"
              >Open task <span aria-hidden="true">↗</span></router-link
            ><button
              type="button"
              :disabled="busyTask !== null"
              @click="completeTask(nextTask)"
            >
              {{ busyTask === nextTask.id ? "Saving…" : "Complete" }}
            </button>
          </div>
        </div>
      </template>
      <div v-else class="focus-empty">
        <h2 id="focus-heading">No task queued</h2>
        <p>{{ loading ? "Loading tasks…" : "There are no open tasks." }}</p>
        <button type="button" @click="taskPopup = true">Add a task</button>
      </div>
      <div class="focus-stats" aria-label="Task timing summary">
        <div>
          <strong>{{ taskDataAvailable ? overdueTasks.length : "—" }}</strong
          ><span>overdue</span>
        </div>
        <div>
          <strong>{{ taskDataAvailable ? dueThisWeek.length : "—" }}</strong
          ><span>this week</span>
        </div>
      </div>
    </section>
    <section class="summary" aria-label="Workspace summary">
      <router-link
        :to="{ path: '/tasks', query: { status: 'pending' } }"
        class="summary-item"
        ><span class="summary-label">Open tasks</span
        ><span class="metric-icon blue" aria-hidden="true"
          ><svg viewBox="0 0 24 24">
            <path
              d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"
            /></svg></span
        ><strong>{{ taskDataAvailable ? pendingTasks.length : "—" }}</strong
        ><span class="summary-note">Awaiting completion</span></router-link
      >
      <router-link
        :to="{ path: '/tasks', query: { status: 'done' } }"
        class="summary-item"
        ><span class="summary-label">Completed</span
        ><span class="metric-icon green" aria-hidden="true"
          ><svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></svg></span
        ><strong>{{ taskDataAvailable ? completedTasks.length : "—" }}</strong
        ><span class="summary-note">{{
          taskDataAvailable
            ? `${tasks.length} tasks in total`
            : "Tasks in total"
        }}</span></router-link
      >
      <router-link to="/clients" class="summary-item"
        ><span class="summary-label">Clients</span
        ><span class="metric-icon purple" aria-hidden="true"
          ><svg viewBox="0 0 24 24">
            <circle cx="9" cy="8" r="3" />
            <path
              d="M3.5 20v-1.5a5.5 5.5 0 0 1 11 0V20M16 5.3a3 3 0 0 1 0 5.4M17 14a5 5 0 0 1 3.5 4.8V20"
            /></svg></span
        ><strong>{{ clientDataAvailable ? activeClients.length : "—" }}</strong
        ><span class="summary-note">Active in your directory</span></router-link
      >
      <div class="summary-item">
        <span class="summary-label">Time recorded</span
        ><span class="metric-icon orange" aria-hidden="true"
          ><svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" />
            <path d="M12 7v5l3 2" /></svg></span
        ><strong class="hours-value">{{
          taskDataAvailable ? recordedHours : "—"
        }}</strong
        ><span class="summary-note">Hours on completed tasks</span>
      </div>
    </section>
    <div class="workspace-grid">
      <section class="panel work-panel" aria-labelledby="work-heading">
        <div class="panel-heading">
          <div>
            <h2 id="work-heading">Work queue</h2>
            <p>Open work and recent completions.</p>
          </div>
          <router-link to="/tasks" class="text-link">All tasks ↗</router-link>
        </div>
        <div class="queue-controls">
          <div class="queue-tabs" aria-label="Work queue">
            <button
              type="button"
              :class="{ selected: queueTab === 'open' }"
              :aria-pressed="queueTab === 'open'"
              @click="queueTab = 'open'"
            >
              Open
              <span>{{
                taskDataAvailable ? pendingTasks.length : "—"
              }}</span></button
            ><button
              type="button"
              :class="{ selected: queueTab === 'recent' }"
              :aria-pressed="queueTab === 'recent'"
              @click="queueTab = 'recent'"
            >
              Recently completed
              <span>{{ taskDataAvailable ? completedTasks.length : "—" }}</span>
            </button>
          </div>
          <label class="queue-search"
            ><span class="sr-only">Search the work queue</span
            ><svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              aria-hidden="true"
            >
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 4 4" stroke-linecap="round" /></svg
            ><input
              v-model.trim="queueSearch"
              type="search"
              placeholder="Search tasks…"
          /></label>
        </div>
        <div
          v-if="loading && !taskDataAvailable"
          class="empty-state"
          role="status"
        >
          Loading your tasks…
        </div>
        <div v-else-if="!taskDataAvailable" class="empty-state">
          Tasks are unavailable right now.
        </div>
        <div v-else-if="!queueTasks.length" class="empty-state">
          <span class="empty-symbol" aria-hidden="true">{{
            queueSearch ? "⌕" : queueTab === "open" ? "✓" : "—"
          }}</span
          ><strong>{{
            queueSearch
              ? "No matching tasks"
              : queueTab === "open"
              ? "No open tasks"
              : "No completed tasks yet"
          }}</strong
          ><button
            v-if="queueSearch"
            type="button"
            class="clear-search"
            @click="queueSearch = ''"
          >
            Clear search</button
          ><span v-else>{{
            queueTab === "open"
              ? "New work will appear here."
              : "Completed work will appear here."
          }}</span>
        </div>
        <template v-else
          ><div class="queue-header" aria-hidden="true">
            <span>ID</span><span>Task</span><span>Client</span
            ><span>{{ queueTab === "open" ? "Task date" : "Completed" }}</span
            ><span></span>
          </div>
          <ul class="task-list">
            <li v-for="task in queueTasks" :key="task.id" class="task-row">
              <span class="task-index">{{
                String(task.id).padStart(2, "0")
              }}</span>
              <div class="task-main">
                <router-link
                  :to="{ path: '/tasks', query: { task: task.id } }"
                  class="task-name"
                  :aria-label="`${
                    task.type || 'Untitled task'
                  } for ${clientName(task.clientId)}`"
                  >{{ task.type || "Untitled task" }}</router-link
                >
              </div>
              <span class="task-client" :title="clientName(task.clientId)">{{
                clientName(task.clientId)
              }}</span>
              <div class="task-date">
                <strong>{{
                  formatDate(queueTab === "open" ? task.Date : task.dateEnd)
                }}</strong>
              </div>
              <button
                v-if="queueTab === 'open'"
                type="button"
                class="complete-button"
                :disabled="busyTask !== null"
                :aria-label="`Mark ${task.type || 'task'} for ${clientName(
                  task.clientId
                )} complete`"
                @click="completeTask(task)"
              >
                {{ busyTask === task.id ? "Saving…" : "Complete" }}</button
              ><router-link
                v-else
                :to="{ path: '/tasks', query: { task: task.id } }"
                class="row-arrow"
                :aria-label="`View ${task.type || 'task'} for ${clientName(
                  task.clientId
                )}`"
                >↗</router-link
              >
            </li>
          </ul></template
        >
        <p v-if="actionError" class="action-error" role="alert">
          {{ actionError }}
        </p>
        <p v-if="actionMessage" class="action-message" role="status">
          {{ actionMessage }}
        </p>
        <div class="panel-footer">
          <span aria-live="polite">{{
            queueSearch
              ? `${filteredQueueTasks.length} matching ${
                  filteredQueueTasks.length === 1 ? "task" : "tasks"
                }`
              : queueTab === "open"
              ? "Showing oldest open work"
              : "Showing most recently completed"
          }}</span
          ><router-link
            :to="{
              path: '/tasks',
              query: { status: queueTab === 'open' ? 'pending' : 'done' },
            }"
            >View {{ queueTab === "open" ? "open" : "completed" }} tasks
            →</router-link
          >
        </div>
      </section>
      <div class="side-column">
        <section
          class="panel activity-panel"
          aria-labelledby="activity-heading"
        >
          <div class="panel-heading">
            <div>
              <h2 id="activity-heading">Work over time</h2>
              <p>Tasks by their recorded date.</p>
            </div>
            <div class="range-control" aria-label="Activity range">
              <button
                type="button"
                :class="{ selected: months === 6 }"
                :aria-pressed="months === 6"
                @click="months = 6"
              >
                6M</button
              ><button
                type="button"
                :class="{ selected: months === 12 }"
                :aria-pressed="months === 12"
                @click="months = 12"
              >
                12M
              </button>
            </div>
          </div>
          <div class="chart-total">
            <strong>{{ taskDataAvailable ? periodTotal : "—" }}</strong
            ><span>tasks in the<br />last {{ months }} months</span>
          </div>
          <div v-if="taskDataAvailable" class="chart-frame">
            <div class="chart-axis" aria-hidden="true">
              <span>{{ chartScale }}</span
              ><span>{{ chartScale / 2 }}</span
              ><span>0</span>
            </div>
            <div class="bar-chart" role="img" :aria-label="activityDescription">
              <div class="chart-grid" aria-hidden="true"></div>
              <div v-for="bar in activity" :key="bar.key" class="bar-column">
                <span class="bar-value">{{ bar.count || "" }}</span>
                <div class="bar-track">
                  <span
                    class="bar"
                    :class="{ current: bar.current, zero: !bar.count }"
                    :style="{ height: barHeight(bar.count) }"
                  ></span>
                </div>
                <span class="bar-label">{{ bar.label }}</span>
              </div>
            </div>
          </div>
          <div v-else class="chart-placeholder">
            {{ loading ? "Loading activity…" : "Activity is unavailable." }}
          </div>
          <p class="chart-caption">
            <i></i> Current month <span>·</span> Based on task dates
          </p>
        </section>
        <section class="panel clients-panel" aria-labelledby="clients-heading">
          <div class="panel-heading">
            <div>
              <h2 id="clients-heading">Client workload</h2>
              <p>Open tasks for active clients.</p>
            </div>
            <router-link to="/clients" class="text-link"
              >Directory ↗</router-link
            >
          </div>
          <div
            v-if="!taskDataAvailable || !clientDataAvailable"
            class="client-empty"
          >
            {{
              loading ? "Loading clients…" : "Client workload is unavailable."
            }}
          </div>
          <div v-else-if="!workload.length" class="client-empty">
            No active clients with open tasks.
          </div>
          <ol v-else class="client-list">
            <li v-for="(client, index) in workload" :key="client.id">
              <span class="client-number">{{
                String(index + 1).padStart(2, "0")
              }}</span
              ><router-link
                :to="{ path: '/result', query: { client: client.id } }"
                >{{ client.name }}</router-link
              ><span class="client-count"
                >{{ client.count }}
                {{ client.count === 1 ? "task" : "tasks" }}</span
              ><span class="client-arrow" aria-hidden="true">↗</span>
            </li>
          </ol>
        </section>
      </div>
    </div>
    <add-task-popup
      :show-popup="taskPopup"
      @close="taskPopup = false"
      @task-added="loadDashboard"
    />
  </main>
</template>
<script>
import axios from "axios";
import AddTaskPopup from "./AddTaskPopup.vue";
export default {
  name: "Home",
  components: { AddTaskPopup },
  data() {
    return {
      tasks: [],
      clients: [],
      taskDataAvailable: false,
      clientDataAvailable: false,
      loading: true,
      error: false,
      actionError: "",
      actionMessage: "",
      busyTask: null,
      taskPopup: false,
      queueTab: "open",
      queueSearch: "",
      months: 6,
      requestId: 0,
    };
  },
  computed: {
    today() {
      return new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date());
    },
    pendingTasks() {
      return this.tasks.filter((task) => !task.status);
    },
    orderedPendingTasks() {
      return [...this.pendingTasks].sort(
        (a, b) =>
          (this.taskTimestamp(a.Date) ?? Infinity) -
          (this.taskTimestamp(b.Date) ?? Infinity)
      );
    },
    nextTask() {
      return this.orderedPendingTasks[0] || null;
    },
    overdueTasks() {
      const today = this.startOfDay(new Date());
      return this.pendingTasks.filter((task) => {
        const date = this.startOfDay(new Date(task.Date));
        return task.Date && !Number.isNaN(date.getTime()) && date < today;
      });
    },
    dueThisWeek() {
      const today = this.startOfDay(new Date());
      const end = new Date(today);
      end.setDate(end.getDate() + 6);
      return this.pendingTasks.filter((task) => {
        const date = this.startOfDay(new Date(task.Date));
        return (
          task.Date &&
          !Number.isNaN(date.getTime()) &&
          date >= today &&
          date <= end
        );
      });
    },
    completedTasks() {
      return this.tasks.filter((task) => task.status === true);
    },
    activeClients() {
      return this.clients.filter((client) => !client.deleted);
    },
    recordedHours() {
      const minutes = this.completedTasks.reduce((total, task) => {
        if (!task.dateStart || !task.dateEnd) return total;
        const duration =
          (new Date(task.dateEnd) - new Date(task.dateStart)) / 60000;
        return (
          total +
          (Number.isFinite(duration) ? Math.max(0, Math.floor(duration)) : 0)
        );
      }, 0);
      return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(
        2,
        "0"
      )}m`;
    },
    filteredQueueTasks() {
      const query = this.queueSearch.toLocaleLowerCase();
      const tasks =
        this.queueTab === "open" ? this.pendingTasks : this.completedTasks;
      return query
        ? tasks.filter((task) =>
            [
              task.type,
              task.result,
              task.supply,
              this.clientName(task.clientId),
            ].some((value) =>
              String(value || "")
                .toLocaleLowerCase()
                .includes(query)
            )
          )
        : tasks;
    },
    queueTasks() {
      return this.queueTab === "open"
        ? [...this.filteredQueueTasks]
            .sort(
              (a, b) =>
                (this.taskTimestamp(a.Date) ?? Infinity) -
                (this.taskTimestamp(b.Date) ?? Infinity)
            )
            .slice(0, 5)
        : [...this.filteredQueueTasks]
            .sort(
              (a, b) =>
                (this.taskTimestamp(b.dateEnd) ?? 0) -
                (this.taskTimestamp(a.dateEnd) ?? 0)
            )
            .slice(0, 5);
    },
    workload() {
      return this.activeClients
        .map((client) => ({
          ...client,
          count: this.pendingTasks.filter((task) => task.clientId === client.id)
            .length,
        }))
        .filter((client) => client.count)
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
        .slice(0, 4);
    },
    activity() {
      const today = new Date();
      return Array.from({ length: this.months }, (_, index) => {
        const date = new Date(
          today.getFullYear(),
          today.getMonth() - this.months + index + 1,
          1
        );
        const count = this.tasks.filter((task) => {
          if (!task.Date) return false;
          const taskDate = new Date(task.Date);
          return (
            !Number.isNaN(taskDate.getTime()) &&
            taskDate.getFullYear() === date.getFullYear() &&
            taskDate.getMonth() === date.getMonth()
          );
        }).length;
        return {
          key: `${date.getFullYear()}-${date.getMonth()}`,
          label: new Intl.DateTimeFormat(undefined, { month: "short" }).format(
            date
          ),
          count,
          current: index === this.months - 1,
        };
      });
    },
    chartScale() {
      const max = Math.max(0, ...this.activity.map((bar) => bar.count));
      return Math.max(2, Math.ceil(max / 2) * 2);
    },
    periodTotal() {
      return this.activity.reduce((sum, month) => sum + month.count, 0);
    },
    activityDescription() {
      return `Tasks by month: ${this.activity
        .map((month) => `${month.label} ${month.count}`)
        .join(", ")}.`;
    },
  },
  mounted() {
    this.loadDashboard();
  },
  methods: {
    async loadDashboard() {
      const request = ++this.requestId;
      this.loading = true;
      this.error = false;
      const results = await Promise.allSettled([
        axios.get("/tasks/latest", { params: { deleted: "undeleted" } }),
        axios.get("/clients", { params: { includeHidden: true } }),
      ]);
      if (request !== this.requestId) return false;
      if (results[0].status === "fulfilled") {
        this.tasks = results[0].value.data;
        this.taskDataAvailable = true;
      }
      if (results[1].status === "fulfilled") {
        this.clients = results[1].value.data;
        this.clientDataAvailable = true;
      }
      this.error = results.some((result) => result.status === "rejected");
      this.loading = false;
      return results[0].status === "fulfilled";
    },
    clientName(id) {
      return (
        this.clients.find((client) => client.id === id)?.name ||
        (this.clientDataAvailable ? "Unknown client" : "Client unavailable")
      );
    },
    taskTimestamp(value) {
      const date = new Date(value);
      return value && !Number.isNaN(date.getTime()) ? date.getTime() : null;
    },
    startOfDay(date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    },
    taskScheduleLabel(task) {
      const date = this.startOfDay(new Date(task.Date));
      if (!task.Date || Number.isNaN(date.getTime())) return "No date set";
      const today = this.startOfDay(new Date());
      const days = Math.round((date - today) / 86400000);
      if (days < 0)
        return `${Math.abs(days)} day${
          Math.abs(days) === 1 ? "" : "s"
        } overdue`;
      if (days === 0) return "Due today";
      if (days === 1) return "Due tomorrow";
      return `Due ${this.formatDate(task.Date)}`;
    },
    formatDate(value) {
      if (!value) return "—";
      const date = new Date(value);
      return Number.isNaN(date.getTime())
        ? "—"
        : new Intl.DateTimeFormat(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          }).format(date);
    },
    barHeight(count) {
      return count ? `${(count / this.chartScale) * 100}%` : "2px";
    },
    async completeTask(task) {
      if (this.busyTask !== null) return;
      this.busyTask = task.id;
      this.actionError = "";
      this.actionMessage = "";
      try {
        await axios.patch("/tasks/markDone", { idArray: task.id });
        if (await this.loadDashboard())
          this.actionMessage = "Task marked complete.";
        else
          this.actionError =
            "Task marked complete, but the dashboard could not be refreshed.";
      } catch (error) {
        this.actionError = "Could not complete this task. Please try again.";
      } finally {
        this.busyTask = null;
      }
    },
  },
};
</script>
<style scoped>
.dashboard {
  flex: 1;
  min-width: 0;
  width: 100%;
  max-width: 1660px;
  margin: 0 auto;
  padding: 32px clamp(20px, 3vw, 42px) 56px;
  color: #1f2937;
  background: #f8fafc;
}
.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}
.page-heading h1 {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;
}
.page-heading p {
  margin-top: 3px;
  color: #6b7280;
  font-size: 13px;
}
.heading-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
.today {
  color: #6b7280;
  font-size: 12px;
  white-space: nowrap;
}
.add-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 16px;
  border-radius: 6px;
  background: #4338ca;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
.add-button:hover {
  background: #4f46e5;
}
.add-button span {
  font-size: 18px;
  line-height: 1;
}
.notice {
  margin-bottom: 16px;
  padding: 12px 15px;
  border-radius: 8px;
  background: #fff7ed;
  color: #9a3412;
  font-size: 13px;
}
.notice button {
  text-decoration: underline;
  font-weight: 700;
}
.focus-panel {
  display: grid;
  grid-template-columns: 106px minmax(0, 1fr) auto;
  align-items: center;
  gap: 24px;
  margin-bottom: 20px;
  padding: 18px 22px;
  border: 1px solid #bcd7f5;
  border-radius: 14px;
  background: #eaf3ff;
}
.focus-kicker {
  align-self: stretch;
  display: flex;
  align-items: center;
  color: #355d82;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.focus-task {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  min-width: 0;
}
.focus-number {
  color: #8fb5dc;
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.07em;
  line-height: 1;
}
.focus-copy {
  min-width: 0;
}
.focus-copy h2,
.focus-empty h2 {
  overflow: hidden;
  margin: 0;
  color: #1d3552;
  font-size: 16px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.focus-copy p,
.focus-empty p {
  margin: 5px 0 0;
  color: #55718e;
  font-size: 12px;
}
.focus-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.focus-actions a,
.focus-empty button {
  padding: 8px 10px;
  color: #315d8b;
  font-size: 12px;
  font-weight: 700;
}
.focus-actions a:hover {
  text-decoration: underline;
}
.focus-actions button {
  padding: 8px 11px;
  border: 1px solid #8fb5dc;
  border-radius: 6px;
  color: #274f78;
  background: #fff;
  font-size: 12px;
  font-weight: 700;
}
.focus-actions button:hover,
.focus-empty button:hover {
  background: #dceeff;
}
.focus-actions button:disabled {
  opacity: 0.55;
}
.focus-stats {
  display: flex;
  align-self: stretch;
  margin-left: 4px;
  border-left: 1px solid #bcd7f5;
}
.focus-stats div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 66px;
  padding-left: 18px;
}
.focus-stats strong {
  color: #1d3552;
  font-size: 18px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.focus-stats span {
  margin-top: 5px;
  color: #55718e;
  font-size: 10px;
  text-transform: uppercase;
}
.focus-empty {
  grid-column: 2;
}
.focus-empty button {
  margin-top: 8px;
  padding-left: 0;
}
.summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}
.summary-item {
  position: relative;
  display: block;
  min-width: 0;
  min-height: 130px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #fff;
}
.summary-item:first-child {
  background: #cce4ff;
  border-color: #cce4ff;
}
.summary a:hover {
  border-color: #a5b4fc;
}
.summary-label {
  display: block;
  padding-right: 42px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}
.summary-item:first-child .summary-label {
  color: #355d82;
}
.summary-item strong {
  display: block;
  margin-top: 12px;
  font-size: 25px;
  font-weight: 700;
  line-height: 1.2;
}
.summary-item strong.hours-value {
  font-size: 22px;
}
.summary-note {
  display: block;
  margin-top: 7px;
  color: #6b7280;
  font-size: 12px;
}
.metric-icon {
  position: absolute;
  top: 18px;
  right: 18px;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #dbeafe;
  color: #2563eb;
}
.metric-icon svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.metric-icon.green {
  background: #d1fae5;
  color: #059669;
}
.metric-icon.purple {
  background: #ede9fe;
  color: #7c3aed;
}
.metric-icon.orange {
  background: #ffedd5;
  color: #ea580c;
}
.workspace-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(320px, 0.85fr);
  gap: 16px;
  align-items: start;
  margin-top: 20px;
}
.side-column {
  display: grid;
  gap: 16px;
}
.panel {
  min-width: 0;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #fff;
}
.panel-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 22px 24px 0;
}
.panel h2 {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
}
.panel-heading p {
  margin-top: 4px;
  color: #6b7280;
  font-size: 12px;
}
.text-link {
  padding-top: 3px;
  color: #4f46e5;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
.text-link:hover,
.panel-footer a:hover {
  text-decoration: underline;
}
.queue-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 20px 24px 0;
}
.queue-tabs button {
  padding: 8px 13px;
  border-radius: 999px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
}
.queue-tabs button:hover {
  background: #f3f4f6;
}
.queue-tabs button.selected {
  background: #e0e7ff;
  color: #4338ca;
}
.queue-tabs button span {
  margin-left: 4px;
  font-size: 11px;
}
.task-list {
  margin: 8px 24px 0;
}
.task-row {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 72px;
  border-bottom: 1px solid #f3f4f6;
}
.task-index,
.client-number {
  flex: 0 0 auto;
  color: #9ca3af;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}
.task-main {
  flex: 1;
  min-width: 0;
}
.task-name {
  display: block;
  overflow: hidden;
  color: #374151;
  font-size: 13px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.task-name:hover {
  color: #4338ca;
  text-decoration: underline;
}
.task-client {
  display: block;
  overflow: hidden;
  margin-top: 4px;
  color: #6b7280;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.task-date {
  min-width: 90px;
  text-align: right;
}
.task-date span,
.task-date strong {
  display: block;
  font-size: 11px;
}
.task-date span {
  color: #9ca3af;
}
.task-date strong {
  margin-top: 4px;
  color: #6b7280;
  font-weight: 600;
  white-space: nowrap;
}
.complete-button {
  padding: 7px 10px;
  border: 1px solid #c7d2fe;
  border-radius: 6px;
  color: #4338ca;
  font-size: 11px;
  font-weight: 600;
}
.complete-button:hover {
  background: #eef2ff;
}
.complete-button:disabled {
  opacity: 0.5;
}
.row-arrow {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  color: #4f46e5;
  background: #eef2ff;
}
.action-error {
  padding: 10px 24px 0;
  color: #b91c1c;
  font-size: 12px;
}
.panel-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 17px 24px;
  color: #9ca3af;
  font-size: 11px;
}
.panel-footer a {
  color: #4f46e5;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
.empty-state {
  min-height: 210px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: #9ca3af;
  font-size: 12px;
}
.empty-state strong {
  color: #4b5563;
  font-size: 13px;
}
.empty-symbol {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  margin-bottom: 5px;
  border-radius: 50%;
  background: #eef2ff;
  color: #6366f1;
  font-size: 16px;
}
.range-control {
  display: flex;
  padding: 3px;
  border-radius: 6px;
  background: #f3f4f6;
}
.range-control button {
  padding: 5px 8px;
  border-radius: 4px;
  color: #6b7280;
  font-size: 10px;
  font-weight: 700;
}
.range-control button.selected {
  background: #fff;
  color: #4338ca;
}
.chart-total {
  display: flex;
  align-items: center;
  gap: 11px;
  margin: 22px 24px 0;
}
.chart-total strong {
  font-size: 25px;
  line-height: 1;
  font-weight: 700;
}
.chart-total span {
  color: #9ca3af;
  font-size: 11px;
  line-height: 1.35;
}
.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: clamp(4px, 1vw, 14px);
  height: 132px;
  margin: 18px 24px 0;
  border-bottom: 1px solid #e5e7eb;
}
.bar-column {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  height: 100%;
}
.bar-value {
  height: 18px;
  color: #9ca3af;
  font-size: 10px;
  line-height: 18px;
}
.bar-track {
  display: flex;
  flex: 1;
  align-items: flex-end;
  width: 100%;
  min-height: 0;
}
.bar {
  display: block;
  width: min(100%, 32px);
  margin: 0 auto;
  border-radius: 4px 4px 0 0;
  background: #bfdbfe;
}
.bar.current {
  background: #3b82f6;
}
.bar.zero {
  background: #e5e7eb;
}
.bar-label {
  position: relative;
  top: 7px;
  height: 0;
  color: #9ca3af;
  font-size: 10px;
  white-space: nowrap;
}
.chart-placeholder {
  display: grid;
  place-items: center;
  height: 140px;
  color: #9ca3af;
  font-size: 12px;
}
.chart-frame {
  display: flex;
  gap: 8px;
  margin: 18px 24px 0;
}
.chart-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 132px;
  padding-top: 12px;
  color: #6b7280;
  font-size: 10px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.chart-frame .bar-chart {
  position: relative;
  flex: 1;
  min-width: 0;
  margin: 0;
}
.chart-grid {
  position: absolute;
  inset: 18px 0 0;
  border-top: 1px solid #e5e7eb;
  pointer-events: none;
}
.chart-grid::after {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  border-top: 1px solid #e5e7eb;
  content: "";
}
.bar-column {
  position: relative;
}
.chart-caption {
  margin: 29px 24px 20px;
  color: #9ca3af;
  font-size: 10px;
}
.chart-caption i {
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 5px;
  border-radius: 50%;
  background: #3b82f6;
}
.chart-caption span {
  margin: 0 5px;
}
.clients-panel {
  padding-bottom: 8px;
}
.client-list {
  margin: 15px 24px 0;
}
.client-list li {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 49px;
  border-bottom: 1px solid #f3f4f6;
}
.client-list li:last-child {
  border-bottom: 0;
}
.client-list a {
  flex: 1;
  overflow: hidden;
  color: #374151;
  font-size: 12px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.client-list a:hover {
  color: #4338ca;
  text-decoration: underline;
}
.client-count {
  color: #6b7280;
  font-size: 11px;
  white-space: nowrap;
}
.client-arrow {
  color: #818cf8;
  font-size: 12px;
}
.client-empty {
  padding: 32px 24px;
  color: #9ca3af;
  font-size: 12px;
}
.queue-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin: 20px 24px 0;
}
.queue-controls .queue-tabs {
  margin: 0;
}
.queue-search {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  width: 200px;
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #6b7280;
}
.queue-search:focus-within {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
.queue-search svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.queue-search input {
  width: 100%;
  min-width: 0;
  border: 0;
  background: transparent;
  color: #1f2937;
  font-size: 12px;
  outline: none;
}
.queue-header,
.task-row {
  display: grid;
  grid-template-columns: 28px minmax(100px, 1.15fr) minmax(80px, 0.85fr) 100px 76px;
  align-items: center;
  gap: 10px;
}
.queue-header {
  margin: 16px 24px 0;
  padding: 9px 10px;
  border-radius: 6px;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}
.task-list {
  margin-top: 0;
}
.task-row {
  padding: 0 10px;
}
.task-client {
  margin: 0;
}
.task-date {
  min-width: 0;
  text-align: left;
}
.task-date strong {
  margin: 0;
}
.complete-button {
  justify-self: end;
}
.row-arrow {
  justify-self: end;
}
.action-message {
  padding: 10px 24px 0;
  color: #047857;
  font-size: 12px;
}
.clear-search {
  color: #4338ca;
  font-size: 12px;
  font-weight: 600;
  text-decoration: underline;
}
@media (max-width: 760px) {
  .focus-panel {
    grid-template-columns: 1fr auto;
    gap: 14px;
    padding: 17px;
  }
  .focus-kicker {
    grid-column: 1;
    align-self: auto;
  }
  .focus-task {
    grid-column: 1 / -1;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px;
  }
  .focus-number {
    display: none;
  }
  .focus-actions {
    grid-column: 1 / -1;
    margin-top: 2px;
  }
  .focus-stats {
    grid-column: 2;
    grid-row: 1;
    align-self: auto;
    margin: 0;
    border-left: 0;
  }
  .focus-stats div {
    min-width: 54px;
    padding-left: 12px;
  }
  .focus-empty {
    grid-column: 1 / -1;
  }
}
@media (max-width: 600px) {
  .queue-controls {
    align-items: stretch;
    margin: 18px 16px 0;
  }
  .queue-search {
    width: 100%;
  }
  .queue-header {
    display: none;
  }
  .task-row {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 4px 10px;
    padding: 13px 0;
  }
  .task-index {
    display: none;
  }
  .task-main {
    grid-column: 1;
  }
  .task-client {
    grid-column: 1;
    grid-row: 2;
  }
  .task-date {
    grid-column: 1;
    grid-row: 3;
  }
  .task-date strong {
    margin: 0;
  }
  .complete-button,
  .row-arrow {
    grid-column: 2;
    grid-row: 1 / span 3;
  }
  .queue-tabs {
    margin: 0;
  }
}
@media (max-width: 1100px) {
  .workspace-grid {
    grid-template-columns: 1fr;
  }
  .side-column {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 740px) {
  .dashboard {
    padding: 24px 16px 40px;
  }
  .page-heading {
    align-items: flex-start;
    flex-direction: column;
  }
  .heading-actions {
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
  }
  .summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .side-column {
    grid-template-columns: 1fr;
  }
  .task-date {
    min-width: 72px;
  }
  .task-row {
    gap: 10px;
  }
}
@media (max-width: 440px) {
  .panel-heading {
    padding: 20px 16px 0;
  }
  .task-list {
    margin-left: 16px;
    margin-right: 16px;
  }
  .panel-footer {
    padding: 16px;
  }
  .panel-footer span {
    display: none;
  }
  .task-index {
    display: none;
  }
  .task-date span {
    display: none;
  }
  .task-date strong {
    font-size: 10px;
  }
  .summary {
    gap: 10px;
  }
  .summary-item {
    padding: 15px;
    min-height: 120px;
  }
  .summary-item strong {
    font-size: 22px;
  }
  .summary-item strong.hours-value {
    font-size: 18px;
  }
  .metric-icon {
    top: 14px;
    right: 14px;
    width: 32px;
    height: 32px;
  }
  .metric-icon svg {
    width: 17px;
    height: 17px;
  }
  .chart-total {
    margin-left: 16px;
  }
  .chart-frame {
    margin-left: 16px;
    margin-right: 16px;
  }
  .bar-label {
    font-size: 9px;
  }
}
</style>
