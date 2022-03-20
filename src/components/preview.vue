<template>
<!-- PUBLISHED/UNPUBLISHED FILTER -->
<div style="display: flex; align-items: center; margin: 20px auto 0 auto; width: max-content;">
    <h4
        :style="`padding: 10px; background-color: ${published ? 'rgba(3, 95, 30, 0.5)': 'white'}; cursor: pointer;`"
        @click="showPubandUnpubEvents"
    >
    Published
    </h4>
    <h4
        :style="`padding: 10px; background-color: ${!published ? 'rgba(95, 0, 0, 0.5)': 'white'}; cursor: pointer;`"
        @click="showPubandUnpubEvents"
    >
    Unpublished
    </h4>
</div>
<div
    v-if="Object.keys($store.state.events).length > 0"
    class="all-events"
    :style="`background-color: ${published ? 'rgba(3, 95, 30, 0.5)': 'rgba(95, 0, 0, 0.5)'};`"
>
    
    <div
        class="main-container"
        v-for="id in events"
        :key="id"
    >
        <div class="event-container">
            <div class="event-details">
                <!-- DATE -->
                <p><span style="font-weight: bold">date:</span> {{ getEvent(id).date }}</p>
                <!-- TITLE -->
                <p><span style="font-weight: bold">title:</span> {{getEvent(id).title}}</p>
                <!-- CITATION -->
                <p><span style="font-weight: bold">citation:</span>
                    <a
                        style="text-decoration: none; color: black"
                        v-if="getEvent(id).citation"
                        :href="`${getEvent(id).citation}`"
                        target="_blank"
                    >
                    &#10003;
                    </a>
                </p>
                <div style="display: flex; align-items: center">
                    <span style="font-weight: bold">main picture: </span>
                    <img
                        :src="`${getEvent(id).mainPicture}`"
                        :alt="`${getEvent(id).mainPicture}`"
                        style="width: 100px;"
                    >
                </div>
                <!-- KEYWORDS -->
                <p><span style="font-weight: bold">keywords:</span> {{getEvent(id).keywords}}</p>
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
                <span style="font-weight: bold">books:</span>
                <previewMediaList :media="getEvent(id).books"/>
                <!-- MOVIES -->
                <span style="font-weight: bold">movies:</span>
                <previewMediaList :media="getEvent(id).movies"/>
            </div>
        </div>

        <div class="buttons">
            <!-- DELETE EVENT -->
            <span @click="openDeleteOverlay(id)">
                <img style="width: 20px;" src="https://img.icons8.com/material-outlined/48/000000/trash--v1.png" alt="delete-icon">
            </span>
            <!-- PUBLIST TO SITE -->
            <span
                style="background-color: rgba(0,0,0,.1); padding: 3px 5px 2px 5px; opacity: 1;"
                @click="openPublishOverlay(id)"
                
            >
            {{getEvent(id).published ? 'Unpublish' : 'Publish to Site'}}
            </span>
            <!-- EDIT EVENT -->
            <span @click="editEvent(id)">
                <img
                    style="width: 20px;"
                    src="https://cdn0.iconfinder.com/data/icons/glyphpack/45/edit-alt-1024.png"
                    alt="edit-icon">
            </span>

        </div>

    <!-- OVERLAYS -->
        <!-- TOGGLE PUBLISH OVERLAY -->
        <div
            class="overlay"
            :style="`background-color: ${ getEvent(id).published ? 'rgba(80, 80, 80,0.75);' : 'rgba(3, 95, 30, 0.75)' };`"
            v-if="selectedId === id && publishPushed"
        >
            <p
                class="overlay-btn"
                @click="togglePublishEvent(id)"
            >
            {{getEvent(id).published ? 'Unpublish Event' : 'Publish to Site'}}
            </p>
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
            style="background-color: rgba(95, 0, 0, 0.75);"
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
            style="background-color: rgba(16, 0, 161, 0.75);"
            v-if="selectedId === id && editPushed"
        >
            <p class="overlay-btn" @click="updateEvent(id)">Update Event</p>
            <div
                class="closeBtn"
                @click="resetOverlays(editPushed)"
            >
            &#10005;
            </div>
        </div>

    </div>

