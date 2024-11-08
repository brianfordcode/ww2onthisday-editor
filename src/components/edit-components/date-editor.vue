<template>

    <div>
        <span :class="{'done': year && month && day ? true : false}">date:</span>
        <!-- YEAR -->
        <select style="margin-left: 2px;" v-model="year">
            <option selected disabled>YEAR</option>
            <option
            v-for="year in 7"
            :key="year">
            {{year ? year + 1938 : year}}
            </option>
        </select>
        <!-- MONTH -->
        <select v-model="month">
            <option selected disabled>Month</option>
            <option
                v-for="(month, index) in months"
                :key="month"
                :value="(index < 9 ? '0' : '') + (index + 1)"
            >
            {{month}}
            </option>
        </select>
        <!-- DAY -->
        <select v-model="day">
            <option disabled selected>DAY</option>
            <option
            v-for="day in 31"
            :key="day"
            >
            {{ (day < 10 ? '0' : '') + day }}
            </option>
        </select>
        <button style="height: 22px; padding: 2px; width: 20px;" @click="clearDate()">&#x2715;</button>
        <button style="margin-left: 10px; padding: 2px;" @click="markDate">mark</button>
    </div>

</template>

<script>

export default {
    props: {
        dateString: {
            type: String,
            default: '--'
        }
    },
    data() {
        const [year, month, day] = this.dateString.split('-')
        return {
            year,
            month,
            day,
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        }
    },
    computed: {
        date() {
            return `${this.year}-${this.month}-${this.day}`
        }
    },
    watch: {
        dateString() {
            const [year, month, day] = this.dateString.split('-')
            this.year = year
            this.month = month
            this.day = day
        },
        date() {
            this.$emit('update', this.date)
            // console.clear()
        }
    },
    methods: {
        clearDate() {
            this.year = ''
            this.month = ''
            this.day = ''
        },
        markDate() {
            // Add a time part to ensure it's local time
            const date = new Date(`${this.year}-${this.month}-${this.day}T00:00:00`);
            
            if (date.getTime() && !isNaN(date)) {
                const formatDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                const dateWritten = { dateMarked: formatDate };
                this.$store.dispatch('markDate', dateWritten);
            } else {
                console.error('Invalid date');
            }
        }
    }
}
</script>