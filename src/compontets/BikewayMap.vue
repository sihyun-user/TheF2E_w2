<template>
  <div id="map" ref="divRef"></div>
  <div class="mapPopup2" ref="divPopupRef">
    <div class="mapPopup2__content" v-if="curBikeway">
      <h1 class="mapPopup2__title">{{ curBikeway.RouteName }}</h1>
      <div class="mapPopup2__address">
        <i class="fas fa-map-marker-alt"></i>
        <span>{{ curBikeway.City }} {{ curBikeway.Town }}</span>
      </div>
      <div class="mapPopup2__target">
        <div class="mapPopup2__road">
          <img src="@/assets/img/Road.png">
          <span v-if="curBikeway.Direction">{{ curBikeway.Direction }}</span>
          <span v-else>沒有標示方向</span>
        </div>
        <div class="mapPopup2__length">
          <img src="@/assets/img/Length.png">
          <span v-if="curBikeway.CyclingLength">
            {{ curBikeway.CyclingLength }}公尺
          </span>
          <span v-else>沒有標示長度</span>
        </div>
      </div>
      <div class="mapPopup2__start">
        <h2>開始</h2>
        <span v-if="curBikeway.RoadSectionStart">
          {{ curBikeway.RoadSectionStart }}
        </span>
        <span v-else>沒有標示開始路線</span>
      </div>
      <div class="mapPopup2__end">
        <h2>結束</h2>
        <span v-if="curBikeway.RoadSectionEnd">
          {{ curBikeway.RoadSectionEnd }}
        </span>
        <span v-else>沒有標示結束路線</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, toRefs, watch, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import Wkt from 'wicket'
import cityData from '../city-data'
export default {
  props:['bikeways', 'selected', 'showCurbikeway', 'city'],
  setup(props) {
    const store = useStore()
    const { bikeways, selected, showCurbikeway, city } = toRefs(props)
    const L = window.L
    const divRef = ref(null)
    const divPopupRef = ref(null)
    const map = ref(null)
    const layer = ref(null)
    const curBikeway = ref(null)
    const popupIsVisible = ref(false)
    const coords = ref([])
    const polyLineCenter = ref(null)
    const markIcon = ref(null)
    const markIcon2 = ref(null)
    const markers = ref([])
    const tourism = ref(null)

    const cityCenter = computed(() => cityData.find((item) => item.id == city.value).center)

    function getSelectedPopup() {
      curBikeway.value = selected.value
      const coord = coords.value.find((item) => selected.value.RouteName == item.bikeway.RouteName)
      map.value.fitBounds(coord.layer.getBounds())
      coord.eachFeatureLayer.openPopup()

      polyLineCenter.value = coord.layer.getBounds().getCenter()
      // getNearTourism(polyLineCenter.value)
    }

    watch(showCurbikeway, ()=> getSelectedPopup())

    function initMap() {
      map.value = L.map('map', { zoomAnimation:false }).setView([23.975, 120.973], 8)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map.value)

      markIcon.value = new L.Icon({
        iconUrl: require('../assets/img/L-scenicSpot.png'),
        iconSize: [48, 48],
        iconAnchor: [2, 2],
        popupAnchor: [24, 1],
      })

      markIcon2.value = new L.Icon({
        iconUrl: require('../assets/img/L-restaurant.png'),
        iconSize: [48, 48],
        iconAnchor: [2, 2],
        popupAnchor: [24, 1],
      })
    }

    function setPolyLine() {
      layer.value = null
      coords.value = []

      for(let i = 0; i < bikeways.value.length; i++) {
        const polyLineData = bikeways.value[i]
        ployLine(polyLineData.Geometry, polyLineData)
      }
    }

    function ployLine(geo, polyLineData) {
      const wicket = new Wkt.Wkt()
      const geojsonFeature = wicket.read(geo).toJson()
      let eachFeatureLayer
  
      const myStyle = {
        'color': '#C50047',
        'weight': 5,
        'opacity': 0.65
      }
  
      layer.value = L.geoJSON(geojsonFeature, {
        style: myStyle,
        onEachFeature: function onEachFeature(feature, layer) {
          eachFeatureLayer = layer
          layer
          .on('click', ()=> {
            curBikeway.value = polyLineData
          })
          .on('popupopen', (e)=> {
            popupIsVisible.value = true
            e.target.setStyle({color: "#0000FF"})
          })
          .on('popupclose', (e)=> {
            popupIsVisible.value = false
            e.target.setStyle({color: "#C50047"})
          })
          .bindPopup(
            L.popup({
              maxWidth: 350,
              className: 'mapPopup2'
            })
          )
          .setPopupContent(divPopupRef.value)
        }
      }).addTo(map.value)

      layer.value.addData(geojsonFeature)

      let coord = {
        layer: layer.value,
        bikeway: polyLineData,
        eachFeatureLayer: eachFeatureLayer
      }

      coords.value.push(coord)
    }

    function clearPolyLine() {
      map.value.eachLayer((layer) => {
        if(layer instanceof L.GeoJSON) {
          map.value.removeLayer(layer)
        }
      })
    }

    watch(bikeways, ()=> {
      if(bikeways.value) {
        clearPolyLine()
        clearMarker()
        setPolyLine()
        getTourism()
        map.value.setView([cityCenter.value.lat, cityCenter.value.lng], 12)
      }
    })

    /* 建立景點標誌開始 */
    async function getTourism() {
      store.dispatch('getScenicSpot', city.value).then((res) => {
        console.log(res)
        setMarker(res, 'scenicSpot')
      })
      store.dispatch('getRestaurant', city.value).then((res) => {
        setMarker(res, 'restaurant')
      })
    }

    function setMarker(data, type) {
      let iconStyle =  type == 'scenicSpot' ?  markIcon.value : markIcon2.value

      let marker

      marker = new L.MarkerClusterGroup({
        spiderfyOnMaxZoom: true,
        disableClusteringAtZoom: 18,
      })
      
      for(let i = 0; i < data.length; i++) {
        marker.addLayer(
          L.marker(data[i].latlng, { icon: iconStyle })
          .on('click', function () {
            tourism.value = data[i]
            console.log(tourism.value)
          })
          .bindPopup(
            L.popup({
              maxWidth: 350,
              className: 'mapPopup3'
            })
          )
          .setPopupContent(divPopupRef.value)
          .bindPopup(
            L.popup({
              maxWidth: 350,
              className: 'mapPopup3'
            })
          )
          .setPopupContent(`
            <div class="mapPopup3">
              <div class="mapPopup3__content">
                <h1 class="mapPopup3__title">${data[i].name}</h1>
              </div>
            </div>
          `)
        )
      }

      markers.value.push(marker)
      map.value.addLayer(marker)
    }

    function clearMarker() {
      if(markers.value) {
        for(let i = 0; i < markers.value.length; i++) {
          map.value.removeLayer(markers.value[i])
        }
        markers.value = []
      }
    }
    /* 建立景點標誌結束 */

    onMounted(() => initMap())

    return {
      divRef,
      divPopupRef,
      curBikeway
    }
  }
}
</script>

<style>
#map {
  width: 100%;
  height: calc(100vh - 80px);
  position: relative;
  z-index: 1;
}
</style>