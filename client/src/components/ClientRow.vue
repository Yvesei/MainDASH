<template>
  <tr :class="{ 'hidden-client': client.deleted }" class="client-row">
    <td>
      <router-link
        class="client-name"
        :to="{ path: '/result', query: { client: client.id } }"
        ><img :src="getimg()" alt="" width="28" height="28" /><span
          ><strong>{{ client.name }}</strong
          ><small v-if="client.deleted">Archived</small></span
        ></router-link
      >
    </td>
    <td>
      <a v-if="phoneLink" :href="phoneLink" class="phone">{{ client.number }}</a
      ><span v-else>{{ client.number || "—" }}</span>
    </td>
    <td>{{ client.distance == null ? "—" : `${client.distance} km` }}</td>
    <td>
      <span class="work"
        >{{ client.taskCount }}
        {{ client.taskCount === 1 ? "task" : "tasks" }}</span
      ><small v-if="client.pendingCount" class="pending"
        >{{ client.pendingCount }} pending</small
      ><small v-else-if="client.taskCount" class="finished">All done</small>
    </td>
    <td>{{ formatDate(client.latestTaskDate) }}</td>
    <td>
      <div class="actions">
        <button
          class="action"
          :aria-label="`Edit ${client.name}`"
          title="Edit client"
          @click="popup = true"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
          >
            <path
              d="m14 5 5 5M4 20l4-.7L20 7a2 2 0 0 0-3-3L5 16l-1 4Z"
              stroke-linejoin="round"
            />
          </svg></button
        ><button
          v-if="isAdmin"
          class="action"
          :disabled="busy"
          :aria-label="`${client.deleted ? 'Restore' : 'Archive'} ${
            client.name
          }`"
          :title="client.deleted ? 'Restore client' : 'Archive client'"
          @click="toggleHidden"
        >
          <svg
            v-if="client.deleted"
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
          >
            <path
              d="M4 10a8 8 0 1 1 2 7M4 4v6h6"
              stroke-linecap="round"
              stroke-linejoin="round"
            /></svg
          ><svg
            v-else
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
          >
            <path
              d="M4 7h16M9 7V4h6v3m-9 0 1 13h10l1-13M10 11v5m4-5v5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
      <p v-if="error" class="row-error" role="alert">{{ error }}</p>
    </td>
  </tr>
  <Teleport to="body"
    ><EditClientPopup
      :show-popup="popup"
      :client="client"
      @close="popup = false"
      @client-updated="$emit('client-changed')"
  /></Teleport>
</template>
<script>
import axios from "axios";
import EditClientPopup from "./EditClientPopup.vue";
export default {
  components: { EditClientPopup },
  props: { client: { type: Object, required: true }, isAdmin: Boolean },
  emits: ["client-changed"],
  data() {
    return { popup: false, busy: false, error: "" };
  },
  computed: {
    phoneLink() {
      const number = String(this.client.number || "").replace(/[^\d+]/g, "");
      return /\d/.test(number) ? `tel:${number}` : "";
    },
  },
  methods: {
    getimg() {
      return `${axios.defaults.baseURL.replace(
        /\/$/,
        ""
      )}/uploads/tasks/${encodeURIComponent(
        this.client.image || "avatar.png"
      )}`;
    },
    formatDate(value) {
      if (!value) return "—";
      const date = new Date(value);
      return Number.isNaN(date.getTime())
        ? "—"
        : date.toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
    },
    async toggleHidden() {
      if (this.busy) return;
      this.busy = true;
      this.error = "";
      try {
        await axios.delete(`/clients/${this.client.id}`);
        this.$emit("client-changed", {
          id: this.client.id,
          name: this.client.name,
          archived: !this.client.deleted,
        });
      } catch (error) {
        this.error = error.response?.data?.error || "Could not update client.";
      } finally {
        this.busy = false;
      }
    },
  },
};
</script>
<style scoped>
.client-row {
  border-bottom: 1px solid #e5e7eb;
}
.client-row:last-child {
  border-bottom: 0;
}
.client-row:hover {
  background: #f9fafb;
}
.client-row td {
  padding: 14px 20px;
  color: #4b5563;
  font-size: 13px;
  white-space: nowrap;
}
.client-row td:not(:first-child) {
  text-align: center;
}
.client-name {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  max-width: 260px;
  color: #374151;
  text-align: left;
}
.client-name:hover strong {
  color: #4338ca;
  text-decoration: underline;
}
.client-name img {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 50%;
  object-fit: cover;
  background: #f3f4f6;
}
.client-name span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.client-name strong {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
}
.client-name small,
.pending,
.finished {
  display: block;
  margin-top: 4px;
  font-size: 11px;
}
.client-name small {
  color: #b45309;
}
.phone:hover {
  color: #4338ca;
  text-decoration: underline;
}
.work {
  display: inline-block;
  padding: 4px 9px;
  border-radius: 999px;
  background: #e9d5ff;
  color: #7e22ce;
  font-size: 12px;
  font-weight: 600;
}
.pending {
  color: #9333ea;
}
.finished {
  color: #6b7280;
}
.actions {
  display: flex;
  gap: 4px;
  justify-content: center;
}
.action {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  color: #6b7280;
}
.action:hover {
  color: #4338ca;
  background: #eef2ff;
}
.action:disabled {
  opacity: 0.5;
  cursor: wait;
}
.action svg {
  width: 17px;
  height: 17px;
}
.hidden-client {
  background: #fef2f2;
}
.row-error {
  margin-top: 6px;
  color: #b91c1c;
  font-size: 11px;
  white-space: normal;
}
</style>
