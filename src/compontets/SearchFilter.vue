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
          <input type="text" placeholder="請輸入關鍵字">
          <img class="keyword--iconCancle" src="@/assets/img/Cancle.png">
        </div>
        <div class="btns">
          <div class="select">
            <button @click="handleShow">
              <img src="@/assets/img/Union.png" v-if="!isOpen">
              <img src="@/assets/img/Union2.png" v-if="isOpen">
              <span>{{ selectedCity ? selectedCity : '縣市' }}</span>
            </button>
            <div class="select__list" v-if="isOpen">
              <!-- <h2 class="select__list--title">北部</h2> -->
              <ul>
                <li v-for="city in cityData" :key="city.id">
                  <input type="radio" name="city" :id="city.id" :value="city.name" v-model="selectedCity">
                  <label :for="city.id" :class="{ selectCity : selectedCity == city.name }">{{ city.name }}</label>
                </li>
              </ul>
            </div>
          </div>
          <button class="btn btn-1">搜尋</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue'
import CITYDATA from '../city-data.js'
export default {
  props: ['title'],
  setup() {
    const cityData = CITYDATA
    const selectedCity = ref(null)
    const isFilter = ref(false)
    const isOpen = ref(false)

    function handleFilter() {
      isFilter.value = ! isFilter.value
    }


    function handleShow() {
      isOpen.value = ! isOpen.value
    }

    return { 
      cityData, 
      selectedCity,
      isOpen,
      isFilter,
      handleFilter,
      handleShow
    }
  }
}
</script>