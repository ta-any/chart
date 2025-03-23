<template>
  <div>
    <h2>График цен</h2>
    <div v-if="loading" class="loading">Загрузка данных...</div>
    <div v-else>
      <div v-if="nodata" class="nodata">
        <div class="red">Нет Данных</div>
        <ChartComponent :price-data="priceData" />
        <DateComponent @date-selected="fetchData" />
      </div>
      <div v-else>
        <ChartComponent :price-data="priceData" />
        <DateComponent @date-selected="fetchData" />
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
      nodata: null
    };
  },
  mounted() {
    let week = new Date();
    week.setDate(week.getDate() - 7);

    console.log('week', week.toISOString().split('T')[0]);
    let startDate = new Date().toISOString().split('T')[0];
    let endDate = week.toISOString().split('T')[0]

    this.fetchData({ startDate, endDate });
  },
  methods: {
    async fetchData({ startDate, endDate }) {
      if (this.loading) return;
      this.loading = true;
      this.error = null;
      this.nodata = null;

      try {
        const response = await fetch(
            `http://localhost:3030/api/interval?startDate=${startDate}&endDate=${endDate}`
        );
        const data = await response.json();
        console.log("DATA API: ", data)

        if(data.error !== 'Данные не найдены'){
          this.priceData = data.map((item) => ({
            date: item.data.split('T')[0],
            price: item.price,
          }));
        } else {
          this.nodata = true
        }

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