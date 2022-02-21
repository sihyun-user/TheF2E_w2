import { createStore } from 'vuex'
import { API_URL } from '../config'
import getAuthorizationHeader from '../helpers.js'
import createPersistedState from "vuex-persistedstate"

const store = createStore({
  plugins: [createPersistedState()],
  state() {
    return {}
  },
  mutations: {},
  actions: {
    // 取得景點資料
    async getScenicSpot (context, city) {
      try {
        const API = `${API_URL}/Tourism/ScenicSpot/${city}?$format=JSON`
        const response = await fetch(API, {
          headers: getAuthorizationHeader()
        })

        const responseData = await response.json()

        if(!response.ok) {
          const error = new Error(responseData.message || '取得觀光資料失敗')
          throw error
        }

        let scenicSpotData = []

        responseData.forEach(el => {
          let data = {
            id: el.ScenicSpotID,
            name: el.ScenicSpotName,
            description: el.DescriptionDetail,
            latlng: {
              lat: el.Position.PositionLat,
              lng: el.Position.PositionLon
            }
          }

          scenicSpotData.push(data)
        })

        return scenicSpotData

      } catch (e) {
        console.error(e)
      }
    },
    // 取得餐廳資料
    async getRestaurant (context, city) {
      try {
        const API = `${API_URL}/Tourism/Restaurant/${city}?$format=JSON`
        const response = await fetch(API, {
          headers: getAuthorizationHeader()
        })

        const responseData = await response.json()

        if(!response.ok) {
          const error = new Error(responseData.message || '取得美食資料失敗')
          throw error
        }

        let restaurantData = []

        responseData.forEach(el => {
          let data = {
            id: el.RestaurantID,
            name: el.RestaurantName,
            latlng: {
              lat: el.Position.PositionLat,
              lng: el.Position.PositionLon
            }
          }

          restaurantData.push(data)
        })

        return restaurantData
      } catch (e) {
        console.error(e)
      }
    },
    // 取得車道資料
    async getBikeways (context, city) {
      try {
        const API = `${API_URL}/Cycling/Shape/${city}?$format=JSON`

        const response = await fetch(API, {
          headers: getAuthorizationHeader()
        })

        const responseData = await response.json()

        if(!response.ok) {
          const error = new Error(responseData.message || '取得車道資料失敗')
          throw error
        }

        return responseData
      } catch (e) {
        console.error(e)
      }
    },
    // 取得單車站點資料
    async getStationsData(context, city) {
      const API = `${API_URL}/Bike/Station/${city}?$format=JSON`

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
          latlng: {
            lat: el.StationPosition.PositionLat,
            lng: el.StationPosition.PositionLon
          }
        }

        data.push(stationData)
      })

      return data
    },
    // 取得單車站點即時資料
    async getAvailabilityData(context, city) {
      const API = `${API_URL}/Bike/Availability/${city}?$format=JSON` 

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

      return data
    },
    // 取得座標附近景點資料
    async getNearTourism (context, {latlng, city}) {
      const NEAR_BY = `$spatialFilter=nearby(${latlng.lat},${latlng.lng},1000)`

      try {
        const API = `${API_URL}/Tourism/ScenicSpot/${city}?$top=30&${NEAR_BY}&$format=JSON`
        const response = await fetch(API, {
          headers: getAuthorizationHeader()
        })

        const responseData = await response.json()

        if(!response.ok) {
          const error = new Error(responseData.message || '取得觀光資料失敗')
          throw error
        }

        let tourismData = []

        responseData.forEach(el => {
          let data = {
            id: el.ID,
            name: el.Name,
            latlng: {
              lat: el.Position.PositionLat,
              lng: el.Position.PositionLon
            }
          }
          tourismData.push(data)
        })

        return tourismData
      } catch (e) {
        console.error(e)
      }
    }
  },
  getters: {}
})

export default store