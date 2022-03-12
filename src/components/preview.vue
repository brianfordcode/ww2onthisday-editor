<template>

<!-- PUBLISHED/UNPUBLISHED FILTER -->
<div style="display: flex; align-items: center; margin: 0 auto 15px auto; width: max-content;">
    <h4 style="padding-right: 5px;">
    {{FBEventsShown ? '' : 'Not'}} Published
    </h4>
    <button class="published-btns"
        @click="toggleFBEvents"
    >
    click for {{FBEventsShown ? 'un' : ''}}published events
    </button>
</div>

<div
    class="main-container"
    v-for="id in $store.getters.filteredEvents(date, FBEventsShown)"
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
        <button @click="openDeleteModal(index)">&#x2715;</button>
        <button @click="openPublishModal(index)" v-if="getEvent(id).published === false">Publish To Site</button>
        <button @click="editEvent(id)">
            <img
                style="width: 15px;"
                src="https://cdn0.iconfinder.com/data/icons/glyphpack/45/edit-alt-1024.png"
                alt="edit-icon">
        </button>
    </div>

<!-- MODALS -->
    <!-- MODAL ASKING SURE TO SEND TO FIREBASE -->
    <div
        class="submit-warning modal"
        style="background-color: rgba(3, 95, 30, 0.61);"
        v-if="selectedIndex === index && publishPushed"
    >
        <div style="width: 80%;">
            <div class="modal-btns">
                <p @click="sendToFireBase(getEvent(id), index)">Publish to Site</p>
                <p @click="selectedIndex = null, publishPushed = false">Do Not Publish Yet</p>
            </div>
        </div>
    </div>
    <!-- DELETE MODAL -->
    <div
        class="delete-warning modal"
        style="background-color: rgba(95, 0, 0, 0.61);"
        v-if="selectedIndex === index && deletePushed"
    >
        <div style="width: 80%;">
            <div class="modal-btns">
                <p @click="deleteEvent(id)">Delete this Event</p>
                <p @click="selectedIndex = null, deletePushed = false">Do Not Delete</p>
            </div>
        </div>
    </div>

</div>
    <!-- MODAL IF EVENT SENT TO FIREBASE -->
    <p
        class="action-modal"
        style="background-color: green;"
        v-if="submittedEvent"
    >
    Event Submitted!
    </p>
    <!-- MODAL IF EVENT DELETED -->
    <p
        class="action-modal"
        style="background-color: red;"
        v-if="deletedEvent"
    >
    Event Deleted!
    </p>

</template>

<script>
import previewMediaList from './edit-components/preview-media-list.vue'

export default {
    emits: ["getEventData"],
    components: { previewMediaList },
    data() {
        return {
            selectedId: null,
            publishPushed: false,
            submittedEvent: false,
            deletePushed: false,
            deletedEvent: false,
            FBEventsShown: false,
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
            return this.$store.getters.eventsToShow(this.FBEventsShown)
        },
        eventsToShow() {
            return this.eventIdsToShow.map(id => this.$store.getters.event(id))
        }
    },
    methods: {
        getEvent(id) {
            return this.$store.getters.event(id)
        },
        openDeleteModal(id) {
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
        editEvent(index, event) {

            let indexToBeUpdated = this.$store.state.events.indexOf(this.eventsToShow[this.mainIndex])

            if (event.published === false) {
                this.$emit('getEventData', event)
                this.$store.state.events.splice(indexToBeUpdated, 1)
            } else {
                this.$emit('getEventData', event)
                // this.$store.dispatch('updateEventOnFirebase', event)
            }

            // this.$emit('getEventData', event)
            // this.$store.state.events.splice(index, 1)
        },
        openPublishModal(index) {
            this.selectedIndex = index
            this.publishPushed = true
        },
        toggleFBEvents() {
            this.deletePushed = false
            this.FBEventsShown = !this.FBEventsShown
        },
        sendToFireBase(event, index) {
            this.$store.dispatch('sendToFirebase', event)
            this.submittedEvent = true
            this.selectedIndex = null
            this.publishPushed = false
            this.$store.state.events.splice(index, 1)
            setTimeout(() => {
                this.submittedEvent = false
            }, 2000)
        }
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
    margin: 0 auto 15px auto;
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

.media-container {
    margin-left: 50px;
}

.buttons {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
}

.modal {
    position: absolute;
    top: 0;
    justify-content: space-around;
    align-items: center;
    height: 100%;
    width: 100%;
    display: flex;
    color: white;
}

.modal-btns {
    display: flex;
    justify-content: space-between;
}

.modal-btns > * {
    border: 1px solid;
    padding: 0 5px;
    cursor: pointer;
}

.action-modal {
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