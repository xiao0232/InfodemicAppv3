<template>
  <v-app>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>


export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap');
.v-application{
  margin: 0 auto; 
  width: 100%;
  max-width: 640px;
  background-color: #061a2b !important;
  font-family: 'Noto Sans JP', sans-serif !important; 
}
*{
  color: #fafafa !important;
}
body{
  background: #061a2b;
}
</style>