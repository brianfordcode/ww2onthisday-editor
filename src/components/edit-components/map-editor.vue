<template>
    <!-- LOCATION -->
    <div>
        <span :class="{'done': coordinates ? true : false}">coordinates:</span>
        <input v-model="coordinates" type="text">
    </div>
    <!-- MAP ZOOM -->
    <label v-if="coordinates">
        map zoom: <input style="width: 30px;" v-model="mapZoom" type="number" min="1" max="21">
    </label>
    <iframe
        class="map"
        v-if="coordinates"
        style="border:0;"
        loading="lazy"
        allowfullscreen
        :src="`https://www.google.com/maps/embed/v1/view?key=AIzaSyAzuMuGU3ynDz4KU87IzdKY_pXzhUyILoQ&center=
        ${coordinates}&zoom=${mapZoom}
        &maptype=satellite`"
    />
</template>

<script>
export default {
    emits: ["update:modelValue"],
    props: {
      modelValue: {
          type: Object,
      }
    },
    computed: {
        coordinates: {
            get() {
                return this.modelValue.coordinates
            },
            set(coordinates) {
                const newModelValue = { ...this.modelValue, coordinates }
                this.$emit('update:modelValue', newModelValue)
            }
        },
        mapZoom: {
            get() {
                // return this.modelValue.mapZoom
                return this.modelValue.mapZoom ? this.modelValue.mapZoom : 6
            },
            set(mapZoom) {
                const newModelValue = { ...this.modelValue, mapZoom }
                this.$emit('update:modelValue', newModelValue)
            }
        }
    }
}
</script>