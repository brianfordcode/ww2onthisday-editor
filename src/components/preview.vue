<template>

<p>SUBMITTED:</p>

<div
    class="container"
    v-for="(event, index) in $store.state.event"
    :key="event"
>
    <div class="event">
        <p>{{new Date($store.state.event[index].date).toLocaleDateString('en-us', {month:"long", day:"numeric", year: "numeric"})}}</p>
        <p>{{$store.state.event[index].title}}</p>
        <p>{{$store.state.event[index].citation}}</p>
    </div>


</div>


    
    

</template>

<script>
export default {

}
</script>

<style scoped>

.event {
    border: 1px solid;
    margin-bottom: 20px;
}


</style>