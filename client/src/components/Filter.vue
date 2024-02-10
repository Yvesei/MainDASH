<template>
  <div v-if="showPopup" class="filter-overlay" @click.self="closePopup">
    <form
      ref="dialog"
      class="filter-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-title"
      @keydown.esc.stop.prevent="closePopup"
      @keydown.tab="trapFocus"
      @submit.prevent="applyFilter"
    >
      <div class="filter-heading">
        <div>
          <h2 id="filter-title">Filter by date</h2>
          <p>Choose a start date, an end date, or both.</p>
        </div>
        <button
          type="button"
          class="filter-close"
          aria-label="Close"
          @click="closePopup"
        >
          ×
        </button>
      </div>
      <div class="filter-fields">
        <label
          >From
          <input
            ref="startField"
            v-model="start"
            name="start-date"
            type="date"
            :max="finish || undefined"
            :aria-invalid="error ? 'true' : undefined"
            :aria-describedby="error ? 'filter-error' : undefined"
            @input="error = ''"
        /></label>
        <label
          >To
          <input
            ref="endField"
            v-model="finish"
            name="end-date"
            type="date"
            :min="start || undefined"
            :aria-invalid="error ? 'true' : undefined"
            :aria-describedby="error ? 'filter-error' : undefined"
            @input="error = ''"
        /></label>
      </div>
      <p v-if="error" id="filter-error" class="filter-error" role="alert">
        {{ error }}
      </p>
      <div class="filter-actions">
        <button type="button" @click="closePopup">Cancel</button
        ><button class="filter-apply" type="submit">Apply dates</button>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  props: { showPopup: Boolean, dates: { type: Array, default: null } },
  emits: ["close", "task-filter"],
  data() {
    return { start: "", finish: "", error: "", previousFocus: null };
  },
  watch: {
    showPopup(open) {
      if (open) {
        this.previousFocus = document.activeElement;
        this.start =
          this.dates?.[0] === "2012-12-12" ? "" : this.dates?.[0] || "";
        this.finish =
          this.dates?.[1] === "2999-12-12" ? "" : this.dates?.[1] || "";
        this.error = "";
        // Focus the dialog rather than opening the date picker on touch devices.
        this.$nextTick(() =>
          this.$refs.dialog?.querySelector("button")?.focus()
        );
      }
    },
  },
  methods: {
    applyFilter() {
      if (!this.start && !this.finish) {
        this.error = "Choose at least one date.";
        this.$refs.startField?.focus();
        return;
      }
      if (this.start && this.finish && this.start > this.finish) {
        this.error = "The start date must be before the end date.";
        this.$refs.endField?.focus();
        return;
      }
      this.$emit("task-filter", [this.start, this.finish]);
      this.closePopup();
    },
    trapFocus(event) {
      const focusable = [
        ...this.$refs.dialog.querySelectorAll(
          "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]"
        ),
      ];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    closePopup() {
      this.$emit("close");
      this.$nextTick(() => this.previousFocus?.focus());
    },
  },
};
</script>
<style scoped>
.filter-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: rgba(25, 41, 33, 0.52);
}
.filter-dialog {
  width: min(100%, 480px);
  padding: 26px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}
.filter-heading {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
.filter-heading h2 {
  color: #1f2937;
  font-weight: 700;
  font-size: 20px;
}
.filter-heading p {
  margin-top: 5px;
  color: #6b7280;
  font-size: 13px;
}
.filter-close {
  color: #6b7280;
  font-size: 26px;
  line-height: 1;
}
.filter-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 24px;
}
.filter-fields label {
  display: grid;
  gap: 7px;
  color: #526159;
  font-size: 13px;
  font-weight: 600;
}
.filter-fields input {
  min-width: 0;
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px;
  color: #1f2937;
}
.filter-error {
  color: #b91c1c;
  font-size: 13px;
  margin-top: 12px;
}
.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
  font-size: 14px;
  font-weight: 600;
}
.filter-actions button {
  padding: 10px 15px;
  border-radius: 8px;
  color: #526159;
}
.filter-actions .filter-apply {
  background: #4338ca;
  color: #fff;
}
@media (max-width: 430px) {
  .filter-fields {
    grid-template-columns: 1fr;
  }
}
</style>
