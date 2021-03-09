<template>
  <div class="home">
    <h1>
      Infodemic
    </h1>
    <graph></graph>
    <tweet></tweet>
  </div>
</template>

<script>
import Graph from '../components/Graph.vue'
import Tweet from '../components/Tweet'

export default {
  name: 'Home',
  components: {
    Graph,
    Tweet,
  },
  methods: {
  }
}
</script>

<style scoped>
  h1{
    text-align: center;
  }
</style>
