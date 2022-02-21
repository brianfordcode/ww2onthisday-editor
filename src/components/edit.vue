<template>

<div class="main-container">

  <div class="input-fields">
    <div class="details">
      <!-- DATE -->
      <label for="date">
        <span :class="markDateDone()">date:</span>
        <!-- YEAR -->
        <select style="margin-left: 2px;" v-model="year">
          <option disabled selected>YEAR</option>
          <option
            v-for="year in 7"
            :key="year">
            {{year ? year + 1938 : year}}
          </option>
        <!-- MONTH -->
        </select>
        <select v-model="month">
          <option disabled selected>MONTH</option>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
        <!-- DAY -->
        <select v-model="day">
          <option disabled selected>DAY</option>
          <option
            v-for="day in 31"
            :key="day"
          >
          {{ (day < 10 ? '0' : '') + day }}
          </option>
        </select>
        <button @click="clearDate()">&#x2715;</button>
      </label>

      <!-- TITLE -->
      <label for="title" >
        <p :class="markDone(title)" style="text-align: center;">event text:</p>
        <textarea class="textarea" v-model="title"/>
      </label>
      
      <!-- CITATION -->
      <label for="citation">
       <span :class="markDone(citation)">citation:</span>
       <input v-model="citation" type="text">
      </label>
      
      <!-- MAIN PICTURE -->
      <label for="mainPicture">
        <span :class="markDone(mainPicture)">main picture link:</span>
        <input v-model="mainPicture" type="text">
        <img
          style="width: 200px;" :src="`${mainPicture}`" :alt="`${mainPicture}`">
      </label>
        
      <!-- KEYWORDS -->
      <label for="keywords">
        <span :class="markKeywordsDone()">keywords:</span>
        <input
          style="width: 125px;"
          v-model="keywordInput"
          type="text"
          @keyup.enter="addKeyword(keywordInput)"
        >
        <button 
          style="height: 24px; width: 20px"
          @click="addKeyword(keywordInput)"
        >
        &#43;
        </button>
      </label>
      <div
        v-for="(keyword, index) in keywords"
        :key="keyword"
      >
        <p>
          {{ keyword }}
          <button
            @click="keywords.splice(index, 1)"
          >
          &#x2715;
          </button>
        </p>
      </div>
      <br>

      <!-- LOCATION -->
      <!-- <label for="coordinates">
        <span :class="markDone(location.coordinates)">coordinates:</span>
        <input v-model="location.coordinates" type="text">
      </label>
      <label for="mapZoom">
        map zoom: <input style="width: 30px;" v-model="location.mapZoom" type="number" min="1" max="21">
      </label>
      <iframe
        class="map"
        v-if="location.coordinates"
        style="border:0;"
        loading="lazy"
        allowfullscreen
        :src="`https://www.google.com/maps/embed/v1/view?key=AIzaSyAzuMuGU3ynDz4KU87IzdKY_pXzhUyILoQ&center=
        ${location.coordinates}&zoom=${location.mapZoom}
        &maptype=satellite`"
      /> -->

      <!-- <mapEditor location: "location" /> -->
      <mapEditor :locationInput="location"/>

    </div>

    <br>
    <!-- MEDIA -->

    <div class="media" style="display: flex;">
      <mediaEditor :media="books" title='Books' />
      <mediaEditor :media="movies" title='Movies'/>
    </div>

    <!-- ENTER BUTTON -->
    <button
      @click="addEvent()"
      style="margin: 50px 0; padding: 10px;"
    >
    <span>ADD EVENT</span>
    <br>
    <span v-if="needsDateTextPicture">Needs a date, event text and picture!</span>
    </button>
    </div>
</div>


<!-- PREVIEW COMPONENT -->
<preview @getEventData="updateDataFromPreview"/>

</template>

<script>
import preview from './preview.vue'
import mediaEditor from './edit-components/media-editor.vue'
import mapEditor from './edit-components/map-editor.vue'

export default {
  components: { preview, mediaEditor, mapEditor },
  data() {
    return {
      needsDateTextPicture: false,
      bookDetailsNeeded: false,
      movieDetailsNeeded: false,
      // INPUTS:
      year: '',
      month: '',
      day: '',
      title: '',
      citation: '',
      mainPicture: '',
      location: {
        coordinates: '',
        mapZoom: 6,
      },
      keywordInput: '',
      keywords: [],
      books: [],
      movies: [],
      // DATA:
      events: []
    }
  },
  methods: {
    addKeyword() {
      if (this.keywordInput === '') { return }
      this.keywords.push(this.keywordInput)
      this.keywordInput = ''
    },
    addEvent() {
      const fullEvent = {
        date: this.year + "-" + this.month + "-" + this.day,
        id: "event-" + Date.now(),
        timeEventSubmitted: new Date(),
        title: this.title,
        mainPicture: this.mainPicture,
        citation: this.citation,
        location: {
          coordinates: this.location.coordinates,
          mapZoom: this.location.mapZoom
        },
        keywords: this.keywords,
        books: this.books,
        movies: this.movies
      }
      if (this.year === '' || this.month === '' || this.day === '' || this.title === '' || this.mainPicture === '') {
        this.needsDateTextPicture = true;
        setTimeout(() => {
          this.needsDateTextPicture = false;
        }, 2000)
      } else {
        this.$store.dispatch('addEvent', fullEvent)

        // SAVE DATE
        const year = this.year
        const month = this.month
        const day = this.day

        Object.assign(this.$data, this.$options.data.call(this));
        this.needsDateTextPicture = false;

        // KEEP SAME DATE FOR NEXT EVENT
        this.year = year
        this.month = month
        this.day = day

      }
      // TODO: TRY TO MAKE DATE INPUT THE SAME DATE
    },
    clearDate() {
      this.year = ''
      this.month = ''
      this.day = ''
    },
    markDateDone() {
      if (this.year != '' && this.month != '' && this.day != '') {
        return 'done'
      }
    },
    markDone(data) {
      if (data && data != 'keywordInput') {
        return 'done'
      }
    },
    markKeywordsDone() {
      if (this.keywords.length) {
        return 'done'
      }
    },
    updateDataFromPreview(event) {

      let dateObject = this.$store.getters.getDatefromHashDate(event.date)

      // INJECT DATA FROM PREVIEW WHEN EDIT IS PUSHED
      this.title = event.title
      this.year = dateObject.getFullYear()
      this.month = (dateObject.getMonth() < 10 ? '0' : '') + (dateObject.getMonth() + 1)
      this.day = (dateObject.getDate() < 10 ? '0' : '') + (dateObject.getDate())
      this.citation = event.citation
      this.mainPicture = event.mainPicture
      this.keywords = event.keywords
      this.location.coordinates = event.location.coordinates
      this.location.mapZoom = event.location.mapZoom
      this.books = event.books
      this.movies = event.movies

    }
  },
}
</script>

<style>

.done {
  background-color: green;
  color: white;
}

label {
  margin: 3px 0;
}

button {
  cursor: pointer;
}

input {
  padding-left: 2px;
  height: 20px;
  margin-left: 2px;
}

</style>

<style scoped>

.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.details {
  display: flex;
  flex-direction: column;
  width: min-content;
  margin: 0 auto;
}

.input-fields {
  display: flex;
  flex-direction: column;
  text-align: right;
  justify-content: space-around;
}

.textarea {
  max-width: 272.22px;
  min-width: 272.22px;
  min-height: 100px;
  max-height: 400px;
  padding: 3px;
}

label {
  margin: 3px 0;
}

.media > * {
  margin: 0 20px;
}

@media screen and (max-width:550px) {
  .media {
    width: 100%;
    align-items: center;
    flex-direction: column;
  }

  .books {
    margin-bottom: 20px;
    margin-right: 0px;
  }

  .movies {
    margin-right: 0px;
  }

}

</style>