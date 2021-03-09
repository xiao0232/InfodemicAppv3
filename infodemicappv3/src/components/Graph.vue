<template>
  <div class="small">
      <!-- <v-btn @click="test()">TEST</v-btn> -->
    <h2>Data about {{$store.state.topic}}</h2>
    <div class="topicBtns">
        <v-btn @click="pushTopicBtn('Face Mask')" class="topicBtn" color="#AAAAAA">Face Mask</v-btn>
        <v-btn @click="pushTopicBtn('Vaccine')" class="topicBtn" color="#AAAAAA">Vaccine</v-btn>
        <v-btn @click="pushTopicBtn('Yahoo!News')" class="topicBtn" color="#AAAAAA">Yahoo!News</v-btn>
    </div>
    <div class="dateBtn">
        <v-btn @click="pushDateBtn('year')" color="#AAAAAA">year</v-btn>
        <v-btn @click="pushDateBtn('month')" color="#AAAAAA">month</v-btn>
        <!-- <v-btn @click="pushDateBtn('day')">day</v-btn> -->
    </div>
    <div v-if="loaded == false">
        <v-progress-circular indeterminate color="black"></v-progress-circular>
    </div>
    <div v-if="loaded == true">
        <v-container class='dateSelect'>
            <v-row align="center">
                <v-col cols="3">
                    <v-select :items="yearRange" label="year" outlined v-model="selectYear"></v-select>
                </v-col>
                <v-col cols="3">
                    <v-select :items="this.monthRange.map( str => parseInt(str, 10))" label="month" outlined v-if="dateState >= 2" v-model="selectMonth"></v-select>
                </v-col>
                <!-- <v-col cols="3">
                    <v-select :items="dayArgs" label="day" outlined v-if="dateState == 3" v-model="selectDay"></v-select>
                </v-col> -->
            </v-row>
        </v-container>
        <div class="charts">
            <line-chart v-if="loaded" :chart-data="datacollection"></line-chart>
        </div>
    </div>
  </div>
</template>

