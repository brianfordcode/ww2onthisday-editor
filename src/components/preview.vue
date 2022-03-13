<template>

<!-- PUBLISHED/UNPUBLISHED FILTER -->
<div style="display: flex; align-items: center; margin: 0 auto 15px auto; width: max-content;">
    <h4 style="padding-right: 5px;">
    {{published ? '' : 'Not'}} Published
    </h4>
    <button class="published-btns"
        @click="toggleFBEvents"
    >
    click for {{published ? 'un' : ''}}published events
    </button>
</div>

<div :style="`border: 10px solid ${published ? 'rgba(3, 95, 30, 0.5)': 'rgba(95, 0, 0, 0.5)'}; padding: 10px 30px; width: min-content; margin: 0 auto`">
    <div
        class="main-container"
        v-for="id in $store.getters.filteredEvents(date, published)"
        :key="id"
    >
        <div class="event-container">
            <div class="event-details">
                <!-- DATE -->
                <p>date: {{ $store.getters.getDatefromHashDate(getEvent(id).date).toLocaleDateString('en-us', {month:"long", day:"numeric", year: "numeric"}) }}</p>
                <!-- TITLE -->
                title: <p>{{getEvent(id).title}}</p>
                <!-- CITATION -->
                <p>citation: 
                    <a 
                        v-if="getEvent(id).citation"
                        :href="`${getEvent(id).citation}`"
                        target="_blank"
                    >
                    &#10003;
                    </a>
                </p>
                
                <div style="display: flex; align-items: center">
                    <p>main picture:</p>
                    <img
                        :src="`${getEvent(id).mainPicture}`"
                        :alt="`${getEvent(id).mainPicture}`"
                        style="width: 100px;"
                    >
                </div>
                <!-- KEYWORDS -->
                <p>keywords: {{getEvent(id).keywords}}</p>
                <!-- MAP -->
                <iframe
                    class="map"
                    v-if="getEvent(id).location.coordinates"
                    style="border:0; width: 250px; height: 150px;"
                    loading="lazy"
                    allowfullscreen
                    :src="`https://www.google.com/maps/embed/v1/view?key=AIzaSyAzuMuGU3ynDz4KU87IzdKY_pXzhUyILoQ&center=
                    ${getEvent(id).location.coordinates}&zoom=${getEvent(id).location.mapZoom}
                    &maptype=satellite`"
                />
            </div>
            <div class="media-container">
                <!-- BOOKS -->
                <p>books:</p>
                <previewMediaList :media="getEvent(id).books"/>
                <!-- MOVIES -->
                <p>movies:</p>
                <previewMediaList :media="getEvent(id).movies"/>
            </div>
        </div>
        <div class="buttons">
            <button @click="openDeleteOverlay(id)">&#x2715;</button>
            <button @click="openPublishOverlay(id)" v-if="getEvent(id).published === false">Publish To Site</button>
            <button @click="editEvent(id)">
                <img
                    style="width: 15px;"
                    src="https://cdn0.iconfinder.com/data/icons/glyphpack/45/edit-alt-1024.png"
                    alt="edit-icon">
            </button>
        </div>

    <!-- OVERLAYS -->
        <!-- PUBLISH OVERLAY -->
        <div
            class="overlay"
            style="background-color: rgba(3, 95, 30, 0.61);"
            v-if="selectedId === id && publishPushed"
        >
            <p class="overlay-btn" @click="publishEvent(id)">Publish to Site</p>
            <div
                class="closeBtn"
                @click="resetOverlays()"
            >
            &#10005;
            </div>
        </div>
        <!-- DELETE OVERLAY -->
        <div
            class="overlay"
            style="background-color: rgba(95, 0, 0, 0.61);"
            v-if="selectedId === id && deletePushed"
        >
            <p class="overlay-btn" @click="deleteEvent(id)">Delete this Event</p>
            <div
                class="closeBtn"
                @click="resetOverlays()"
            >
            &#10005;
            </div>
        </div>
        <!-- EDIT OVERLAY -->
        <div
            class="overlay"
            style="background-color: rgba(16, 0, 161, 0.5);"
            v-if="selectedId === id && editPushed"
        >
            <p class="overlay-btn">This Event is Being Edited</p>
            <div
                class="closeBtn"
                @click="resetOverlays()"
            >
            &#10005;
            </div>
        </div>

    </div>

</div>
    <!-- OVERLAY IF EVENT SENT TO FIREBASE -->
    <p
        class="action-overlay"
        style="background-color: green;"
        v-if="submittedEvent"
    >
    Event Submitted!
    </p>
    <!-- OVERLAY IF EVENT DELETED -->
    <p
        class="action-overlay"
        style="background-color: red;"
        v-if="deletedEvent"
    >
    Event Deleted!
    </p>

</template>

<script>
import previewMediaList from './edit-components/preview-media-list.vue'

function overlayInitialState() {
  return {
    publishPushed: false,
    submittedEvent: false,
    deletePushed: false,
    deletedEvent: false,
    editPushed: false,
    
    }
  }

export default {
    emits: ["editEvent"],
    components: { previewMediaList },
    data() {
        return {
            ...overlayInitialState(),
            published: false,
            selectedId: null,
        }
    },
    props: {
        date: {
            type: String,
            required: true,
        }
    },
    computed: {
        eventIdsToShow() {
            return this.$store.getters.eventsToShow(this.published)
        },
        eventsToShow() {
            return this.eventIdsToShow.map(id => this.$store.getters.event(id))
        }
    },
    methods: {
        resetOverlays() {
            Object.assign(this.$data, overlayInitialState());
        },
        getEvent(id) {
            return this.$store.getters.event(id)
        },
        openDeleteOverlay(id) {
            this.resetOverlays()
            this.selectedId = id
            this.deletePushed = true
        },
        deleteEvent(id) {
            this.$store.dispatch('deleteEvent', id)
            this.deletedEvent = true
            this.deletePushed = false
            setTimeout(() => {
                this.deletedEvent = false
            }, 2000)
        },
        editEvent(id) {
            this.resetOverlays()
            this.$emit('editEvent', this.$store.getters.event(id))
            this.selectedId = id
            this.editPushed = true
            console.log(this.editPushed)
        },
        openPublishOverlay(id) {
            this.resetOverlays()
            this.selectedId = id
            this.deletePushed = false
            this.publishPushed = true
        },
        publishEvent(id) {
            this.$store.dispatch('publishEvent', id)
            this.resetOverlays()
            this.submittedEvent = true
            setTimeout(() => {
                this.submittedEvent = false
            }, 2000)
        },
        toggleFBEvents() {
            this.deletePushed = false
            this.published = !this.published
        },
    }

}
</script>

<style scoped>

.published-btns {
    padding: 5px;
}

.main-container {
    border: 1px solid black;
    width: max-content;
    height: max-content;
    position: relative;
}
.main-container:not(:last-child) {
    margin-bottom: 10px;
}

.event-container {
    display: flex;
    padding: 10px 25px;

}

.event-details {
    max-width: 300px;
    overflow: hidden;
}

.media-container {
    margin-left: 50px;
}

.buttons {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
}

.overlay {
    position: absolute;
    top: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100%;
    width: 100%;
    display: flex;
    color: white;
}

.overlay-btn {
    border: 1px solid;
    padding: 0 5px;
    cursor: pointer;
}

.closeBtn {
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px;
    cursor: pointer;
    font-size: 20px;
}

.action-overlay {
    background-color: green;
    padding: 10px 0;
    opacity: 0.80;
    position: sticky;
    bottom: 0;
    color: white;
    text-align: center;
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