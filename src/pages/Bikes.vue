<template>
  <section class="bikes">
    <search-filter title="尋找單車"></search-filter>
    <div class="aside">
      <div class="aside__block"></div>
      <div class="aside__wrap"></div>
      <ul class="results">
        <li>
          <h1 class="results__title">iBike1.0_逢甲大學</h1>
          <div class="results__address">
            <i class="fas fa-map-marker-alt"></i>
            <span>台中市福星路/逢甲路口(潮洋機車停車場)</span>
          </div>
          <div class="results__btns">
            <button class="tag tag-blue">正常營運</button>
            <button class="tag tag-blue">尚有單車</button>
          </div>
        </li>
        <li>
          <h1 class="results__title">iBike1.0_逢甲大學</h1>
          <div class="results__address">
            <i class="fas fa-map-marker-alt"></i>
            <span>台中市福星路/逢甲路口(潮洋機車停車場)</span>
          </div>
          <div class="results__btns">
            <button class="tag tag-blue">正常營運</button>
            <button class="tag tag-blue">尚有單車</button>
          </div>
        </li>
        <li>
          <h1 class="results__title">iBike1.0_逢甲大學</h1>
          <div class="results__address">
            <i class="fas fa-map-marker-alt"></i>
            <span>台中市福星路/逢甲路口(潮洋機車停車場)</span>
          </div>
          <div class="results__btns">
            <button class="tag tag-blue">正常營運</button>
            <button class="tag tag-blue">尚有單車</button>
          </div>
        </li>
        <li>
          <h1 class="results__title">iBike1.0_逢甲大學</h1>
          <div class="results__address">
            <i class="fas fa-map-marker-alt"></i>
            <span>台中市福星路/逢甲路口(潮洋機車停車場)</span>
          </div>
          <div class="results__btns">
            <button class="tag tag-blue">正常營運</button>
            <button class="tag tag-blue">尚有單車</button>
          </div>
        </li>
        <li>
          <h1 class="results__title">iBike1.0_逢甲大學</h1>
          <div class="results__address">
            <i class="fas fa-map-marker-alt"></i>
            <span>台中市福星路/逢甲路口(潮洋機車停車場)</span>
          </div>
          <div class="results__btns">
            <button class="tag tag-blue">正常營運</button>
            <button class="tag tag-blue">尚有單車</button>
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