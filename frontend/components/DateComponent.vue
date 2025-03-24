<template>
  <div class="date-picker">
    <input type="date" v-model="localEndDate" />
    <input type="date" v-model="localStartDate" />

    <div>
      <button class="btn-click" @click="handleButtonClick">Click!</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      localStartDate: this.startDate,
      localEndDate: this.endDate,
    };
  },
  watch: {
    // Следим за изменениями пропсов и обновляем локальные данные
    startDate(newVal) {
      this.localStartDate = newVal;
    },
    endDate(newVal) {
      this.localEndDate = newVal;
    },
  },
  methods: {
    handleButtonClick() {
      // Эмитим событие с новыми датами
      this.$emit('date-selected', {
        startDate: this.localStartDate,
        endDate: this.localEndDate,
      });
    },
  },
};
</script>

<style scoped>
.date-picker {
  margin-bottom: 20px;
}
.btn-click {
  margin-top: 10px;
  position: relative;
  padding: 12px 24px;
  font-size: 16px;
  color: #fff;
  background: linear-gradient(45deg, #6c757d, #495057);
  border: none;
  cursor: pointer;
  overflow: hidden;
  outline: none;
  transition: all 0.4s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.btn-click::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300%;
  height: 300%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0) 70%);
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.5s ease;
  border-radius: 50%;
}
.btn-click:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}
.btn-click:active {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.btn-click:hover::before {
  transform: translate(-50%, -50%) scale(1);
}
.btn-click:active::before {
  transform: translate(-50%, -50%) scale(0);
}
</style>