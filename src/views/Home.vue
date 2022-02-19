<template>

  <h2>WW2 on this day Editor</h2>
  
  <edit/>

  <preview/>

  <div
    v-if="$store.state.event[0]" 
    style="display: flex; justify-content: space-around; width: 100%; margin: 50px 0;">
    <button style="width: 300px; height: 50px;">
      ADD ABOVE EVENTS TO SITE
    </button>
  </div>


</template>

<script>
import edit from '../components/edit.vue'
import preview from '../components/preview.vue'

export default {
  components: {edit, preview}

}
</script>

<style scoped>

h2 {
  text-align: center;
  margin: 10px 0;
}
</style>