<template>

  <h1>WW2 on this day Editor</h1>

  <edit/>

  <p>{{$store.state.event}}</p>

</template>

<script>
import edit from '../components/edit.vue'
export default {
  components: {edit}

}
</script>

<style scoped>

h1 {
  text-align: center;
  margin: 20px 0;
}
</style>