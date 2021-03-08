<template>
    <div class="tweet">
        <h3 class="header">
            Tweet about {{$store.state.topic}}
        </h3>
        <div class="topicHr">
            <hr>
        </div>
        <div v-for="(item, i) in tweetDataSet" :key="i" class="tweetList">
            <div class="tweetImg">
            </div>
            <div class="tweetDispName">
                <!-- {{item.user_screen_name}} -->
                Test
            </div>
            <div class="tweetAddress">
                ＠{{item.user_screen_name}}
            </div>
            <div class="tweetText">
                {{item.text}}
            </div>
            <!-- <div v-for="(tags, i) of item.hashtags" :key="i" class="tweetTags">
                #{{tags}}
            </div> -->
            <div class="tweetRT">
                number of RT >>> {{item.retweets_count}}
            </div>
            <hr>
        </div>
        <!-- <v-btn @click="test()"></v-btn> -->
    </div>
</template>

<script>
export default {
    data:() => ({
        topic: "Face Mask",
        tweetDataSet: [],
        month: 0,
    }),
    async created() {
        await this.axios
            .get('https://mongo-fastapi01.herokuapp.com/api/get-tweets/?n=10&sdate=20201215')
            .then((response) => {
                this.tweetDataSet = response.data
            })
            .catch((e) => {
                console.log(e)
            })
        this.month = this.$store.state.month
    },
    methods:{
        updateTweet(val){
            this.axios
            .get('https://mongo-fastapi01.herokuapp.com/api/get-tweets/?n=10&sdate=2020' + val + "01")
            .then((response) => {
                this.tweetDataSet = response.data
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
        }
    },
    mounted() {
        this.$store.watch(() => this.$store.getters.getMonth,
            id => this.updateTweet(this.getMonthNumber(id))
        );
    },
}
</script>

<style scoped>
    .tweet{
        position: relative;
        margin: 0 auto;
        width: 100%;
        max-width: 640px;
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
    }
    .tweetDispName{
        float: left;
    }
    .tweetAddress{
        /* float: left; */
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
</style>