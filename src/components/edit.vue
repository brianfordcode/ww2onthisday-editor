<template>

<div class="main-container">

  <div class="input-fields">
    <div class="details">
      <!-- DATE -->
      <label for="date">
        <span :class="markDateDone()">date: </span>
        <!-- YEAR -->
        <select v-model="year">
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
        <p :class="markDone(title)" style="text-align: center;">title:</p>
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
          v-model="keywordInput"
          type="text"
          @keyup.enter="addKeyword(keywordInput)"
        >
        <button 
          style="height: 20px; width: 20px"
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
      <label for="coordinates">
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
      />
      <br>

    </div>

    <div class="media" style="display: flex;">
      
      <!-- BOOKS -->
      <div class="books" style="display: flex; flex-direction: column;">
        <div class="book-input-fields" style="display: flex; flex-direction: column;">
          <p style="text-align: center;">Books:</p>
          <!-- BOOK TITLE -->
          <label for="bookTitle">
            <span :class="markDone(bookInput.title)">title:</span><input v-model="bookInput.title" type="text">
          </label>
          <!-- BOOK PICTURE -->
          <div class="book-picture" style="display: flex; flex-direction: column; align-items: flex-end;">
            <label for="bookPicture" >
              <span :class="markDone(bookInput.picture)">picture:</span>
              <input v-model="bookInput.picture" type="text">
            </label>
            <img
              :src="`${bookInput.picture}`"
              :alt="`${bookInput.picture}`"
              style="width: 75px; "
            />
          </div>
          <!-- BOOK YEAR -->
          <label for="bookYear">
            <span :class="markDone(bookInput.year)">year:</span>
            <input v-model="bookInput.year" type="text">
          </label>
          <!-- BOOK LINK -->
          <label for="bookLink">
            <span :class="markDone(bookInput.mediaLink.link)">link:</span>
            <input v-model="bookInput.mediaLink.link" type="text">
          </label>
          <!-- AFFILIATE? -->
          <label for="affiliate" style="display: flex; align-items: center; justify-content: flex-end">
            <span :class="markDone(bookInput.mediaLink.affiliate)">affiliate:</span>
            <input
              style="margin-left: 5px;"
              type="checkbox"
              v-model="bookInput.mediaLink.affiliate"
            >
          </label>
          <!-- AFFILIATE SOURCE -->
          <label for="affiliateSource">
            <span :class="markDone(bookInput.mediaLink.affiliateSource)">affiliate source:</span>
            <!-- AMAZON -->
            <select
              style="margin-left:2px;"
              v-model="bookInput.mediaLink.affiliateSource"
            >
              <option selected>None</option>
              <option>Amazon</option>
              <option>Ebay</option>
              <option>Walmart</option>
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
                <img style="width: 15px;" src="https://cdn0.iconfinder.com/data/icons/glyphpack/45/edit-alt-1024.png" alt="edit-icon">
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
            <span :class="markDone(movieInput.title)">title:</span>
            <input v-model="movieInput.title" type="text">
          </label>
          <!-- MOVIE PICTURE -->
          <div class="movie-picture" style="display: flex; flex-direction: column; align-items: flex-end;">
            <label for="moviePicture" >
              <span :class="markDone(movieInput.picture)">picture:</span>
              <input v-model="movieInput.picture" type="text">
            </label>
            <img
              :src="`${movieInput.picture}`"
              :alt="`${movieInput.picture}`"
              style="width: 75px; "
            />
          </div>
          <!-- MOVIE YEAR -->
          <label for="movieYear">
            <span :class="markDone(movieInput.year)">year:</span>
            <input v-model="movieInput.year" type="text">
          </label>
          <!-- MOVIE LINK -->
          <label for="movieLink">
           <span :class="markDone(movieInput.mediaLink.link)">link:</span>
           <input v-model="movieInput.mediaLink.link" type="text">
          </label>
          <!-- AFFILIATE? -->
          <label for="affiliate" style="display: flex; align-items: center; justify-content: flex-end">
            <span :class="markDone(movieInput.mediaLink.affiliate)">affiliate:</span>
            <input
              style="margin-left: 5px;"
              type="checkbox"
              v-model="movieInput.mediaLink.affiliate"
            >
          </label>
          <!-- AFFILIATE SOURCE -->
          <label for="affiliateSource">
            <span :class="markDone(movieInput.mediaLink.affiliateSource)">affiliate source:</span>
            <!-- AMAZON -->
            <select
              style="margin-left:2px;"
              v-model="movieInput.mediaLink.affiliateSource"
            >
              <option selected>None</option>
              <option>Amazon</option>
              <option>Ebay</option>
              <option>Walmart</option>
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
                <img style="width: 15px;" src="https://cdn0.iconfinder.com/data/icons/glyphpack/45/edit-alt-1024.png" alt="edit-icon">
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ENTER BUTTON -->
    <button
      @click="addEvent()"
      style="margin: 50px 0; padding: 10px;"
    >
    <span>ADD EVENT</span>
    <br>
    <span v-if="showNeedAtLeastADate">Needs a date and title!</span>
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
  data() {
    return {
      showNeedAtLeastADate: false,
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

      //TODO: TRY TO MAKE A COOLER FUNCTION
      // const attributes = Object.keys(getInitialMediaState())
      // let firstAttributes = attributes.filter(e => e != 'id' && e != 'mediaLink');
      // console.log(firstAttributes)
      // for (let i = 0; i < firstAttributes.length; i++) {
      //   let element = firstAttributes[i];
      //   this.bookInput.element = this.books[index].element
      // }

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
      if (this.year === '' || this.month === '' || this.day === '' || this.title === '') {
        this.showNeedAtLeastADate = true;
        setTimeout(() => {
          this.showNeedAtLeastADate = false;
        }, 2000)
      } else {
        this.$store.dispatch('addEvent', fullEvent)
        
        // SAVE DATE
        const year = this.year
        const month = this.month
        const day = this.day

        Object.assign(this.$data, this.$options.data.call(this));
        this.showNeedAtLeastADate = false;

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
      if (this.keywords.length > 0) {
        return 'done'
      }
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
  margin-left: 2px;
}

button {
  cursor: pointer;
}

.books {
  margin-right: 50px;
}

.buttons {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.done {
  background-color: green;
  color: white;
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