<script>
  import LineChart from './LineChart.js'

  export default {
    components: {
      LineChart
    },
    data () {
      return {
            totalMonthData: [],
            totalDayData: [],
            maskMonthData: [],
            maskDayData: [],
            vaccineMonthData: [],
            vaccineDayData: [],
            yahooMonthData: [],
            yahooDayData: [],
            topicMonthData: [],
            topicDayData: [],
            topic: 'Face Mask',
            date: 'year',
            yearRange: [],
            monthRange: [],
            dayRange: [],
            loaded: false,                                                   //API追加時に使用
            dateState: 1,
            selectYear: 2020,
            selectMonth: 2,
            selectDay: 21,
            datacollection: { labels: [], datasets: [] },
            graphDataTotal: [],
            graphDataTopic: [],
            graphLabel: [],
      }
    },
    async created(){
        await this.axios
        .get('https://mongo-fastapi01.herokuapp.com/api/count-dates')
        .then((response) => {
            this.totalDayData = response.data
        })
        .catch((e) => {
            console.log(e)
        })
        await this.axios
        .get('https://mongo-fastapi01.herokuapp.com/api/count-months/')
        .then((response) => {
            this.totalMonthData = response.data
        })
        .catch((e) => {
            console.log(e)
        })
        await this.axios
        .get('https://mongo-fastapi01.herokuapp.com/api/count-hashtags/months/マスク')
        .then((response) => {
            this.maskMonthData = response.data
        })
        .catch((e) => {
            console.log(e)
        })
        await this.axios
        .get('https://mongo-fastapi01.herokuapp.com/api/count-hashtags/dates/マスク')
        .then((response) => {
            this.maskDayData = response.data
        })
        .catch((e) => {
            console.log(e)
        })
        await this.axios
        .get('https://mongo-fastapi01.herokuapp.com/api/count-hashtags/months/ワクチン')
        .then((response) => {
            this.vaccineMonthData = response.data
        })
        .catch((e) => {
            console.log(e)
        })
        await this.axios
        .get('https://mongo-fastapi01.herokuapp.com/api/count-hashtags/dates/ワクチン')
        .then((response) => {
            this.vaccineDayData = response.data
        })
        .catch((e) => {
            console.log(e)
        })
        await this.axios
        .get('https://mongo-fastapi01.herokuapp.com/api/count-hashtags/months/Yahoo')
        .then((response) => {
            this.yahooMonthData = response.data
        })
        .catch((e) => {
            console.log(e)
        })
        await this.axios
        .get('https://mongo-fastapi01.herokuapp.com/api/count-hashtags/dates/Yahoo')
        .then((response) => {
            this.yahooDayData = response.data
        })
        .catch((e) => {
            console.log(e)
        })
        await this.totalMonthData.filter(data => {
            if(this.yearRange.includes(data.month.substring(0, 4)) == false){
                this.yearRange.push(data.month.substring(0, 4))
            }
        })
        await this.totalMonthData.filter(data => {
            if(this.monthRange.includes(data.month.substring(4, 6)) == false){
                this.monthRange.push(data.month.substring(4, 6))
            }
        })
        // this.monthArgs = this.monthArgs.map( str => parseInt(str, 10))
        this.graphLabel = this.monthRange.map( str => parseInt(str, 10))
        this.topicMonthData = this.maskMonthData
        this.topicDayData = this.maskDayData
        this.loaded = true
        this.pushTopicBtn('Face Mask')
    },
    methods: {
        setMonth(val){
            this.$store.commit('setMonth', val)
        },
        setTopic(val){
            this.$store.commit('setTopic', val)
        },
        getCountData(val){
            let count = []
            count = []
            for(const elem of val){
                count.push(elem.count)
            }
            return count
        },
        setData(totalval, topicval){
            this.graphDataTotal = this.getCountData(totalval)
            this.graphDataTopic = this.getCountData(topicval)
        },
      fillData () {
        this.datacollection = {
            labels: this.graphLabel,
            datasets: [
                {
                    label: 'total',
                    backgroundColor: '#FF7A6B',
                    fill: false,
                    data: this.graphDataTotal,
                    borderColor: '#FF7A6B',
                }, 
                {
                    label: this.topic,
                    backgroundColor: '#14FFD4',
                    fill: false,
                    type: 'bar',
                    data: this.graphDataTopic
                }
            ],
            options: {
                scales: {
                xAxes: [{
                    scaleLabel: {
                    display: true,
                    labelString: this.topic
                    }
                }],
                // yAxes: [{
                //     ticks: {
                //     beginAtZero: true,
                //     stepSize: 10,
                //     }
                // }]
                }
            }
        }
      },
      pushTopicBtn(val){
          switch(val){
                case 'Face Mask':
                    this.topicMonthData = this.maskMonthData
                    this.topicDayData = this.maskDayData
                    // console.log('Face Mask')
                    break;
                case 'Vaccine':
                    this.topicMonthData = this.vaccineMonthData
                    this.topicDayData = this.vaccineDayData
                    // console.log('Vaccine')
                    break;
                case 'Yahoo!News':
                    this.topicMonthData = this.yahooMonthData
                    this.topicDayData = this.yahooDayData
                    // console.log('Yahoo!News')
                    break;
                default:
                window.alert('error about pushTopicBtn()')
          }
          this.setTopic(val)
          this.topic = val
          this.pushDateBtn(this.date)
      },
      pushDateBtn(val){
          switch(val){
            case 'year':
                this.setData(this.totalMonthData, this.topicMonthData)
                this.graphLabel = this.monthRange
                this.dateState = 1
                this.fillData()
                break;
            case 'month':
                this.graphDataTotal = this.getCountData(this.totalDayData)
                this.graphDataTopic = this.getCountData(this.topicDayData)
                this.graphLabel = this.dayRange
                this.dateState = 2
                this.fillData()
                break;
            // case 'day':
            //     this.setData(this.totalDayData, this.topicDayData)
            //     this.graphLabel = this.selectDay
            //     this.dateState = 3
            //     break;
            default:
                window.alert('error about pushDateBtn()')
          }
          this.date = val
          this.fillData()
      }
    },
    watch: {
        selectYear:{
            handler(){
                switch(this.dataState){
                    case 1:
                        if(this.selectYear > 0){
                            this.pushTopicBtn(this.topic)
                            break;
                        } else{
                            break;
                        }
                    case 2:
                        if(this.selectYear > 0 && this.selectMonth > 0){
                            this.pushTopicBtn(this.topic)
                            break;
                        } else{
                            break;
                        }
                    case 3:
                        if(this.selectYear > 0 && this.selectMonth > 0 && this.selectDay > 0){
                            this.pushTopicBtn(this.topic)
                            break;
                        } else{
                            break;
                        }
                }
            }
        },
        selectMonth:{
            handler(){
                this.dayRange.length = 0
                this.totalDayData.filter(data => {
                    if(data.date.substring(4, 6) ==  this.selectMonth && this.dayRange.includes(data.date.substring(6, 8)) == false){
                        this.dayRange.push(data.date.substring(6, 8))
                    }
                })
                this.setMonth(this.selectMonth)
                this.fillData()
            }
        },
        selectDay:{
            handler(){
                this.fillData()
            }
        }
    }
  }
</script>

<style>
    h2{
        text-align: center;
    }
    .topicBtns{
        text-align: center;
    }
    .topicBtn{
        text-align: center;
    }
    .dateBtn{
        text-align: center;
        /* color: #d72; */
    }
    .small {
        max-width: 640px;
        margin: auto;
        /* margin:  150px auto; */
    }
    .charts{
        position: relative;
        margin: 0 auto;
        width: 90%;
        max-width: 640px;
        background-color: #242a3c;
    }
    .v-list-item__title {
        color: black !important;
    }
</style>
