<template>
  <div>
    <h2>График цен</h2>
    <div v-if="loading" class="loading">Загрузка данных...</div>
    <div v-else>
      <div v-if="nodata" class="nodata">
        <div class="red">Нет Данных</div>
        <ChartComponent :price-data="priceData" />
        <DateComponent
            :start-date="selectedDateStart"
            :end-date="selectedDateEnd"
            @date-selected="fetchData"
        />
      </div>
      <div v-else>
        <ChartComponent :price-data="priceData" />
        <DateComponent
            :start-date="selectedDateStart"
            :end-date="selectedDateEnd"
            @date-selected="fetchData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DateComponent from '~/components/DateComponent.vue';
import ChartComponent from '~/components/ChartComponent.vue';

export default {
  components: {
    DateComponent,
    ChartComponent,
  },
  data() {
    return {
      priceData: [],
      loading: false,
      error: null,
      nodata: null,
      selectedDateStart: new Date().toISOString().split('T')[0], // Начальная дата по умолчанию
      selectedDateEnd: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0], // Конечная дата по умолчанию
    };
  },
  mounted() {
    this.fetchData({ startDate: this.selectedDateStart, endDate: this.selectedDateEnd });
  },
  methods: {
    checkDates(dateStr1, dateStr2) {
      console.log('Start format')
      // Преобразуем строки в объекты Date
      const date1 = new Date(dateStr1);
      const date2 = new Date(dateStr2);

      // Функция для форматирования даты в строку 'YYYY-MM-DD'
      function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }

      // Функция для добавления или вычитания дней из даты
      function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      }

      // Приводим даты к формату 'YYYY-MM-DD' для сравнения
      const formattedDate1 = formatDate(date1);
      const formattedDate2 = formatDate(date2);

      // Проверяем, являются ли даты одинаковыми, вчерашними или завтрашними
      if (formattedDate1 === formattedDate2) {
        return [`${formatDate(addDays(date1, 1))}`, `${formatDate(addDays(date1, -1))}` ]

      } else if (formattedDate1 === formatDate(addDays(date2, 1)) || formattedDate1 === formatDate(addDays(date1, -1))) {
        return [formatDate(addDays(date2, 2)), formatDate(addDays(date1, 2))]

      } else {
        return [formattedDate1, formattedDate2];
      }
    },
    async fetchData({ startDate, endDate }) {
      if (this.loading) return;
      this.loading = true;
      this.error = null;
      this.nodata = null;

      const [newstartDate, newendDate] = this.checkDates(startDate, endDate)
      console.log("DATA NEW FORMAT: ", newstartDate, newendDate)

      try {
        const response = await fetch(
            `http://localhost:3030/api/interval?startDate=${newstartDate}&endDate=${newendDate}`
        );
        const data = await response.json();
        console.log("DATA API: ", data);

        if (data.error !== 'Данные не найдены') {
          this.priceData = data.map((item) => ({
            date: item.data.split('T')[0],
            price: item.price,
          }));
        } else {
          this.nodata = true;
        }

        // Обновляем выбранные даты в состоянии родительского компонента
        this.selectedDateStart = startDate;
        this.selectedDateEnd = endDate;

      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        this.error = 'Не удалось загрузить данные. Попробуйте ещё раз.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.red {
  width: 100px;
  color: darkred;
  margin: 10px auto;
}
</style>