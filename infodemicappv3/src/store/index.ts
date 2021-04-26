import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    topics: ['FaceMask', 'Covid-19', 'Vaccine', 'Yahoo!News'], 
    chips: [],
    topic: 'Face Mask',
    month: 2,
    monthTotalTagDatas: {},
    dayTotalTagDatas: {},
    showDate: 'year'
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
    setMonthTotalTagDatas(state, val){
      state.monthTotalTagDatas = val
    },
    setDayTotalTagDatas(state, val){
      state.dayTotalTagDatas = val
    },
    setShowDate(state, val){
      state.showDate = val
    }
  },
  actions: {
  },
  getters: {
    getShowDate: state => state.showDate,
    getMonth: state => state.month
  },
  modules: {
  }
})
