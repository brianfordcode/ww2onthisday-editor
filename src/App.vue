<template>

  <div style="position: absolute; margin:3px; font-size:12px;">

    <p>last date edited:</p>
    <b>{{ this.$store.state.dateMark }}</b>
    <!-- <p>new date:</p>
    <input type="text" style="width: 75px; box-sizing: border-box; margin: 0" v-model="inputValue">
    <br>
    <button style="padding: 2px;" @click="markDate">save</button> -->

  </div>


  <div style="display: flex; justify-content: space-around;">
    <a href="http://www.ww2onthisday.com" target="_blank" style="margin: 15px auto">
      <img style="width: 250px" src="./assets/ww2-on-this-day-logo.png" alt="ww2-on-this-day-logo">
    </a>
  </div>


  <router-view/>

  <!-- SCROLL TO TOP -->
  <img
      src="https://cdn.onlinewebfonts.com/svg/img_158933.png"
      alt="to-top-icon"
      class="to-top-icon"
      @click="goToTop()"
  >

</template>

<script>

export default {
  data() {
    return {
      inputValue: '',
    }
  },
  mounted() {
    this.$store.dispatch('fetchDate')
  },
  methods: {
    goToTop() {
      window.scrollTo(0,0);
    },
    // markDate() {
    //   const dateWritten = {
    //     dateMarked: this.inputValue
    //   }

    //   if (this.inputValue != '') {
    //     this.$store.dispatch('markDate', dateWritten )
    //   }
      
    //   this.inputValue = ''

    // }
  }
}

</script>


<style>

* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

input {
  border: 1px solid;
  opacity: .75;
}

input:focus {
  border: 2px solid;
  outline: none;
}

textarea {
  border: 1px solid;
  opacity: .75;
}

textarea:focus {
  outline: none;
  border: 2px solid;
}

button {
  outline: none;
  border: 1px solid;
  opacity: .75;
  background-color: rgb(238, 238, 238);
}

select {
  outline: none;
  border: 1px solid;
  border-right: none;
  height: 22px;
}

.to-top-icon {
  height: 40px;
  opacity: .25;
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 20px;
  cursor: pointer;
}

.to-top-icon:hover {
  opacity: 1;
}

</style>