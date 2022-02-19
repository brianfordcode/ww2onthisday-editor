<template>

  <h2>WW2 on this day Editor</h2>
  
  <edit/>

  <preview/>

  <submitButton/>

</template>

<script>
import edit from '../components/edit.vue'
import preview from '../components/preview.vue'
import submitButton from '../components/submit-button.vue'

export default {
  components: {edit, preview, submitButton}
}
</script>

<style scoped>

h2 {
  text-align: center;
  margin: 10px 0;
}
</style>