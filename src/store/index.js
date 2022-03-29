import { createStore } from 'vuex'

// FIREBASE
import { initializeApp } from "firebase/app";
import { doc, getDocs, deleteDoc, updateDoc, collection, query, where, setDoc, getFirestore } from "firebase/firestore"; 

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
    event: (state) => (id) => {
      return state.events[id]
    },

    // FILTERED EVENTS
    allPubEvents: (state) => (searchTerm) => {
      const events = state.events
      const eventIds = Object.keys(events)
      const filteredEvents = eventIds.filter(id => events[id].published)
      if (searchTerm) {
        return filteredEvents.filter(id => {
          const string = JSON.stringify(events[id]).toLowerCase()
          return string.includes(searchTerm.toLowerCase())
        })
      }
      else {
        return filteredEvents
      }
    },
    datePubEvents: (state) => (date, searchTerm) => {
      const events = state.events
      const eventIds = Object.keys(events)
      const filteredEvents = eventIds.filter(id => events[id].date === date && events[id].published)
      if (searchTerm) {
        return filteredEvents.filter(id => {
          const string = JSON.stringify(events[id]).toLowerCase()
          return string.includes(searchTerm.toLowerCase())
        })
      }
      else {
        return filteredEvents
      }

    },
    allNonpubEvents: (state) => (searchTerm) => {
      const events = state.events
      const eventIds = Object.keys(events)
      const publishedEvents = eventIds.filter(id => events[id].published === false)
      if (searchTerm) {
        return publishedEvents.filter(id => {
          const string = JSON.stringify(events[id]).toLowerCase()
          return string.includes(searchTerm.toLowerCase())
        })
      }
      else {
        return publishedEvents
      }
    },
    dateNonpubEvents: (state) => (date, searchTerm) => {
      const events = state.events
      const eventIds = Object.keys(events)
      const publishedEvents = eventIds.filter(id => events[id].date === date && events[id].published === false)
      if (searchTerm) {
        return publishedEvents.filter(id => {
          const string = JSON.stringify(events[id]).toLowerCase()
          return string.includes(searchTerm.toLowerCase())
        })
      }
      else {
        return publishedEvents
      }
    },
  },
  mutations: {
    addEvent(state, submittedEvent) {
      const id = submittedEvent.id
      state.events[id] = submittedEvent
    },
    addEventFromDB(state, params) {
      state.events[params.id] = params.event
    },
    deleteEvent(state, id) {
      delete state.events[id]
    },
    togglePublishEvent(state, id) {
      state.events[id].published = !state.events[id].published
    }
  },
  actions: {
    addEvent(context, submittedEvent) {
      context.commit('addEvent', submittedEvent)
      // CHANGE TO "submitted-events" FOR ACTUAL EVENTS
      setDoc(doc(db, "submitted-events", submittedEvent.id), submittedEvent);
    },
    deleteEvent(context, id) {
      context.commit('deleteEvent', id)
      // CHANGE TO "submitted-events" FOR ACTUAL EVENTS
      deleteDoc(doc(db, "submitted-events", id));
    },
    async publishEvent(context, id) {
      context.commit('togglePublishEvent', id)
      // CHANGE TO "submitted-events" FOR ACTUAL EVENTS
      await updateDoc(doc(db, "submitted-events", id), { published: true })
    },
    async unPublishEvent(context, id) {
      context.commit('togglePublishEvent', id)
      // CHANGE TO "submitted-events" FOR ACTUAL EVENTS
      await updateDoc(doc(db, "submitted-events", id), { published: false })
    },

    // DATABASE EVENTS
    async getDBEvents(context, date) {
      // CHANGE TO "submitted-events" FOR ACTUAL EVENTS
      const q = query(collection(db, "submitted-events"), where("date", "==", date));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const event = doc.data()
        context.commit('addEventFromDB', { id: doc.id, event })
      });
      // TODO: MAKE SURE SECURITY RULES IN FIREBASE ARE OK
    },
    async loadNonpublishedEvents(context) {
      // CHANGE TO "submitted-events" FOR ACTUAL EVENTS
      const q = query(collection(db, "submitted-events"), where("published", "!=", true));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const event = doc.data()
        context.commit('addEventFromDB', { id: doc.id, event })
      });
    },
    async loadPublishedEvents(context) {
      // CHANGE TO "submitted-events" FOR ACTUAL EVENTS
      const q = query(collection(db, "submitted-events"), where("published", "==", true));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const event = doc.data()
        context.commit('addEventFromDB', { id: doc.id, event })
      });
    },

  }
})