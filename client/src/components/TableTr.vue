<template>
  <tr :class="{ 'archived-row': task.deleted }">
    <td class="select-cell">
      <input
        type="checkbox"
        :checked="selected"
        :disabled="!!task.status || !!task.deleted"
        :aria-label="`Select task for ${client?.name || 'client'}`"
        @change="$emit('select', task.id)"
      />
    </td>
    <td>
      <div class="client-cell">
        <img :src="imageUrl('tasks', client && client.image)" alt="" />
        <div>
          <strong>{{ client?.name || "Unknown client" }}</strong
          ><span>{{ task.type || "Maintenance" }}</span>
        </div>
      </div>
    </td>
    <td v-if="currentUserRole === 'ADMIN'">
      <span>{{ owner.name || "Unknown user" }}</span>
    </td>
    <td class="nowrap">{{ formatDate(task.Date) }}</td>
    <td class="nowrap">
      {{ task.dateStart || "—"
      }}<span v-if="task.dateEnd"> – {{ task.dateEnd }}</span>
    </td>
    <td>
      <span class="status" :class="task.status ? 'done' : 'pending'">{{
        task.status ? "Done" : "Pending"
      }}</span
      ><span v-if="task.deleted" class="archived-label">Archived</span>
    </td>
    <td>
      <div class="actions">
        <button
          type="button"
          :aria-label="
            task.deleted || (currentUserRole === 'USER' && task.status)
              ? 'View task'
              : 'Edit task'
          "
          :title="
            task.deleted || (currentUserRole === 'USER' && task.status)
              ? 'View task'
              : 'Edit task'
          "
          @click="editpopup = true"
        >
          <svg
            v-if="task.deleted || (currentUserRole === 'USER' && task.status)"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
            />
            <circle cx="12" cy="12" r="2.5" /></svg
          ><svg
            v-else
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              d="m14.5 5.5 4 4M4 20l4.5-.8L20 7.7a2.8 2.8 0 0 0-4-4L4.8 15.5 4 20Z"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <button
          v-if="!task.status && !task.deleted"
          type="button"
          :disabled="busy"
          aria-label="Mark task done"
          title="Mark done"
          @click="makeDone"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path
              d="m7.5 12 3 3 6-6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <button
          v-if="currentUserRole === 'ADMIN'"
          type="button"
          :disabled="busy"
          :aria-label="task.deleted ? 'Restore task' : 'Archive task'"
          :title="task.deleted ? 'Restore task' : 'Archive task'"
          @click="deleteTask"
        >
          <svg
            v-if="task.deleted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              d="M4 10a8 8 0 1 1 2 7M4 4v6h6"
              stroke-linecap="round"
              stroke-linejoin="round"
            /></svg
          ><svg
            v-else
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              d="M4 7h16M9 7V4h6v3m-9 0 1 13h10l1-13M10 11v5m4-5v5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
      <p v-if="error" role="alert" class="action-error">{{ error }}</p>
    </td>
  </tr>
  <Teleport to="body"
    ><edit-task-popup
      v-if="editpopup"
      :task="task"
      :show-popup="editpopup"
      @close="closePopup"
      @task-updated="$emit('task-deleted')"
  /></Teleport>
</template>
<script>
import axios from "axios";
import editTaskPopup from "./editTaskPopup.vue";
export default {
  name: "TableTr",
  components: { editTaskPopup },
  props: {
    task: { type: Object, required: true },
    currentUserRole: { type: String, default: "" },
    currentUserId: { type: Number, default: null },
    clients: { type: Array, default: () => [] },
    users: { type: Array, default: () => [] },
    selected: Boolean,
    openRequest: Boolean,
  },
  emits: ["task-deleted", "task-closed", "select"],
  data() {
    return { editpopup: false, user: {}, busy: false, error: "" };
  },
  computed: {
    client() {
      return this.clients.find((client) => client.id === this.task.clientId);
    },
    owner() {
      return (
        this.users.find((user) => user.id === this.task.createdBy) || this.user
      );
    },
  },
  watch: {
    openRequest(value) {
      if (value) this.editpopup = true;
    },
  },
  mounted() {
    if (this.openRequest) this.editpopup = true;
    if (
      this.currentUserRole === "ADMIN" &&
      this.task.createdBy &&
      !this.users.some((user) => user.id === this.task.createdBy)
    )
      this.fetchCreatedBy();
  },
  methods: {
    closePopup() {
      this.editpopup = false;
      this.$emit("task-closed");
    },
    async deleteTask() {
      this.error = "";
      this.busy = true;
      try {
        await axios.delete(`tasks/${this.task.id}`);
        this.$emit("task-deleted", {
          id: this.task.id,
          archived: !this.task.deleted,
        });
      } catch (error) {
        this.error = error.response?.data?.error || "Could not update task.";
      } finally {
        this.busy = false;
      }
    },
    async makeDone() {
      this.error = "";
      this.busy = true;
      try {
        await axios.patch("/tasks/markDone", { idArray: this.task.id });
        this.$emit("task-deleted");
      } catch (error) {
        this.error = error.response?.data?.error || "Could not complete task.";
      } finally {
        this.busy = false;
      }
    },
    async fetchCreatedBy() {
      try {
        this.user =
          (await axios.get(`users/${this.task.createdBy}`)).data || {};
      } catch (error) {
        console.error("Could not load task owner", error);
      }
    },
    imageUrl(folder, name) {
      return `${axios.defaults.baseURL.replace(
        /\/$/,
        ""
      )}/uploads/${folder}/${encodeURIComponent(name || "avatar.png")}`;
    },
    formatDate(value) {
      if (!value) return "—";
      const [year, month, day] = value.split("-");
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      return Number.isNaN(date.getTime())
        ? value
        : new Intl.DateTimeFormat(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(date);
    },
  },
};
</script>
<style scoped>
tr {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.15s;
}
tr:hover {
  background: #f9fafb;
}
td {
  padding: 14px 16px;
  color: #4b5563;
  font-size: 13px;
  vertical-align: middle;
}
.select-cell {
  padding-right: 0;
}
input[type="checkbox"] {
  accent-color: #4f46e5;
}
input:disabled {
  opacity: 0.35;
}
.client-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 190px;
}
.client-cell img {
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 50%;
  background: #f3f4f6;
}
.client-cell strong,
.client-cell span {
  display: block;
}
.client-cell strong {
  color: #374151;
  font-weight: 600;
}
.client-cell span {
  margin-top: 3px;
  color: #9ca3af;
  font-size: 12px;
}
.nowrap {
  white-space: nowrap;
}
.status {
  display: inline-block;
  padding: 5px 11px;
  border-radius: 999px;
  background: #e9d5ff;
  color: #9333ea;
  font-size: 12px;
  font-weight: 600;
}
.status.done {
  background: #bfdbfe;
  color: #2563eb;
}
.archived-row {
  background: #fee2e2;
}
.archived-label {
  display: block;
  color: #b91c1c;
  margin-top: 4px;
  font-size: 11px;
}
.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.actions button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  color: #6b7280;
}
.actions button:hover {
  color: #4f46e5;
  background: #eef2ff;
}
.actions button:disabled {
  opacity: 0.5;
}
.actions svg {
  width: 17px;
  height: 17px;
}
.action-error {
  max-width: 180px;
  margin: 6px auto 0;
  color: #b91c1c;
  text-align: center;
  font-size: 11px;
}
</style>
