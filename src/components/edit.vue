<template>

<div class="main-container">

  <div class="input-fields">
    <div class="details">
      <!-- DATE -->
      <label for="date">
        date:
        <!-- YEAR -->
        <select v-model="year">
          <option disabled selected>YEAR</option>
          <option
            v-for="year in 7"
            :key="year">
            {{year + 1938}}
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
          <option>day</option>
          <option
            v-for="day in 31"
            :key="day"
          >
          {{ (day < 10 ? '0' : '') + day }}
          </option>
        </select>
      </label>

      <!-- TITLE -->
      <label for="title">
        <p style="text-align: center;">title:</p>
        <textarea class="textarea" v-model="title"/>
      </label>
      
      <!-- CITATION -->
      <label for="citation">
        citation: <input v-model="citation" type="text">
      </label>
      
      <!-- MAIN PICTURE -->
      <label for="mainPicture">
        main picture link: <input v-model="mainPicture" type="text">
        <img
          style="width: 200px;" :src="`${mainPicture}`" :alt="`${mainPicture}`">
      </label>
        
      <br>

      <!-- LOCATION -->
      <p style="text-align: center;">location:</p>
      <label for="coordinates">
        coordinates: <input v-model="location.coordinates" type="text">
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
      />
      <br>

      <!-- KEYWORDS -->
      <label for="keywords">
        keywords: <input v-model="keywordInput" type="text">
        <button @click="addKeyword(keywordInput)">&#43;</button>
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
    </div>

    <div class="media" style="display: flex;">
      
      <!-- BOOKS -->
      <div class="books" style="display: flex; flex-direction: column;">
        <div class="book-input-fields" style="display: flex; flex-direction: column;">
          <p style="text-align: center;">Books:</p>
          <!-- BOOK TITLE -->
          <label for="bookTitle">
            title: <input v-model="bookInput.title" type="text">
          </label>
          <!-- BOOK PICTURE -->
          <div class="book-picture" style="display: flex; flex-direction: column; align-items: flex-end;">
            <label for="bookPicture" >
              picture: <input v-model="bookInput.picture" type="text">
            </label>
            <img
              :src="`${bookInput.picture}`"
              :alt="`${bookInput.picture}`"
              style="width: 75px; "
            />
          </div>
          <!-- BOOK YEAR -->
          <label for="bookYear">
            year: <input v-model="bookInput.year" type="text">
          </label>
          <!-- MEDIA LINK -->
          <p style="text-align: center;">Media Link:</p>
          <!-- BOOK LINK -->
          <label for="bookLink">
            link: <input v-model="bookInput.mediaLink.link" type="text">
          </label>
          <!-- AFFILIATE? -->
          <label for="affiliate" style="display: flex; align-items: center; justify-content: flex-end">
            affiliate:
            <input
              style="margin-left: 5px;"
              type="checkbox"
              v-model="bookInput.mediaLink.affiliate"
            >
          </label>
          <!-- AFFILIATE SOURCE -->
          <label for="affiliateSource">
            affiliate source:
            <!-- AMAZON -->
            <select
              v-model="bookInput.mediaLink.affiliateSource"
            >
              <option disabled selected>SOURCE</option>
              <option>Amazon</option>
              <option>Ebay</option>
              <option>Other</option>
            </select>
            <br>
          </label>
          <!-- ENTER BUTTON -->
          <button
            @click="enterBook()"
            style="margin-top: 10px;"
          >
          &#43;
          </button>
        </div>
        <!-- LIST -->
        <div
          class="book-list"
          v-for="(book, index) in books"
          :key="book"
          style="margin-top: 10px; overflow-wrap: break-word"
        >
          <div class="book-details" style="display: flex; flex-direction: column; align-items: flex-end; border: 1px solid">
            <p>id: {{book.id}}</p>
            <p style="width: 207.36px; overflow-wrap: break-word">title: {{book.title}}</p>
            <img
              :src="`${book.picture}`"
              :alt="`${book.picture}`"
              style="width: 75px;"
            />
            <p>year: {{book.year}}</p>
            <p style="width: 207.36px; overflow-wrap: break-word">link:{{book.mediaLink.link}}</p>
            <p>affiliate: {{book.mediaLink.affiliate}}</p>
            <p>affiliate source: {{book.mediaLink.affiliateSource}}</p>
            <div class="buttons">
              <!-- DELETE BOOK -->
              <button
                @click="books.splice(index, 1)"
              >
              &#x2715;
              </button>
              <!-- EDIT BOOK -->
              <button
                @click="editBook(index)"
              >
              Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- MOVIES -->
      <div id="movies" class="movies" style="display: flex; flex-direction: column;">
        <div class="movie-input-fields" style="display: flex; flex-direction: column;">
          <p style="text-align: center;">Movies:</p>
          <!-- MOVIE TITLE -->
          <label for="movieTitle">
            title: <input v-model="movieInput.title" type="text">
          </label>
          <!-- MOVIE PICTURE -->
          <div class="movie-picture" style="display: flex; flex-direction: column; align-items: flex-end;">
            <label for="moviePicture" >
              picture: <input v-model="movieInput.picture" type="text">
            </label>
            <img
              :src="`${movieInput.picture}`"
              :alt="`${movieInput.picture}`"
              style="width: 75px; "
            />
          </div>
          <!-- MOVIE YEAR -->
          <label for="movieYear">
            year: <input v-model="movieInput.year" type="text">
          </label>
          <!-- MEDIA LINK -->
          <p style="text-align: center;">Media Link:</p>
          <!-- MOVIE LINK -->
          <label for="movieLink">
            link: <input v-model="movieInput.mediaLink.link" type="text">
          </label>
          <!-- AFFILIATE? -->
          <label for="affiliate" style="display: flex; align-items: center; justify-content: flex-end">
            affiliate:
            <input
              style="margin-left: 5px;"
              type="checkbox"
              v-model="movieInput.mediaLink.affiliate"
            >
          </label>
          <!-- AFFILIATE SOURCE -->
          <label for="affiliateSource">
            affiliate source:
            <!-- AMAZON -->
            <select
              v-model="movieInput.mediaLink.affiliateSource"
            >
              <option disabled selected>SOURCE</option>
              <option>Amazon</option>
              <option>Ebay</option>
              <option>Other</option>
            </select>
            <br>
          </label>
          <!-- ENTER MOVIE BUTTON -->
          <button
            @click="enterMovie()" 
            style="margin-top: 10px;"
          >
          &#43;
          </button>
        </div>
        <!-- LIST -->
        <div
          class="movie-list"
          v-for="(movie, index) in movies"
          :key="movie"
          style="margin-top: 10px; overflow-wrap: break-word"
        >
          <div class="movie-details" style="display: flex; flex-direction: column; align-items: flex-end; border: 1px solid;">
            <p>id: {{movie.id}}</p>
            <p style="width: 207.36px; overflow-wrap: break-word">title: {{movie.title}}</p>
            <img
              :src="`${movie.picture}`"
              :alt="`${movie.picture}`"
              style="width: 75px;"
            />
            <p>year: {{movie.year}}</p>
            <p style="width: 207.36px; overflow-wrap: break-word">link:{{movie.mediaLink.link}}</p>
            <p>affiliate: {{movie.mediaLink.affiliate}}</p>
            <p>affiliate source: {{movie.mediaLink.affiliateSource}}</p>
            <div class="buttons">
              <!-- DELETE MOVIE -->
              <button
                @click="movies.splice(index, 1)"
              >
              &#x2715;
              </button>
              <!-- EDIT BOOK -->
              <button
                @click="editMovie(index)"
              >
              Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ENTER BUTTON -->
    <button
      @click="enterEvent()"
      style="margin-top: 50px;"
    >
    ENTER
    </button>
    </div>
