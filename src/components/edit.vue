<template>

<div class="main-container">

  <div class="input-fields">
    <div class="details">

      <dateEditor @addDate="addDate"/>

      <!-- TITLE -->
      <label for="title" >
        <p :class="{'done': title ? true : false}" style="text-align: center;">event text:</p>
        <textarea class="textarea" v-model="title"/>
      </label>
      
      <!-- CITATION -->
      <label for="citation">
       <span :class="{'done': citation ? true : false}">citation:</span>
       <input v-model="citation" type="text">
      </label>
      
      <!-- MAIN PICTURE -->
      <label for="mainPicture">
        <span :class="{'done': mainPicture ? true : false}">main picture link:</span>
        <input v-model="mainPicture" type="text">
        <img
          v-if="mainPicture"
          style="width: 200px;" :src="`${mainPicture}`" :alt="`${mainPicture}`">
      </label>

      <!-- KEYWORDS -->
      <keywordEditor @addKeywords="addKeywords" :keywords="keywords"/>
      
      <br>

      <!-- LOCATION -->
      <mapEditor @addMapDetails="addMapDetails"/>

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
import keywordEditor from './edit-components/keyword-editor.vue'
import dateEditor from './edit-components/date-editor.vue'

export default {
  components: { preview, mediaEditor, mapEditor, keywordEditor, dateEditor },
  data() {
    return {
      needsDateTextPicture: false,
      // INPUTS:
      date: '',
      title: '',
      citation: '',
      mainPicture: '',
      location: {},
      keywords: [],
      books: [],
      movies: [],
      // DATA:
      events: []
    }
  },
  methods: {
    addKeywords(keywords) {
      this.keywords = keywords
    },
    addMapDetails(mapDetails) {
      this.location = mapDetails
    },
    addDate(date) {
      this.date = date
    },
    addEvent() {
      console.log(this.date)


      const fullEvent = {
        date: this.date,
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
      if (this.date === '' || this.title === '' || this.mainPicture === '') {
        this.needsDateTextPicture = true;
        setTimeout(() => {
          this.needsDateTextPicture = false;
        }, 2000)
      } else {
        this.$store.dispatch('addEvent', fullEvent)

        Object.assign(this.$data, this.$options.data.call(this));
        this.needsDateTextPicture = false;

      }
    },
    updateDataFromPreview(event) {

      console.log(event.date)

      let dateObject = this.$store.getters.getDatefromHashDate(event.date)
      this.year = dateObject.getFullYear()
      this.month = (dateObject.getMonth() < 10 ? '0' : '') + (dateObject.getMonth() + 1)
      this.day = (dateObject.getDate() < 10 ? '0' : '') + (dateObject.getDate())

      // TODO: GET DATE TO REPOPULATE INTO DATEEDITOR CHILD COMPONENT

      // INJECT DATA FROM PREVIEW WHEN EDIT IS PUSHED
      this.title = event.title
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