<template>
  <section class="search">
    <div class="block"></div>
    <div class="filter"> 
      <div class="title">
        <slot name="header">
          <h1>{{ title }}</h1>
        </slot>
        <div class="title__select" @click="handleFilter">
          <img src="@/assets/img/Union.png" v-if="!isFilter">
          <img src="@/assets/img/Union2.png" v-if="isFilter">
        </div>
      </div>
      <div class="filter__wrap" v-if="isFilter">
        <div class="keyword">
          <img class="keyword--iconSearch" src="@/assets/img/Search.png">
          <input type="text" placeholder="請輸入關鍵字" v-model="keyword">
          <img class="keyword--iconCancle" src="@/assets/img/Cancle.png" @click="celarKeyword">
        </div>
        <div class="btns">
          <div class="select">
            <button @click="handleCities">
              <img src="@/assets/img/Union.png" v-if="!isOpen">
              <img src="@/assets/img/Union2.png" v-if="isOpen">
              <span>{{ selectText ? selectText.name : '縣市' }}</span>
            </button>
            <div class="select__list" v-if="isOpen">
              <!-- <h2 class="select__list--title">北部</h2> -->
              <ul>
                <li v-for="city in cityData" :key="city.id">
                  <input type="radio" name="city" :id="city.id" :value="city.id" v-model="selectedCity">
                  <label :for="city.id" :class="{ selectCity : selectedCity == city.id }">{{ city.name }}</label>
                </li>
              </ul>
            </div>
          </div>
          <button class="btn btn-1" @click="submitFilter">搜尋</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, computed, watch } from 'vue'
import CITYDATA from '../city-data.js'
export default {
  props: ['title'],
  emits: ['update-filter'],
  setup(_,context) {
    const cityData = CITYDATA
    const keyword = ref(null)
    const selectedCity = ref(null)
    const isFilter = ref(false)
    const isOpen = ref(false)

    const selectText = computed(() => cityData.find((item) => item.id == selectedCity.value))

    function handleFilter() {
      isFilter.value = ! isFilter.value
    }

    function handleCities() {
      isOpen.value = ! isOpen.value
    }

    function celarKeyword () {
      keyword.value = null
    }

    function submitFilter() {
      if(!selectedCity.value) {
        alert('請選擇城市進行篩選')
        return 
      }

      const updatedFilter = {
        keyword: keyword.value,
        city: selectedCity.value,
      }

      celarKeyword()
      context.emit('update-filter', updatedFilter)
    }

    watch(selectedCity, () => isOpen.value = false)

    return { 
      cityData,
      keyword, 
      selectedCity,
      isOpen,
      isFilter,
      selectText,
      celarKeyword,
      handleFilter,
      handleCities,
      submitFilter
    }
  }
}
</script>