<template>
    <div id="app">
        <v-container class="main">
            <v-row>
                <v-col>
                    <v-combobox v-model="chips" :items="items" chips clearable label="Select Topic" multiple solo class="topics">
                        <template v-slot:selection="{ attrs, item, select, selected }">
                            <v-chip v-bind="attrs" :input-value="selected" close @click="select" @click:close="remove(item)">
                                <strong>{{ item }}</strong>&nbsp;
                            </v-chip>
                        </template>
                    </v-combobox>
                </v-col>
                <v-col>
                    <v-select :items="monthDay" outlined v-model="selectRange" background-color="white"></v-select>
                </v-col>
                <!-- <v-col v-if="this.$store.state.showDate == 'year'">
                    <v-select :items="yearRange" outlined v-model="selectYear" background-color="white"></v-select>
                </v-col>
                <v-col v-if="this.$store.state.showDate == 'month'">
                    <v-select :items="monthRange" outlined v-model="selectMonth" background-color="white"></v-select>
                </v-col> -->
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    data () {
        return {
            chips: [],
            items: this.$store.state.topics,
            monthDay: [
                'year',
                'month'
            ],
            selectRange: '',
            selectYear: '',
            yearRange: ['2020'],
            selectMonth: '',
            monthRange: ['2']
        }
    },
    created() {
        this.selectRange = this.$store.state.showDate
        this.selectYear = this.$store.state.yearRange
    },
    methods: {
        getUrl (...args) {
            const result = args.join('/')
            return result
        },
        remove (item) {
            this.chips.splice(this.chips.indexOf(item), 1)
            this.chips = [...this.chips]
        },
        setChips(val){
            this.$store.commit('setChips', val)
        },
    },
    watch: {
        chips: {
            handler() {
                this.setChips(this.chips)
            }
        },
        selectRange: {
            handler() {
                this.$store.commit('setShowDate', this.selectRange)
            }
        }
    }
}
</script>

<style scoped>
    .main{
        max-width: 640px;
    }
    .topics{
        height: 100%;
        width: 100%;
    }
</style>