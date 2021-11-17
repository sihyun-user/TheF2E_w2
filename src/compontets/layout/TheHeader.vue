<template>
  <section class="header">
    <nav>
      <img class="logo" src="@/assets/img/LOGO.png" alt="logo">
      <div class="btns">
        <router-link to="/bikeways" :class="{ active: this.$route.path == '/bikeways'}">
          尋找車道
        </router-link>
        <router-link to="/bikes" :class="{ active: this.$route.path == '/bikes'}">
          尋找單車
        </router-link>
      </div>
    </nav>
  </section>
</template>