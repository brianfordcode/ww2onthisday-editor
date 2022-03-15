<template>

<!-- PUBLISHED/UNPUBLISHED FILTER -->
<div
    v-if="!editPushed"
    style="display: flex; align-items: center; margin: 20px auto 0 auto; width: max-content;"
>
    <h4
        :style="`padding: 10px; background-color: ${published ? 'rgba(3, 95, 30, 0.5)': 'white'}; cursor: pointer;`"
        @click="togglePublishedEvents"
    >
    Published
    </h4>
    <h4
        :style="`padding: 10px; background-color: ${!published ? 'rgba(95, 0, 0, 0.5)': 'white'}; cursor: pointer;`"
        @click="togglePublishedEvents"
    >
    Unpublished
    </h4>
</div>

<div
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
                <p>date: {{ getEvent(id).date }}</p>
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
            <!-- DELETE EVENT -->
            <span @click="openDeleteOverlay(id)">
                <img style="width: 20px;" src="https://img.icons8.com/material-outlined/48/000000/trash--v1.png" alt="delete-icon">
            </span>
            <!-- PUBLIST TO SITE -->
            <span
                style="background-color: rgba(0,0,0,.1); padding: 3px 5px 2px 5px; opacity: 1;"
                @click="openPublishOverlay(id)"
                v-if="getEvent(id).published === false"
            >
            Publish To Site
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
    <!-- OVERLAY IF EVENT SENT TO FIREBASE -->
    <p
        class="action-overlay"
        style="background-color: green;"
        v-if="submittedEvent"
    >
    Event Published!
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
    submittedEvent: false,
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
            if (this.editPushed) {
                return [ this.selectedId ]
            }
            else if (this.published) {
                return this.$store.getters.publishedEvents(this.date)
            } else {
                return this.$store.getters.nonPublishedEvents(this.published)
            }
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
            this.deletedEvent = true
            this.resetOverlays()
            setTimeout(() => {
                this.deletedEvent = false
            }, 2000)
        },
        editEvent(id) {
            this.resetOverlays()
            this.$emit('editEvent', this.$store.getters.event(id))
            this.selectedId = id
            this.editPushed = true
            this.eventBeingUpdated = this.$store.getters.event(id)
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
        publishEvent(id) {
            this.$store.dispatch('publishEvent', id)
            this.resetOverlays()
            this.submittedEvent = true
            this.published = true
            setTimeout(() => {
                this.submittedEvent = false
            }, 2000)
        },
        togglePublishedEvents() {
            this.resetOverlays()
            this.$emit('clearForm')
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
    padding: 10px 30px;
    width: min-content;
    min-width: 146px;
    margin: 0 auto 20px auto;
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

</style>