<template>
    <div id="app">
        <v-combobox v-model="chips" :items="items" chips clearable label="Select Topic" multiple solo>
            <template v-slot:selection="{ attrs, item, select, selected }">
                <v-chip v-bind="attrs" :input-value="selected" close @click="select" @click:close="remove(item)">
                    <strong>{{ item }}</strong>&nbsp;
                </v-chip>
            </template>
        </v-combobox>
    </div>
</template>

<script>
export default {
    data () {
        return {
            chips: [],
            items: this.$store.state.topics
        }
    },
    methods: {
        remove (item) {
            this.chips.splice(this.chips.indexOf(item), 1)
            this.chips = [...this.chips]
        }
    }
}
</script>