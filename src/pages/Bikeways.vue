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
            <li 
            v-for="bikeway in pageBikeways" 
            :key="bikeway.RouteName"
            @click="selectedBikeway(bikeway.RouteName)"
            :class="{ curBikeway:  bikeway.RouteName == bikewayName}"
            >
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
      <div class="page" v-if="pageBikeways">
        <button @click="goto(-1)">
          <i class="fas fa-chevron-left"></i>
        </button>
        <div class="page__numbers">
          <span>{{ curPage }}</span>
          <span> / </span>
          <span>{{ numPages }}</span>
        </div>
        <button @click="goto(1)">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, watch } from 'vue'
import { API_URL, RES_PER_PAGE } from '../config.js'
import getAuthorizationHeader from '../helpers.js'
import SearchFilter from '../compontets/SearchFilter.vue'
export default {
  components: {
    SearchFilter
  },
  setup() {
    const bikeways = ref(null)
    const bikewayName = ref(null)
    const keyword = ref(null)
    const city = ref(null)
    const curPage = ref(null)
    const numPages = ref(null)
    const pageBikeways = ref(null)
    const isSearch = ref(false)
    const isLoading = ref(false)


    /* 搜尋開始 */
    async function goSearch() {
      isSearch.value = true

      if(keyword.value) {
        await getBikeways()
        bikeways.value = bikeways.value.filter((item) => item.RouteName.indexOf(keyword.value) > -1)
      }else {
        await getBikeways()
      }

      initPageResults()
    }

    function updatedFilters(val) {
      keyword.value = val.keyword
      city.value = val.city

      goSearch()
    }
    /* 搜尋結束 */


    /* 抓取頁數開始 */
    function goto(val) {
      curPage.value += val

      if(curPage.value < 1) {
        curPage.value = 1
      }else if(curPage.value > numPages.value) {
        curPage.value = numPages.value
      }
    }

    function setPageResults(page) {
      // page(1)抓取 0 - 7 的陣列項目 | page(2)抓取 8 - 15 的陣列項目
      const start = (page - 1) * RES_PER_PAGE
      const end = page * RES_PER_PAGE
      pageBikeways.value = bikeways.value.slice(start, end)
    }

    function initPageResults() {
      if(!bikeways.value) return

      curPage.value = 1
      numPages.value = Math.ceil(bikeways.value.length / RES_PER_PAGE)
      setPageResults(1)
    }

    watch(curPage, ()=> setPageResults(curPage.value))
    /* 抓取頁數結束 */


    /* 選擇站點開始 */
    function selectedBikeway(name) {
      let bikeway = pageBikeways.value.find((bikeway) => bikeway.RouteName == name)
      bikewayName.value = bikeway.RouteName
    } 
    /* 選擇站點結束 */


    /* 取得單車資料開始 */
    async function getBikeways() {
      bikeways.value = null
      pageBikeways.value = null
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
      } catch (e) {
        console.error(e)
      }
      isLoading.value = false
    }
    /* 取得單車資料結束 */

    return {
      bikeways,
      bikewayName,
      pageBikeways,
      curPage,
      numPages,
      isSearch,
      isLoading,
      updatedFilters,
      goto,
      selectedBikeway
    }
  }
}
</script>