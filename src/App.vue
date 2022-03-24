<template>

<div style="display: flex; justify-content: space-around;">
  <a href="http://www.ww2onthisday.com" target="_blank" style="margin: 15px auto">
    <img style="width: 300px" src="./assets/ww2-on-this-day-logo.png" alt="ww2-on-this-day-logo">
  </a>
</div>


<router-view/>

</template>

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
  height: 100%;
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

</style>