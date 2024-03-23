<template>

test
<!-- START WORK AGAIN -->
<div class="main-container">

  <!-- DATE -->
  <dateEditor @update="getDateString" :dateString="date"/>

  <div class="input-fields" v-if="this.$route.name === 'Home'">

    <div class="details">
      <!-- TITLE -->
      <label for="title" >
        <p :class="{'done': title ? true : false}" style="text-align: center;">event text:</p>
        <textarea class="textarea" v-model="title"/>
      </label>
      <p
      class="showBtn"
      @click="infoShow = !infoShow"
      >
      {{ infoShow ? 'hide' : 'show'}} info editor
        <img
          :style="`height: 15px; margin-left: 2px; transform: rotate( ${infoShow ? '180deg' : '0deg'})`"
          src="https://img.icons8.com/external-kmg-design-glyph-kmg-design/32/000000/external-minimize-arrow-kmg-design-glyph-kmg-design-1.png"
        />
      </p>
      <div :style="`display: ${infoShow ? 'flex' : 'none'}; flex-direction: column`">
          <!-- CITATION -->
          <label for="citation">
          <span :class="{'done': citation ? true : false}">citation:</span>
          <input v-model="citation" type="text">
          <button style="height: 22px; padding: 2px; width: 20px; border-left: none;" @click="citation=''">&#x2715;</button>
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
          <keywordEditor @addKeywords="k => keywords.push(k)" :keywords="keywords"/>
          <br>
          <!-- LOCATION -->
          <mapEditor @update:modelValue="l => location = l" :modelValue="location" />
        </div>
    </div>
    <br>
    <!-- MEDIA -->
    <p
      class="showBtn"
      @click="mediaShow = !mediaShow"
      :style="`margin-bottom: ${mediaShow ? '0px' : '10px'}`"
    >
    {{ mediaShow ? 'hide' : 'show'}} media editor
      <img
        :style="`height: 15px; margin-left: 2px; transform: rotate( ${mediaShow ? '180deg' : '0deg'})`"
        src="https://img.icons8.com/external-kmg-design-glyph-kmg-design/32/000000/external-minimize-arrow-kmg-design-glyph-kmg-design-1.png"
      />
    </p>
    <div class="media" :style="`display: ${mediaShow ? 'flex' : 'none'}; margin-bottom: 20px;`">
      <mediaEditor :media="books" title='Books' />
      <mediaEditor :media="movies" title='Movies'/>
    </div>
    <!-- ENTER BUTTON -->
    <button
      @click="addEvent()"
      style="padding: 10px;"
      v-if="!editEventId"
    >
    ADD NEW EVENT
    <br>
    <span v-if="needsDateTextPicture">Needs a date and event text!</span>
    </button>
    </div>
</div>

<!-- PREVIEW COMPONENT -->
<preview @editEvent="editEvent" :date="date" @clearForm="clearForm" @updateEvent="addEvent" @clearCitation="citation = ''"/>

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
      mediaShow: false,
      infoShow: false,
      needsDateTextPicture: false,
      // INPUTS:
      date: '',
      title: '',
      citation: '',
      mainPicture: '',
      location: {
        coordinates: '',
        mapZoom: 6
      },
      keywords: [],
      books: [],
      movies: [],
      published: null,
      editEventId: null
    }
  },
  methods: {
    addEvent() {
      const fullEvent = {
        date: this.date,
        id: this.editEventId || "event-" + this.date + '-' + Date.now(),
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
        movies: this.movies,
        published: this.published ? true : false
      }
      // Required details
      if (this.date === '' || this.title === '') {
        this.needsDateTextPicture = true;
        setTimeout(() => {
          this.needsDateTextPicture = false;
        }, 2000)
      } else {
        this.$store.dispatch('addEvent', fullEvent)
        if (this.editEventId != null) {
          this.citation = ''
        } 
        this.clearForm()
      }
    },
    clearForm() {
        const keepDate = this.date
        const keepCitation = this.citation
        Object.assign(this.$data, this.$options.data.call(this));
        this.date = keepDate
        this.citation = keepCitation
    },
    getDateString(d) {
      this.date = d
      this.$store.dispatch('getDBEvents', this.date)
    },
    editEvent(event) {
      // INJECT DATA FROM PREVIEW WHEN EDIT IS PUSHED
      this.editEventId = event.id
      this.title = event.title
      this.date = event.date
      this.citation = event.citation
      this.mainPicture = event.mainPicture
      this.keywords = event.keywords
      this.location.coordinates = event.location.coordinates
      this.location.mapZoom = event.location.mapZoom
      this.books = event.books
      this.movies = event.movies
      this.published = event.published
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

.showBtn {
  cursor: pointer;
  display: flex;
  align-items: center;
  opacity: 0.5;
  width: max-content;
}

.showBtn:hover {
  opacity: 1;
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