<template>

<div
    class="main-container"
    v-for="(event, index) in $store.state.events"
    :key="event"
>
    <div class="event-container">
        <div class="event-details">
            <!-- DATE -->
            <p>date: {{new Date($store.state.events[index].date).toLocaleDateString('en-us', {month:"long", day:"numeric", year: "numeric"})}}</p>
            <!-- TITLE -->
            title: <p>{{$store.state.events[index].title}}</p>
            <!-- CITATION -->
            <p>citation: 
                <a 
                    v-if="$store.state.events[index].citation"
                    :href="`${$store.state.events[index].citation}`"
                    target="_blank"
                >
                &#10003;
                </a>
            </p>
            
            <div style="display: flex; align-items: center">
                <p>main picture:</p>
                <img
                    :src="`${$store.state.events[index].mainPicture}`"
                    :alt="`${$store.state.events[index].mainPicture}`"
                    style="width: 100px;"
                >
            </div>
            <!-- KEYWORDS -->
            <p>keywords: {{$store.state.events[index].keywords}}</p>
            <!-- MAP -->
            <iframe
                class="map"
                v-if="$store.state.events[index].location.coordinates"
                style="border:0; width: 250px; height: 150px;"
                loading="lazy"
                allowfullscreen
                :src="`https://www.google.com/maps/embed/v1/view?key=AIzaSyAzuMuGU3ynDz4KU87IzdKY_pXzhUyILoQ&center=
                ${$store.state.events[index].location.coordinates}&zoom=${$store.state.events[index].location.mapZoom}
                &maptype=satellite`"
            />
        </div>
        <div class="media-container">
            <!-- BOOKS -->
            <p>books:</p>
            <div class="media-wrapper">
                
                <div
                    v-for="book in $store.state.events[index].books"
                    :key="book"
                    class="book media"
                >
                    <img class="media-pic" :src="`${book.picture}`" :alt="`${book.picture}`">
                    <div>
                        <p>title: {{book.title}}</p>
                        <p>year: {{book.year}}</p>
                        <p>link:
                            <a 
                                v-if="book.mediaLink.link"
                                :href="`${book.mediaLink.link}`"
                                target="_blank"
                            >
                            &#10003;
                            </a>
                        </p>
                        <p>affiliate: {{book.mediaLink.affiliate}}</p>
                        <p>affiliate source: {{book.mediaLink.affiliateSource}}</p>
                    </div>
                </div>
            </div>
            <!-- MOVIES -->
            <p>movies:</p>
            <div class="media-wrapper">
                
                <div
                    v-for="movie in $store.state.events[index].movies"
                    :key="movie"
                    class="movie media"
                >
                    <img
                    class="media-pic"
                    :src="`${movie.picture}`"
                    :alt="`${movie.picture}`">
                    <div>
                        <p>title: {{movie.title}}</p>
                        <p>year: {{movie.year}}</p>
                        <p>link:
                            <a 
                                v-if="movie.mediaLink.link"
                                :href="`${movie.mediaLink.link}`"
                                target="_blank"
                            >
                            &#10003;
                            </a>
                        </p>
                        <p>affiliate: {{movie.mediaLink.affiliate}}</p>
                        <p>affiliate source: {{movie.mediaLink.affiliateSource}}</p>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
    <div class="buttons">
        <button @click="deleteEvent(event, index)">&#x2715;</button>
        <button @click="openModal(index)">SUBMIT</button>
        <button @click="editEvent(event)">
            <img style="width: 15px;" src="https://cdn0.iconfinder.com/data/icons/glyphpack/45/edit-alt-1024.png" alt="edit-icon">
        </button>
    </div>
    <!-- MODAL ASKING SURE TO SEND TO FIREBASE -->
    <div
        class="submit-warning-modal"
        v-if="selectedIndex === index"
    >
        <div>
            <p>Publish to Site?</p>
            <div class="modal-btns">
                <p @click="sendToFireBase(event, index)">yes</p>
                <p @click="selectedIndex = null">no</p>
                
            </div>
        </div>
    </div>


</div>
    <!-- MODAL IF SENT TO FIREBASE  -->
    <p
        class="submit-success-modal"
        v-if="submittedEvent"
    >
    Event Submitted!
    </p>


</template>

<script>
export default {
    data() {
        return {
            selectedIndex: null,
            submittedEvent: false,
        }
    },
    methods: {
        deleteEvent(index) {
            this.$store.state.events.splice(index, 1)
        },
        editEvent(event) {
            console.log('edit', event)
            // this.$store.dispatch('editEvent', event)
        },
        openModal(index) {
            this.selectedIndex = index
        },
        sendToFireBase(event, index) {
            this.$store.dispatch('sendToFirebase', event)
            this.submittedEvent = true
            this.selectedIndex = null
            setTimeout(() => {
                    this.submittedEvent = false
                    this.deleteEvent(index)
                }, 2000)
                
        }
    }

}
</script>

<style scoped>

.main-container {
    border: 1px solid;
    width: max-content;
    margin: 0 auto 20px auto;
    position: relative;
}

.event-container {
    display: flex;
    padding: 10px 25px;
}

.event-details {
    max-width: 300px;
    overflow: hidden;
}

a {
    color: black;
    text-decoration: none;
}

.media-container {
    margin-left: 50px;
}

.media-wrapper {
    display: flex;
    flex-wrap: wrap;
}

.media {
    border: 1px solid;
    margin: 5px;
    padding: 2px;
    max-width: 150px;
    overflow: hidden;
}

.media-pic {
    width: auto;
    height: 70px;
    padding-right: 2px;
}

.buttons {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
}

.submit-warning-modal {
    position: absolute;
    top: 0;
    justify-content: space-around;
    align-items: center;
    height: 100%;
    width: 100%;
    display: flex;
    background-color: rgba(95, 0, 0, 0.61);
    color: white;
}

.modal-btns {
    display: flex;
    justify-content: space-around;
}

.modal-btns > * {
    border: 1px solid;
    padding: 0 5px;
    cursor: pointer;
}

.submit-success-modal {
    background-color: green;
    padding: 10px 0;
    opacity: 0.80;
    position: sticky;
    bottom: 0;
    color: white;
    text-align: center
}

button {
  cursor: pointer;
}

@media screen and (max-width: 550px ) {
    .container {
        flex-direction: column;
    }
    .media-container {
        margin-left: 0px;
    }
    .media {
        margin: 0 0 10px 0;
    }
}

</style>