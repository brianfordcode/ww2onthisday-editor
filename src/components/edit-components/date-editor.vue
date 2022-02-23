<template>

    <div>
        <span :class="{'done': year && month && day ? true : false}">date:</span>
        <!-- YEAR -->
        <select style="margin-left: 2px;" v-model="year" @blur="addDate()">
            <option selected disabled>YEAR</option>
            <option
            v-for="year in 7"
            :key="year">
            {{year ? year + 1938 : year}}
            </option>
        </select>
        <!-- MONTH -->
        <select v-model="month" @blur="addDate()">
            <option selected disabled>Month</option>
            <option
                v-for="(month, index) in months"
                :key="month"
                :value="(index < 10 ? '0' : '') + (index + 1)"
            >
            {{month}}
            </option>
        </select>
        <!-- DAY -->
        <select v-model="day" @blur="addDate()">
            <option disabled selected>DAY</option>
            <option
            v-for="day in 31"
            :key="day"
            >
            {{ (day < 10 ? '0' : '') + day }}
            </option>
        </select>
        <button @click="clearDate()">&#x2715;</button>
    </div>

</template>

<script>

export default {
    data() {
        return {
            year: '',
            month: '',
            day: '',
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',],
            fullDate: '',
            date: '',
        }
    },
    methods: {

        addDate() {
            this.fullDate = this.year + '-' + this.month + '-' + this.day
            if (this.fullDate === '') { return }
            this.$emit('addDate', this.fullDate)
        },
        clearDate() {
            this.year = ''
            this.month = ''
            this.day = ''
        },
    }

}
</script>

<style>

</style>