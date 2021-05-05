<template>
    <div style="width:100%">
        <line-chart class="container" :chart-data="chart" :options="complexChartOption" v-if="load"></line-chart>
    </div>
</template>

<script>
import LineChart from './LineChart.js'

export default {
    components: {
      LineChart
    },
    data() {
        return {
            load: false,
            graphTemplateData: {
                label: '',
                data: [],
                fill: true,
                backgroundColor: '',
                borderColor: '',
                type: '',
                yAxisID: ''
            },
            yearChartData: {
                labels: ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                datasets: []
            },
            monthChartData: {
                labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
                datasets: []
            },
            barChartData: {},
            chart: {},
            yearChartOption: {
                responsive: true,
                scales: {
                    yAxes: [{
                        id: "y-axis-1",
                        type: "linear",
                        position: "left",
                        ticks: {
                            max: 500000,
                            min: 0,
                            stepSize: 100000
                        }
                    },{
                        id: "y-axis-2",
                        type: "linear",
                        position: "right",
                        ticks: {
                            max: 100000,
                            min: 0,
                            stepSize: 20000
                        }
                    }]
                }
            },
            monthChartOption: {
                responsive: true,
                scales: {
                    yAxes: [{
                        id: "y-axis-1",
                        type: "linear",
                        position: "left",
                        ticks: {
                            max: 50000,
                            min: 0,
                            stepSize: 10000
                        }
                    },{
                        id: "y-axis-2",
                        type: "linear",
                        position: "right",
                        ticks: {
                            max: 20000,
                            min: 0,
                            stepSize: 4000
                        }
                    }]
                }
            },
            complexChartOption: {}
        }
    },
    created() {
        this.complexChartOption = this.yearChartOption
        this.barChartData = this.yearChartData
        this.load = true
    },
    mounted() {
        this.$store.watch((state, getters) => getters.getChips,
            async () => {
                if (this.$store.state.showDate == 'year') {
                    this.barChartData = this.yearChartData
                    await this.getMonthData()
                    this.load = true
                } else if (this.$store.state.showDate == 'month') {
                    this.barChartData = this.monthChartData
                    await this.getDateData()
                    this.load = true
                }
            }
        )
        this.$store.watch((state, getters) => getters.getShowDate,
            async () => {
                if (this.$store.state.showDate == 'year') {
                    this.barChartData = this.yearChartData
                    this.complexChartOption = this.yearChartOption
                    await this.getMonthData()
                    this.load = true
                } else if (this.$store.state.showDate == 'month') {
                    this.barChartData = this.monthChartData
                    this.complexChartOption = this.monthChartOption
                    await this.getDateData()
                    this.load = true
                }
            }
        )
    }, 
    methods: {
        makeGraphTemplateData(label, backgroundColor, fill, data, borderColor, type, yAxisID){
            const graph = JSON.parse(JSON.stringify(this.graphTemplateData))
            graph.label = label
            graph.data = data
            graph.fill = fill
            graph.backgroundColor = backgroundColor
            graph.borderColor = borderColor
            graph.type = type
            graph.yAxisID = yAxisID
            return graph
        },
        makeGraphData(val) {
            const count = []
            for(const elem of val){
                count.push(elem.count)
            }
            return count
        },
        getUrl (...args) {
            const result = args.join('/')
            return result
        },
        async getMonthData() {
            this.load = false
            const ChartData = JSON.parse(JSON.stringify(this.barChartData))
            for await (const item of this.$store.state.chips) {
                this.axios
                .get(encodeURI(this.getUrl('https://mongo-fastapi01.herokuapp.com/api/count-hashtags/months', item)))
                .then((response) => {
                    ChartData.datasets.push(this.makeGraphTemplateData(item, '#14FFD4', false, this.makeGraphData(response.data), '#14FFD4', 'line', 'y-axis-2'))
                })
                .catch((e) => {
                    console.log(e)
                })
            }
            await this.axios
            .get(encodeURI(this.getUrl('https://mongo-fastapi01.herokuapp.com/api/count-hashtags/months', this.getTotalTagDatas(this.$store.state.chips))))
            .then((response) => {
                ChartData.datasets.push(this.makeGraphTemplateData(this.getTotalTagDatas(this.$store.state.chips), '#FF7A6B', false, this.makeGraphData(response.data), '#FF7A6B', 'line', 'y-axis-1'))
            })
            .catch((e) => {
                console.log(e)
            })
            this.chart = ChartData
        },
        async getDateData() {
            this.load = false
            const ChartData = JSON.parse(JSON.stringify(this.barChartData))
            for await (const item of this.$store.state.chips) {
                this.axios
                .get(encodeURI(this.getUrl('https://mongo-fastapi01.herokuapp.com/api/count-hashtags/dates', item)))
                .then((response) => {
                    ChartData.datasets.push(this.makeGraphTemplateData(item, '#14FFD4', false, this.makeGraphData(response.data), '#14FFD4', 'line', 'y-axis-2'))
                })
                .catch((e) => {
                    console.log(e)
                })
            }
            await this.axios
            .get(encodeURI(this.getUrl('https://mongo-fastapi01.herokuapp.com/api/count-hashtags/dates', this.getTotalTagDatas(this.$store.state.chips))))
            .then((response) => {
                ChartData.datasets.push(this.makeGraphTemplateData(this.getTotalTagDatas(this.$store.state.chips), '#FF7A6B', false, this.makeGraphData(response.data), '#FF7A6B', 'line', 'y-axis-1'))
            })
            .catch((e) => {
                console.log(e)
            })
            this.chart = ChartData
        },
        getTotalTagDatas(val){
            let tagstring = ''
            if (val.length == 0) {
                return
            }
            for (let i = 0, length = val.length; i < length; i++){
                if (i === (length - 1)) {
                    tagstring += val[i]
                } else {
                    tagstring += val[i] + '|'
                }
            }  
            return tagstring
        }
    }
}
</script>

<style scoped>
    .container{
        max-width: 640px;
    }
</style>