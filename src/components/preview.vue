<template>

<!-- PUBLISHED/UNPUBLISHED FILTER -->
<div style="display: flex; align-items: center; margin: 0 auto 15px auto; width: max-content;">
    <h4 v-if="$store.state.events[0]" style="padding-right: 5px;">
    {{FBEventsShown ? '' : 'Not'}} Published
    </h4>
    <button class="published-btns"
        @click="toggleFBEvents"
        v-if="$store.state.events[0]"
    >
    click for {{FBEventsShown ? 'un' : ''}}published events
    </button>
</div>

<div
    class="main-container"
    v-for="(event, index) in eventsToShow"
    :key="event"
>
    <div class="event-container">
        <div class="event-details">
            <!-- DATE -->
            <p>date: {{ $store.getters.getDatefromHashDate(eventsToShow[index].date).toLocaleDateString('en-us', {month:"long", day:"numeric", year: "numeric"}) }}</p>
            <!-- TITLE -->
            title: <p>{{event.title}}</p>
            <!-- CITATION -->
            <p>citation: 
                <a 
                    v-if="eventsToShow[index].citation"
                    :href="`${eventsToShow[index].citation}`"
                    target="_blank"
                >
                &#10003;
                </a>
            </p>
            
            <div style="display: flex; align-items: center">
                <p>main picture:</p>
                <img
                    :src="`${event.mainPicture}`"
                    :alt="`${event.mainPicture}`"
                    style="width: 100px;"
                >
            </div>
            <!-- KEYWORDS -->
            <p>keywords: {{eventsToShow[index].keywords}}</p>
            <!-- MAP -->
            <iframe
                class="map"
                v-if="eventsToShow[index].location.coordinates"
                style="border:0; width: 250px; height: 150px;"
                loading="lazy"
                allowfullscreen
                :src="`https://www.google.com/maps/embed/v1/view?key=AIzaSyAzuMuGU3ynDz4KU87IzdKY_pXzhUyILoQ&center=
                ${eventsToShow[index].location.coordinates}&zoom=${eventsToShow[index].location.mapZoom}
                &maptype=satellite`"
            />
        </div>
        <div class="media-container">
            <!-- BOOKS -->
            <p>books:</p>
            <previewMediaList :media="eventsToShow[index].books"/>
            <!-- MOVIES -->
            <p>movies:</p>
            <previewMediaList :media="eventsToShow[index].movies"/>
        </div>
    </div>
    <div class="buttons">
        <button @click="openDeleteModal(index)">&#x2715;</button>
        <button @click="openPublishModal(index)">Publish To Site</button>
        <button @click="editEvent(index, event)">
            <img
                style="width: 15px;"
                src="https://cdn0.iconfinder.com/data/icons/glyphpack/45/edit-alt-1024.png"
                alt="edit-icon">
        </button>
    </div>
    <!-- MODAL ASKING SURE TO SEND TO FIREBASE -->
    <div
        class="submit-warning modal"
        style="background-color: rgba(3, 95, 30, 0.61);"
        v-if="selectedIndex === index && publishPushed"
    >
        <div style="width: 80%;">
            <div class="modal-btns">
                <p @click="sendToFireBase(event, index)">Publish to Site</p>
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
                <p @click="deleteEvent(event)">Delete this Event</p>
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
            selectedIndex: null,
            publishPushed: false,
            submittedEvent: false,
            deletePushed: false,
            deletedEvent: false,
            FBEventsShown: false,
            mainIndex: null
        }
    },
    computed: {
        eventsToShow() {
            return this.$store.state.events.filter(event => event.published === this.FBEventsShown)
        }
    },
    methods: {
        openDeleteModal(index) {

            this.mainIndex = this.$store.state.events.indexOf(this.eventsToShow[index])

            this.selectedIndex = index
            this.deletePushed = true
        },
        deleteEvent(event) {
            let indexToBeDeleted = this.$store.state.events.indexOf(this.eventsToShow[this.mainIndex])

            if (event.published === false) {
                this.$store.state.events.splice(indexToBeDeleted, 1)
            } else {
                this.$store.dispatch('deleteFromFirebase', event)
            }
            this.deletedEvent = true
            this.selectedIndex = null
            this.deletePushed = false
            setTimeout(() => {
                this.deletedEvent = false
            }, 2000)
        },
        editEvent(index, event) {
            this.$emit('getEventData', event)
            this.$store.state.events.splice(index, 1)
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
    border: 1px solid;
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