</div>

    <!-- OVERLAY IF EVENT PUBLISHED -->
    <p
        class="action-overlay"
        style="background-color: green;"
        v-if="eventPublished"
    >
    Event Published!
    </p>
    <!-- OVERLAY IF EVENT UNPUBLISHED -->

    <p
        class="action-overlay"
        style="background-color: grey;"
        v-if="eventUnpublished"
    >
    Event Unpublished!
    </p>

    <!-- OVERLAY IF EVENT DELETED -->
    <p
        class="action-overlay"
        style="background-color: red;"
        v-if="deletedEvent"
    >
    Event Deleted!
    </p>
    <!-- OVERLAY IF EVENT UPDATED -->
    <p
        class="action-overlay"
        style="background-color: blue;"
        v-if="updatedEvent"
    >
    Event Updated!
    </p>

</template>

<script>
import previewMediaList from './edit-components/preview-media-list.vue'

function overlayInitialState() {
  return {
    publishPushed: false,
    eventPublished: false,
    eventUnpublished: false,
    deletePushed: false,
    deletedEvent: false,
    editPushed: false,
    updatedEvent: false,
  }
}

export default {
    emits: ["editEvent", "clearForm", "updateEvent"],
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
        events() {
            // TODO: ALWAYS SHOW UNPUBLISHED EVENTS EVEN WHEN NO DATE IS SELECTED
            const getters = this.$store.getters
            if (this.editPushed) { return [ this.selectedId ] }
            return this.published ? getters.publishedEvents(this.date) : getters.nonPublishedEvents(this.published)
        },
    },
    methods: {
        resetOverlays(editPushed) {
            if (editPushed) { this.$emit('clearForm') } 
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
            this.resetOverlays()
            this.deletedEvent = true
            setTimeout(() => {
                this.deletedEvent = false
            }, 2000)
        },
        editEvent(id) {
            this.resetOverlays()
            this.$emit('editEvent', this.$store.getters.event(id))
            this.selectedId = id
            this.editPushed = true
        },
        openPublishOverlay(id) {
            this.resetOverlays()
            this.selectedId = id
            this.publishPushed = true
        },
        updateEvent(id) {
            this.$emit('updateEvent');
            this.resetOverlays()
            this.updatedEvent = true
            setTimeout(() => {
                this.updatedEvent = false
            }, 2000)
        },
        togglePublishEvent(id) {
            if (this.$store.state.events[id].published) {
                this.$store.dispatch('unPublishEvent', id)
                this.resetOverlays()
                this.eventUnpublished = true
                setTimeout(() => {
                    this.eventUnpublished = false
                }, 2000)
            } else {
                this.$store.dispatch('publishEvent', id)
                this.resetOverlays()
                this.eventPublished = true
                setTimeout(() => {
                    this.eventPublished = false
                }, 2000)
            }
        },
        showPubandUnpubEvents() {
            this.resetOverlays()
            // this.$emit('clearForm')
            this.published = !this.published
        },
    }
}
</script>

<style scoped>

.all-events {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 30px;
    /* width: min-content; */
    min-width: 146px;
    margin: 0 auto;
}

.main-container {
    width: max-content;
    height: max-content;
    position: relative;
    background-color: white;
    box-shadow: 0px 0px 33px -20px #000000;
}
.main-container:not(:last-child) {
    margin-bottom: 10px;
}

.event-container {
    display: flex;
    padding: 10px 25px;
    background-color: white;
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
    align-items: center;
    margin: 0 5px;
}

.buttons > * {
    cursor: pointer;
    opacity: .5;
    font-size: 12px;
}

.buttons > *:hover {
    opacity: 1;
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
    padding: 10px 0;
    opacity: 0.80;
    position: sticky;
    bottom: 0;
    color: white;
    text-align: center;
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

@media screen and (max-width: 860px) {
    .event-container {
        flex-direction: column;
    }
    .media-container {
        margin-left: 0px;
    }
}
</style>