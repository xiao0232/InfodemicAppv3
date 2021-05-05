<template>
  <div class="home">
    <head-chips></head-chips>
    <graph></graph>
    <tweet></tweet>
  </div>
</template>

<script>
import HeadChips from '@/components/headChips.vue'
import Graph from '../components/Graph.vue'
import Tweet from '../components/Tweet'

export default {
  name: 'Home',
  components: {
    Graph,
    Tweet,
    HeadChips,
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
