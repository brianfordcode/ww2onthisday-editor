<template>
    <!-- LOCATION -->
    <label for="coordinates">
        <span :class="markDone(locationInput.coordinates)">coordinates:</span>
        <input v-model="locationInput.coordinates" type="text">
    </label>
    <label for="mapZoom">
        map zoom: <input style="width: 30px;" v-model="locationInput.mapZoom" type="number" min="1" max="21">
    </label>
    <iframe
        class="map"
        v-if="locationInput.coordinates"
        style="border:0;"
        loading="lazy"
        allowfullscreen
        :src="`https://www.google.com/maps/embed/v1/view?key=AIzaSyAzuMuGU3ynDz4KU87IzdKY_pXzhUyILoQ&center=
        ${locationInput.coordinates}&zoom=${locationInput.mapZoom}
        &maptype=satellite`"
    />
</template>

<script>
export default {
    props: {
        locationInput: {
            type: Object,
            required: true,
        },
    },
    methods: {
        markDone(data) {
            if (data) {
                return 'done'
            }
        },
    }
}
</script>

<style>

</style>