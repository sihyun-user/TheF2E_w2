<template>
  <div id="map" ref="divRef"></div>
  <div class="mapPopup" ref="divPopupRef" >
    <div class="mapPopup__content" v-if="markBike">
      <h1 class="mapPopup__title">{{ markBike.name }}</h1>
      <div class="mapPopup__address">
        <i class="fas fa-map-marker-alt"></i>
        <span v-if="markBike.address">{{ markBike.address }}</span>
        <span v-else>沒有標示地址</span>
      </div>
      <div class="mapPopup__updateTime">
        <i class="fas fa-history"></i>
        <span>{{ updateTime }}</span>
      </div>
      <div class="mapPopup__tags">
        <div class="mapPopup__status">
          <button class="tag tag-blue" v-if="markBike.status == '1'">正常營運</button>
          <button class="tag tag-red" v-else-if="markBike.status == '2'">暫停營運</button>
          <button class="tag tag-gray" v-else>停止營運</button>
        </div>

        <div class="mapPopup__numbers" v-if="markBike.status == '1'">
          <button class="tag tag-blue" v-if="markBike.rent > 0">尚有單車</button>
          <button class="tag tag-red"  v-else>已無單車</button>
          <button class="tag tag-gray" v-if="markBike.rent!= 0  && markBike.return == 0">車位已滿</button>
        </div>
      </div>
      <div class="mapPopup__numbers">
        <div>
          <h2>可借單車</h2>
          <span>{{ markBike.rent }}</span>
        </div>
        <div>
          <h2>可停空位</h2>
          <span>{{ markBike.return }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, toRefs, onMounted, watch, computed } from 'vue'
import CITYDATA from '../city-data.js'
export default {
  props: ['bikes', 'selected' ,'city'],
  setup(props) {
    const L = window.L
    const { bikes, selected ,city } = toRefs(props)
    const divRef = ref(null)
    const divPopupRef = ref(null)
    const map = ref(null)
    const markIcon = ref(null)
    const markIcon2 = ref(null)
    const center = ref(null)
    const markers = ref(null)
    const markBike = ref(null)
    const coords = []

    const updateTime = computed(() => {
      let date = new Date(markBike.value.updateTime)

      date = date.getFullYear()+
          "-"+(date.getMonth()+1)+
          "-"+date.getDate()+
          " "+date.getHours()+
          ":"+date.getMinutes()+
          ":"+date.getSeconds()

      return date
    })
    
    function setCenter() {
      let data = CITYDATA.find((item) => item.id == city.value)
      center.value = data.center
    }

    function initMap() {
      const corred = center.value ? center.value : [24.91571, 121.6739]
      map.value = L.map('map', { zoomAnimation:false }).setView(corred, 16)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map.value)

      markIcon.value = new L.Icon({
        iconUrl: require('../assets/img/L-bike.png'),
        iconSize: [48, 48],
        iconAnchor: [2, 2],
        popupAnchor: [24, 1],
      })

      markIcon2.value = new L.Icon({
        iconUrl: require('../assets/img/L-bike2.png'),
        iconSize: [48, 48],
        iconAnchor: [2, 2],
        popupAnchor: [12, -40],
      })
    }

    function setMarker() {
      markers.value = new L.MarkerClusterGroup().addTo(map.value)

      for(let i = 0; i < bikes.value.length; i++) {
        let iconStyle = bikes.value[i].rent > 0 ?  markIcon.value: markIcon2.value

        //todo 點擊站點觸發彈窗
        markers.value.addLayer(
          L.marker([bikes.value[i].lat, bikes.value[i].lng], { icon: iconStyle })
          .on('click', function (event) {
            markBike.value = bikes.value[i]
            console.log(L.marker(event.latlng))
          })
          .addTo(map.value)
          .bindPopup(
            L.popup({
              className: 'mapPopup'
            })
          )
          .setPopupContent(divPopupRef.value)
        )

        let coord = L.marker([bikes.value[i].lat, bikes.value[i].lng], { icon: iconStyle })
        coords.push(coord)
      }
      map.value.addLayer(markers.value)
    }

    function moveToMarker() {
      // map.value.setView([selected.value.lat, selected.value.lng], 18)
      console.log(coords[0])
      coords[0].openPopup()
    }

    watch(selected, ()=> {
      moveToMarker()
    })

    watch(bikes, ()=> {
      if(bikes.value) {
        setMarker()
        setCenter()
      }
    })
    
    onMounted(() => initMap())

    return {
      divRef,
      divPopupRef,
      markBike,
      updateTime,
    }
  }
}
</script>

<style>
#map {
  width: 100%;
  margin: auto;
  height: calc(100vh - 80px);
  position: relative;
  z-index: 1;
} 
</style>