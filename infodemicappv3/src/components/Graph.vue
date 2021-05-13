<template>
    <div>
        <div v-if="!getApi" class="progressCircle">
            <v-progress-circular indeterminate color="white"></v-progress-circular>
        </div>
        <div style="width:100%" v-else>
            <line-chart class="container" :chart-data="chart" :options="complexChartOption"></line-chart>
        </div>
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
            getApi: false,
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
                            max: 800000,
                            min: 0,
                            stepSize: 160000
                        }
                    },{
                        id: "y-axis-2",
                        type: "linear",
                        position: "right",
                        ticks: {
                            max: 400000,
                            min: 0,
                            stepSize: 80000
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
                            max: 80000,
                            min: 0,
                            stepSize: 16000
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
    computed: {
        getTotalTagDatas(){
            let tagstring = ''
            const chips = this.$store.state.chips
            if (chips.length == 0) {
                return
            }
            for (let i = 0, length = chips.length; i < length; i++){
                if (i === (length - 1)) {
                    tagstring += chips[i]
                } else {
                    tagstring += chips[i] + '|'
                }
            }  
            return tagstring
        },
        getTotalTagTitle(){
            let tagstring = ''
            const chips = this.$store.state.chips
            if (chips.length == 0) {
                return
            }
            for (let i = 0, length = chips.length; i < length; i++){
                if (i === (length - 1)) {
                    tagstring += chips[i]
                } else {
                    tagstring += chips[i] + ' or '
                }
            }  
            return tagstring
        },
    },
    async created() {
        this.barChartData = this.yearChartData
        const ChartData = JSON.parse(JSON.stringify(this.barChartData))
        this.complexChartOption = this.yearChartOption
        await this.axios
            .get(encodeURI('https://mongo-fastapi01.herokuapp.com/api/count-hashtags/months/Covid-19'))
            .then((response) => {
                ChartData.datasets.push(this.makeGraphTemplateData('Covid-19', '#14FFD4', false, this.makeGraphData(response.data), '#14FFD4', 'line', 'y-axis-2'))
                this.chart = ChartData
                this.getApi = true
            })
            .catch((e) => {
                console.log(e)
            })
    },
    mounted() {
        this.$store.watch((state, getters) => getters.getChips,
            async () => {
                if (this.$store.state.showDate == 'year') {
                    this.barChartData = this.yearChartData
                    await this.getGraphData('months')
                    this.getApi = true
                } else if (this.$store.state.showDate == 'month') {
                    this.barChartData = this.monthChartData
                    await this.getGraphData('dates')
                    this.getApi = true
                }
            }
        )
        this.$store.watch((state, getters) => getters.getShowDate,
            async () => {
                if (this.$store.state.showDate == 'year') {
                    this.barChartData = this.yearChartData
                    this.complexChartOption = this.yearChartOption
                    await this.getGraphData('months')
                    this.getApi = true
                } else if (this.$store.state.showDate == 'month') {
                    this.barChartData = this.monthChartData
                    this.complexChartOption = this.monthChartOption
                    await this.getGraphData('dates')
                    this.getApi = true
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
        async getGraphData(val) {
            this.getApi = false
            const ChartData = JSON.parse(JSON.stringify(this.barChartData))
            if(this.$store.state.chips.length !== 0){
                for await (const item of this.$store.state.chips) {
                    this.axios
                    .get(encodeURI(this.getUrl('https://mongo-fastapi01.herokuapp.com/api/count-hashtags', val, item)))
                    .then((response) => {
                        ChartData.datasets.push(this.makeGraphTemplateData(item, '#14FFD4', false, this.makeGraphData(response.data), '#14FFD4', 'line', 'y-axis-2'))
                    })
                    .catch((e) => {
                        console.log(e)
                    })
                }
                await this.axios
                .get(encodeURI(this.getUrl('https://mongo-fastapi01.herokuapp.com/api/count-hashtags', val, this.getTotalTagDatas)))
                .then((response) => {
                    ChartData.datasets.push(this.makeGraphTemplateData(this.getTotalTagTitle, '#FF7A6B', false, this.makeGraphData(response.data), '#FF7A6B', 'line', 'y-axis-1'))
                })
                .catch((e) => {
                    console.log(e)
                })
            }
            this.chart = ChartData
        },
    }
}
</script>

<style scoped>
    .container{
        max-width: 640px;
    }
    .progressCircle{
        text-align: center;
    }
</style>