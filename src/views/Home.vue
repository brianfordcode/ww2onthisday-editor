<template>

  <h2>WW2 on this day Editor</h2>

  <edit/>

  <!-- <submitButton/> -->

</template>

<script>
import edit from '../components/edit.vue'
import submitButton from '../components/submit-button.vue'

export default {
  components: {edit, submitButton}
}
</script>

<style scoped>

h2 {
  text-align: center;
  margin: 10px 0;
}

</style>