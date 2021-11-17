<template>
  <section class="bikeways">
    <search-filter title="尋找車道" @update-filter="updatedFilters"></search-filter>
    <div class="aside" v-if="isSearch">
      <div class="aside__block"></div>
      <div class="aside__wrap"></div>
      <div class="results">
        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <div v-else>
          <ul>
            <li v-for="bikeway in bikeways" :key="bikeway.RouteName">
              <h1 class="results__title">{{ bikeway.RouteName }}</h1>
              <div class="results__address">
                <i class="fas fa-map-marker-alt"></i>
                <span>{{ bikeway.City }} {{ bikeway.Town }}</span>
              </div>
              <div class="results__target">
                <div class="results__road">
                  <img src="@/assets/img/Road.png">
                  <span v-if="bikeway.Direction">{{ bikeway.Direction }}</span>
                  <span v-else>沒有標示方向</span>
                </div>
                <div class="results__length">
                  <img src="@/assets/img/Length.png">
                  <span v-if="bikeway.CyclingLength">
                    {{ bikeway.CyclingLength }}公尺
                  </span>
                  <span v-else>沒有標示長度</span>
                </div>
              </div>
              <div class="results__start">
                <h2>開始</h2>
                <span v-if="bikeway.RoadSectionStart">
                  {{ bikeway.RoadSectionStart }}
                </span>
                <span v-else>沒有標示開始路線</span>
              </div>
              <div class="results__end">
                <h2>結束</h2>
                <span v-if="bikeway.RoadSectionEnd">
                  {{ bikeway.RoadSectionEnd }}
                </span>
                <span v-else>沒有標示結束路線</span>
              </div>
            </li>
          </ul>
          <p class="notnotBikeways" v-if="!bikeways || bikeways.length == 0">這個城市沒有車道資料，請重新搜尋</p>
        </div>
      </div>
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
import { ref } from 'vue'
import { API_URL } from '../config.js'
import getAuthorizationHeader from '../helpers.js'
import SearchFilter from '../compontets/SearchFilter.vue'
export default {
  components: {
    SearchFilter
  },
  setup() {
    const bikeways = ref(null)
    const keyword = ref(null)
    const city = ref(null)
    const isSearch = ref(false)
    const isLoading = ref(false)


    /* 搜尋開始 */
    async function goSearch() {
      isSearch.value = true

      if(keyword.value) {
        await getBikeways()
        bikeways.value = bikeways.value.filter((item) => item.RouteName.indexOf(keyword.value) > -1)
      }else {
        getBikeways()
      }
    }

    function updatedFilters(val) {
      keyword.value = val.keyword
      city.value = val.city

      goSearch()
    }
    /* 搜尋結束 */

    /* 取得單車資料開始 */
    async function getBikeways() {
      isLoading.value = true
      try {
        const API = `${API_URL}/Cycling/Shape/${city.value}?$format=JSON`

        const response = await fetch(API, {
          headers: getAuthorizationHeader()
        })

        const responseData = await response.json()

        if(!response.ok) {
          const error = new Error(responseData.message || '取得車道資料失敗')
          throw error
        }

        bikeways.value = responseData
        console.log(bikeways.value)
      } catch (e) {
        console.error(e)
      }
      isLoading.value = false
    }
    /* 取得單車資料結束 */

    return {
      bikeways,
      isSearch,
      isLoading,
      updatedFilters
    }
  }
}
</script>