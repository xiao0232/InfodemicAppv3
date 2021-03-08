import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    topic: 'Face Mask',
    month: 2,
  },
  mutations: {
    setTopic(state, val){
      state.topic = val
    },
    setMonth(state, val){
      state.month = val
    },
  },
  actions: {
  },
  getters: {
    getMonth: state => state.month
  },
  modules: {
  }
})
