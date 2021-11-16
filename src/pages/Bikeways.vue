<template>
  <section class="bikeways">
    <search-filter title="尋找車道"></search-filter>
    <div class="aside">
      <div class="aside__block"></div>
      <div class="aside__wrap"></div>
      <ul class="results">
        <li>
          <h1 class="results__title">臺中市大安濱海自行車道</h1>
          <div class="results__address">
            <i class="fas fa-map-marker-alt"></i>
            <span>臺中市 大安區</span>
          </div>
          <div class="results__target">
            <div class="results__road">
              <img src="@/assets/img/Road.png">
              <span>雙向</span>
            </div>
            <div class="results__length">
              <img src="@/assets/img/Length.png">
              <span>26000公尺</span>
            </div>
          </div>
          <div class="results__start">
            <h2>開始</h2>
            <span>頂安海堤安心橋</span>
          </div>
          <div class="results__end">
            <h2>結束</h2>
            <span>台61縣西部濱海公路南下144公里</span>
          </div>
        </li>
      </ul>
      <div class="page">
        <button>
          <i class="fas fa-chevron-left"></i>
        </button>
        <div class="page__numbers">
          <span>1</span>
          <span> / </span>
          <span>5</span>
        </div>
        <button>
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import SearchFilter from '../compontets/SearchFilter.vue'
export default {
  components: {
    SearchFilter
  }
}
</script>