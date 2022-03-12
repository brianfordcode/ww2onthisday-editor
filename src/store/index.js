import { createStore } from 'vuex'

// FIREBASE
import { initializeApp } from "firebase/app";
import { doc, getDocs, deleteDoc, collection, query, where, setDoc, getFirestore, startAfter } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyBS1sZtXMnh5xFwJnRIoGCSwCiDymKO2VI",
  authDomain: "ww2-on-this-day.firebaseapp.com",
  projectId: "ww2-on-this-day",
  storageBucket: "ww2-on-this-day.appspot.com",
  messagingSenderId: "814949029524",
  appId: "1:814949029524:web:343f2f6669b975b9fc0681",
  measurementId: "G-YTWHJZS99D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

export default createStore({
  state: {
    events: {}
  },
  getters: {
    getDatefromHashDate: (state, getters) => (date) => {
      let input = date.split("-");
      let dayNum = parseInt(input[2]) + 1
      let day = (dayNum < 10 ? '0' : '') + dayNum
      let dateObject = new Date(input[0] +"-"+ input[1] +"-"+ day);
      
      return dateObject
    },
    eventsToShow: (state) => (showPublished) => {
      const events = state.events
      const eventIds = Object.keys(events)
      console.log(eventIds)
      return eventIds.filter(id => events[id].published === showPublished)
    },
    event: (state) => (id) => {
      return state.events[id]
    },
    filteredEvents: (state) => (date, published) => {
      const events = state.events
      const eventIds = Object.keys(events)
      console.log(events)
      return eventIds.filter(id => events[id].date === date && events[id].published === published)
    }
  },
  mutations: {
    addEvent(state, submittedEvent) {
      const id = submittedEvent.id
      state.events[id] = submittedEvent
    },
    addEventFromFB(state, params) {
        state.events[params.id] = params.event
    },
    deleteEvent(state, id) {
      delete state.events[id]
    }
  },
  actions: {
    addEvent(context, submittedEvent) {
      context.commit('addEvent', submittedEvent)
    },

    // EDITING FIREBASE EVENTS
    async getFBEvents(context, date) {

      // CLEAR published events from state events first
      for (let i=0; i<this.state.events.length; i++) {
        if (this.state.events[i].published) {
          this.state.events.splice(i, 1)
          i--
        }
      }

      // add firebase events to store events based on submitted event date
      const q = query(collection(db, "development"), where("date", "==", date));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const event = doc.data()
        context.commit('addEventFromFB', { id: doc.id, event })
      });
    },

    deleteEvent(context, id) {
      context.commit('deleteEvent', id)
      deleteDoc(doc(db, "development", id));
    },

    async deleteFromFirebase(context, event) {
      let eventToBeDeleted
      const q = query(collection(db, "development"), where("id", "==", event.id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        eventToBeDeleted = doc.id
      });
      console.log(eventToBeDeleted)
      deleteDoc(doc(db, "development", eventToBeDeleted));
    },

    async updateEventOnFirebase(context, event) {

      console.log(event.id)

      let eventToBeUpdated
      const q = query(collection(db, "development"), where("id", "==", event.id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        eventToBeUpdated = doc.id
      });
      console.log(eventToBeUpdated)
      setDoc(doc(db, "development", eventToBeUpdated), event);

    },

    async sendToFirebase(context, submittedEvent) {
      submittedEvent.published = true
      // CHANGE TO "submitted-events" FOR ACTUAL EVENTS
      await setDoc(doc(db, "development", 'event-'+`${submittedEvent.date}`+'-'+Date.now()+''), submittedEvent);
    },
  }
})
