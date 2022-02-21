<template>
  <div id="map" ref="divRef"></div>
  <div ref="divPopupRef">
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
import { ref, toRefs, watch, computed, onMounted } from 'vue'
export default {
  props: ['bikes', 'selected', 'showCurBike'],
  setup(props) {
    const L = window.L
    const { bikes, selected, showCurBike } = toRefs(props)
    const divRef = ref(null)
    const divPopupRef = ref(null)
    const map = ref(null)
    const markIcon = ref(null)
    const markIcon2 = ref(null)
    const markers = ref(null)
    const markBike = ref(null)
    const coords = ref([])

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

    function initMap() {
      map.value = L.map('map', { zoomAnimation:false }).setView([23.975, 120.973], 8)

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
        popupAnchor: [24, 1],
      })
    }

    function setMarker() {
      markers.value = new L.MarkerClusterGroup({
        spiderfyOnMaxZoom: true,
        disableClusteringAtZoom: 18,
      })

      coords.value = []

      for(let i = 0; i < bikes.value.length; i++) {
        let iconStyle = bikes.value[i].rent > 0 ?  markIcon.value: markIcon2.value

        let coord = {
          position: L.marker(bikes.value[i].latlng, { icon: iconStyle }),
          bike: bikes.value[i]
        }

        markers.value.addLayer(
          coord.position
          .on('click', function () {
            markBike.value = bikes.value[i]
          })
          .bindPopup(
            L.popup({
              maxWidth: 350,
              className: 'mapPopup'
            })
          )
          .setPopupContent(divPopupRef.value)
        )

        coords.value.push(coord)
      }

      map.value.addLayer(markers.value)
    }

    function getSelectedPopup() {
      markBike.value = selected.value
      const coord = coords.value.find((item) => selected.value.uid == item.bike.uid).position
      coord.openPopup()
    }

    function moveToMarker() {
      map.value.setView(selected.value.latlng, 18)
    }

    watch(showCurBike, ()=> getSelectedPopup())
    watch(selected, ()=> moveToMarker())

    watch(bikes, ()=> {
      if(markers.value) {
        map.value.removeLayer(markers.value)
      }

      if(bikes.value) {
        setMarker()
        map.value.setView([23.975, 120.973], 8)
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
  height: calc(100vh - 80px);
  position: relative;
  z-index: 1;
}
</style>