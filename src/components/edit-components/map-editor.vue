<template>
    <!-- LOCATION -->
    <div>
        <span :class="{'done': input.coordinates ? true : false}">coordinates:</span>
        <input @blur="addMapDetails()" v-model="input.coordinates" type="text">
    </div>
    <!-- MAP ZOOM -->
    <label v-if="input.coordinates">
        map zoom: <input @blur="addMapDetails()" style="width: 30px;" v-model="input.mapZoom" type="number" min="1" max="21">
    </label>
    <iframe
        class="map"
        v-if="input.coordinates"
        style="border:0;"
        loading="lazy"
        allowfullscreen
        :src="`https://www.google.com/maps/embed/v1/view?key=AIzaSyAzuMuGU3ynDz4KU87IzdKY_pXzhUyILoQ&center=
        ${input.coordinates}&zoom=${input.mapZoom}
        &maptype=satellite`"
    />
</template>

<script>
export default {
    emits: ["addMapDetails"],
    data() {
        return {
            input: {
                coordinates: '',
                mapZoom: 6
            }
        }
    },
    methods: {
        addMapDetails() {
            this.$emit('addMapDetails', this.input)
        }
    }
}
</script>

<style>

</style>