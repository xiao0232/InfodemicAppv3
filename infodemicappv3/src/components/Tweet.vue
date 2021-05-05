<template>
    <div>
        <div v-if="!getApi" class="progressCircle">
            <v-progress-circular indeterminate color="white"></v-progress-circular>
        </div>
        <div class="tweet" v-else>
            <h3 class="header">
                Tweet about {{topic}}
            </h3>
            <div class="topicHr">
                <hr>
            </div>
            <div v-for="(item, i) in allTweetData.slice(getPageStart(pageNm), getPageEnd(pageNm))" :key="i" class="tweetList">
                <div class="tweetImg">
                </div>
                <div class="tweetAddress">
                    ＠{{item.user_screen_name}}
                </div>
                <div class="tweetRT">
                    {{item.retweets_count}} Retweeted
                </div>
                <div class="tweetText">
                    {{item.text}}
                </div>
                <hr>
            </div>
            <v-pagination v-model="pageNm" :length="getPageLength()" color="#AAAAAA" style="text-color"></v-pagination>
        </div>
    </div>
</template>

<script>
export default {
    data:() => ({
        topic: 'Covid-19',
        allTweetData: [],
        month: 0,
        pageNm: 1,
        getApi: false,
    }),
    async created() {
        this.getApi = false
            await this.axios
            .get(encodeURI(this.getUrl('https://mongo-fastapi01.herokuapp.com/api/get-tweets', 'Covid-19?n=200')))
            .then((response) => {
                this.allTweetData = response.data
                this.getApi = true
            })
            .catch((e) => {
                console.log(e)
            })
    },
    methods:{
        async getTweetData(){
            this.getApi = false
            await this.axios
            .get(encodeURI(this.getUrl('https://mongo-fastapi01.herokuapp.com/api/get-tweets', this.getTotalTagDatas(this.$store.state.chips) + '?n=200')))
            .then((response) => {
                this.allTweetData = response.data
                this.topic = this.getTotalTagTitle(this.$store.state.chips)
                this.getApi = true
            })
            .catch((e) => {
                console.log(e)
            })
        },
        getPageLength(){
            return Math.ceil(this.allTweetData.length / 20)
        },
        getPageStart(val){
            return (val - 1) * 20
        },
        getPageEnd(val){
            return val * 20
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
        },
        getTotalTagTitle(val){
            let tagstring = ''
            if (val.length == 0) {
                return
            }
            for (let i = 0, length = val.length; i < length; i++){
                if (i === (length - 1)) {
                    tagstring += val[i]
                } else {
                    tagstring += val[i] + ','
                }
            }  
            return tagstring
        },
        getUrl (...args) {
            const result = args.join('/')
            return result
        },
    },
    mounted() {
        this.$store.watch((state, getters) => getters.getChips,
            () => {
                this.getTweetData()
            }
        )
    },
}
</script>

<style scoped>
    .tweet{
        position: relative;
        margin: 0 auto;
        margin-top: 60px;
        width: 90%;
        max-width: 640px;
        background-color: #242a3c;
    }
    .tweetList{
        position: relative;
        margin: 0 auto;
        width: 80%;
        max-width: 640px;
    }
    .header{
        color: white;
        position: relative;
        text-align: center;
        padding-top: 10px;
        padding-bottom: 10px;
        margin-left: 5%;
        border-left: 4px solid #ec2;
    }
    .tweetDispName{
        float: left;
        font-size: 18px;
    }
    .tweetAddress{
        color: white;
        float: left;
        font-size: 18px;
    }
    .tweetRT{
        color: white;
        position: relative;
        text-align: right;
        font-size: 18px;
    }
    .tweetText{
        color: white;
        position: relative;
        margin: 0 auto;
        width: 65%;
    }
    .topicHr{
        margin: auto;
        width: 90%;
    }
    .pageBtns{
        text-align: center;
    }
    .pageBtn{
        margin-left: 5px;
        margin-right: 5px;
        margin-bottom: 15px;
    }
    hr{
        margin-bottom: 15px;
    }
    .progressCircle{
        text-align: center;
    }
</style>