<template>

    <div v-if="$store.state.event[0]">
    <button>
      ADD ABOVE EVENTS TO SITE
    </button>
  </div>

</template>

<script>
export default {

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