<template>
  <section class="bikes">
    <search-filter title="尋找單車" @update-filter="updatedFilters" @is-filter="showFilter"></search-filter>
    <div class="aside" v-if="isSearch && isFilter">
      <div class="aside__block"></div>
      <div class="aside__wrap"></div>
      <div class="results">
        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <div v-else>
          <ul>
            <li 
            v-for="bike in pageBikes" 
            :key="bike.uid"
            @click="selectedBike(bike.uid)"
            :class="{ curBike: curBike == bike }"
            >
              <h1 class="results__title">{{ bike.name }}</h1>
              <div class="results__address">
                <i class="fas fa-map-marker-alt"></i>
                <span v-if="bike.address">{{ bike.address }}</span>
                <span v-else>沒有標示地址</span>
              </div>
              <div class="results__tags">
                <div class="results__status">
                  <button class="tag tag-blue" v-if="bike.status == '1'">正常營運</button>
                  <button class="tag tag-red" v-else-if="bike.status == '2'">暫停營運</button>
                  <button class="tag tag-gray" v-else>停止營運</button>
                </div>

                <div class="results__numbers" v-if="bike.status == '1'">
                  <button class="tag tag-blue" v-if="bike.rent > 0">尚有單車</button>
                  <button class="tag tag-red"  v-else>已無單車</button>
                  <button class="tag tag-gray" v-if="bike.rent!= 0  && bike.return == 0">車位已滿</button>
                </div>
              </div>
            </li>
          </ul>
          <p class="notBikes" v-if="!bikes || bikes.length == 0">這個城市沒有單車站點資料，請重新搜尋</p>
        </div>
      </div>
      <div class="page" v-if="pageBikes">
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
    <Map :bikes="bikes" :selected="curBike" :show-cur-bike="showCurBike"></Map>
  </section>
</template>

<script>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { RES_PER_PAGE } from '../config.js'
import SearchFilter from '../compontets/SearchFilter.vue'
import Map from '../compontets/Map.vue'
export default {
  components: {
    SearchFilter,
    Map
  },
  setup() {
    const store = useStore()
    const stations = ref(null)
    const availability = ref(null)
    const bikes = ref(null)
    const curBike = ref(null)
    const keyword = ref(null)
    const city = ref(0)
    const curPage = ref(null)
    const numPages = ref(null)
    const pageBikes = ref(null)
    const isSearch = ref(false)
    const isLoading = ref(false)
    const isFilter = ref(false)
    const showCurBike = ref(0)

    /* 展開搜尋吧開始 */
    function showFilter(val) {
      isFilter.value = val
    }
    /* 展開搜尋吧結束 */


    /* 搜尋開始 */
    async function goSearch() {
      isSearch.value = true

      if(keyword.value) {
        await getBikes()
        bikes.value = bikes.value.filter((item) => item.name.indexOf(keyword.value) > -1)
      }else {
        await getBikes()
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
      pageBikes.value = bikes.value.slice(start, end)
    }

    function initPageResults() {
      if(!bikes.value) return

      curPage.value = 1
      numPages.value = Math.ceil(bikes.value.length / RES_PER_PAGE)
      setPageResults(1)
    }

    watch(curPage, ()=> setPageResults(curPage.value))
    /* 抓取頁數結束 */


    /* 選擇站點開始 */
    function selectedBike(uid) {
      curBike.value = pageBikes.value.find((bike) => bike.uid == uid)
      showCurBike.value++
    } 
    /* 選擇站點結束 */
    

    /* 取得單車資料開始 */
    async function getBikes() {
      bikes.value = null
      pageBikes.value = null
      isLoading.value = true
      try {
        await store.dispatch('getStationsData', city.value).then((res) => {
          stations.value = res
        })
        await store.dispatch('getAvailabilityData', city.value).then((res) => {
          availability.value = res
        })

        let bikesData = []
        for(let item of stations.value)  {
          const temp = availability.value.filter(a => a.uid === item.uid)[0]
          bikesData.push({...item, ...temp})
        }

        bikes.value = bikesData
      } catch (e) { 
        console.error(e)
      }
      isLoading.value = false
    }
    /* 取得單車資料結束 */


    return {
      city,
      bikes,
      pageBikes,
      curPage,
      numPages,
      curBike,
      isSearch,
      isLoading,
      updatedFilters,
      goto,
      selectedBike,
      showFilter,
      isFilter,
      showCurBike
    }
  }
}
</script>