</div>

</template>

<script>

const getInitialMediaState = () => ({
  id: '',
  title: '',
  picture: '',
  year: '',
  mediaLink: {
    link: '',
    affiliate: null,
    affiliateSource: ''
  }
})

export default {
  name: 'Home',
  components: { },
  data() {
    return {
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
      bookInput: getInitialMediaState(),
      movies: [],
      movieInput: getInitialMediaState(),
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
    enterBook() {
        const obj = {
          id: "book-" + Date.now(),
          title: this.bookInput.title,
          picture: this.bookInput.picture,
          year: this.bookInput.year,
          mediaLink: {
            link: this.bookInput.mediaLink.link,
            affiliate: this.bookInput.mediaLink.affiliate ? this.bookInput.mediaLink.affiliate : false,
            affiliateSource: this.bookInput.mediaLink.affiliateSource,
          }
        }
        this.books.push(obj)
        Object.assign(this.$data.bookInput, getInitialMediaState());
    },
    editBook(index) {
      this.bookInput.id = this.books[index].id
      this.bookInput.title = this.books[index].title
      this.bookInput.picture = this.books[index].picture
      this.bookInput.year = this.books[index].year
      this.bookInput.mediaLink.link = this.books[index].mediaLink.link
      this.bookInput.mediaLink.affiliate = this.books[index].mediaLink.affiliate
      this.bookInput.mediaLink.affiliateSource = this.books[index].mediaLink.affiliateSource

      this.books.splice(index, 1)
    },
    enterMovie() {
      const obj = {
        id: "movie-" + Date.now(),
        title: this.movieInput.title,
        picture: this.movieInput.picture,
        year: this.movieInput.year,
        mediaLink: {
          link: this.movieInput.mediaLink.link,
          affiliate: this.movieInput.mediaLink.affiliate ? this.movieInput.mediaLink.affiliate : false,
          affiliateSource: this.movieInput.mediaLink.affiliateSource,
        }
      }
      this.movies.push(obj)
      Object.assign(this.$data.movieInput, getInitialMediaState());
    },
    editMovie(index) {
      this.movieInput.id = this.movies[index].id
      this.movieInput.title = this.movies[index].title
      this.movieInput.picture = this.movies[index].picture
      this.movieInput.year = this.movies[index].year
      this.movieInput.mediaLink.link = this.movies[index].mediaLink.link
      this.movieInput.mediaLink.affiliate = this.movies[index].mediaLink.affiliate
      this.movieInput.mediaLink.affiliateSource = this.movies[index].mediaLink.affiliateSource

      this.movies.splice(index, 1)
    },
    enterEvent() {
      const fullEvent = {
        date: this.year + "-" + this.month + "-" + this.day,
        id: "event-" + Date.now(),
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

      this.$store.dispatch('addEvent', fullEvent)

      Object.assign(this.$data, this.$options.data.call(this));

    }
  },
}
</script>

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

input {
  height: 20px;
}

.books {
  margin-right: 50px;
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