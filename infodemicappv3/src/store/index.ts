import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    topics: ['FaceMask', 'Covid-19', 'vaccine', 'Yahoo!News'], 
    monthRange: ['2'],
    chips: [],
    topic: 'Covid-19',
    month: 2,
    yearRange: ['2020'],
    showDate: 'year',
  },
  mutations: {
    setTopic(state, val){
      state.topic = val
    },
    setMonth(state, val){
      state.month = val
    },
    setChips(state, val){
      state.chips = val
    },
    setShowDate(state, val){
      state.showDate = val
    }
  },
  actions: {
  },
  getters: {
    getShowDate: state => state.showDate,
    getMonth: state => state.month,
    getChips: state => state.chips,
  },
  modules: {
  }
})
