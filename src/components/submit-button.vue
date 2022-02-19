<template>

    <div v-if="$store.state.events[0]">
        <button @click="handleClick()">
        ADD ABOVE EVENTS TO SITE
        </button>
    </div>

</template>

<script>

export default {
    methods: {
        handleClick() {
            console.log(this.$store.state.events)
            // this.$store.dispatch('sendToFirebase', this.$store.state.events)
        }
    }

}

</script>

<style scoped>

div {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin: 50px 0;
}

button {
    width: 300px;
    height: 50px;
} 

</style>