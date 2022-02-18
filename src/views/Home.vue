<template>

  <h2>WW2 on this day Editor</h2>
  
  <edit/>

  <preview/>

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