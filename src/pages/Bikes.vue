<template>
  <section class="bikes">
    <search-filter title="尋找單車" @update-filter="updatedFilters"></search-filter>
    <div class="aside" v-if="isSearch">
      <div class="aside__block"></div>
      <div class="aside__wrap"></div>
      <div class="results">
        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <div v-else>
          <ul>
            <li v-for="bike in bikes" :key="bike.uid">
              <h1 class="results__title">{{ bike.name }}</h1>
              <div class="results__address">
                <i class="fas fa-map-marker-alt"></i>
                <span v-if="bike.address">{{ bike.address }}</span>
                <span v-else>沒有標示地址</span>
              </div>
              <div class="results__btns">
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
    const stations = ref(null)
    const availability = ref(null)
    const bikes = ref(null)
    const keyword = ref(null)
    const city = ref(null)
    const isSearch = ref(false)
    const isLoading = ref(false)


    /* 搜尋開始 */
    async function goSearch() {
      isSearch.value = true

      if(keyword.value) {
        await getBikes()
        bikes.value = bikes.value.filter((item) => item.name.indexOf(keyword.value) > -1)
        console.log(bikes.value)
      }else {
        getBikes()
      }
    }

    function updatedFilters(val) {
      keyword.value = val.keyword
      city.value = val.city

      goSearch()
    }
    /* 搜尋結束 */

    /* 取得單車資料開始 */
    async function getStationsData() {
      const API = `${API_URL}/Bike/Station/${city.value}?$format=JSON`

      const response = await fetch(API, {
        headers: getAuthorizationHeader()
      })

      const responseData = await response.json()

      if(!response.ok) {
        const error = new Error(responseData.message || '取得單車站點資料失敗')
        throw error
      }

      let data = []
      responseData.forEach(el => {
        const stationData = {
          name: el.StationName.Zh_tw,
          uid: el.StationUID,
          address: el.StationAddress.Zh_tw,
          position: { 
            lat: el.StationPosition.PositionLat,
            lng: el.StationPosition.PositionLon
          }
        }

        data.push(stationData)
      })

      stations.value = data
    }

    async function getAvailabilityData() {
      const API = `${API_URL}/Bike/Availability/${city.value}?$format=JSON` 

      const response = await fetch(API, {
        headers: getAuthorizationHeader()
      })

      const responseData = await response.json()

      if(!response.ok) {
        const error = new Error(responseData.message || '取得單車站點即時資料失敗')
        throw error
      }


      let data = []
      responseData.forEach(el => {
        const availabilityData = {
          uid: el.StationUID,
          status: el.ServiceStatus,
          rent: el.AvailableRentBikes,
          return: el.AvailableReturnBikes,
          updateTime: el.UpdateTime
        }

        data.push(availabilityData)
      })

      availability.value = data
    }

    async function getBikes() {
      bikes.value = null
      isLoading.value = true
      try {
        await getStationsData()
        await getAvailabilityData()

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
      bikes,
      isSearch,
      isLoading,
      updatedFilters
    }
  }
}
</script>