<template>
    <div class="tweet">
        <h3 class="header">
            Tweet about {{$store.state.topic}}
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
            <!-- <div v-for="(tags, i) of item.hashtags" :key="i" class="tweetTags">
                #{{tags}}
            </div> -->
            <hr>
        </div>
        <v-pagination v-model="pageNm" :length="getPageLength()" color="#AAAAAA" style="text-color"></v-pagination>
    </div>
</template>

<script>
export default {
    data:() => ({
        topic: "Face Mask",
        allTweetData: [],
        month: 0,
        pageNm: 1,
    }),
    async created() {
        await this.axios
            .get('https://mongo-fastapi01.herokuapp.com/api/get-tweets/?n=30&sdate=20200215')
            .then((response) => {
                this.allTweetData = response.data
                console.log(response.data)
            })
            .catch((e) => {
                console.log(e)
            })
        this.month = this.$store.state.month
    },
    methods:{
        updateTweet(month){
            this.axios
            .get('https://mongo-fastapi01.herokuapp.com/api/get-tweets/?n=30&sdate=2020' + month + "01")
            .then((response) => {
                this.allTweetData = response.data
            })
            .catch((e) => {
                console.log(e)
            })
        },
        getMonthNumber(val){
            if(val < 10){
                return "0" + val
            }else {
                return val
            }
        },
        watchMonthChange(){
            this.$store.watch(() => this.$store.getters.getMonth,
            id => this.updateTweet(this.getMonthNumber(id))
            );
        },
        getPageLength(){
            return this.allTweetData.length / 20 + 1
        },
        getPageStart(val){
            return (val - 1) * 20
        },
        getPageEnd(val){
            return val * 20
        }
    },
    mounted() {
        this.watchMonthChange()
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
        float: left;
        font-size: 18px;
    }
    .tweetRT{
        position: relative;
        text-align: right;
        font-size: 18px;
    }
    .tweetText{
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
</style>