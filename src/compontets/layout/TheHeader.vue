<template>
  <section class="header">
    <nav>
      <img class="logo" src="@/assets/img/LOGO.png" alt="logo">
      <div class="btns">
        <router-link to="/bikeways" :class="{ active: path == '/bikeways'}">
          尋找車道
        </router-link>
        <router-link to="/bikes" :class="{ active: path == '/bikes'}">
          尋找單車
        </router-link>
      </div>
    </nav>
  </section>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
export default {
  setup() {
    const route=useRoute()

    const path = computed(() => route.path)

    return {
      path
    }
  }
}
</script>