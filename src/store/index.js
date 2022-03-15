import { createStore } from 'vuex'

// FIREBASE
import { initializeApp } from "firebase/app";
import { doc, getDocs, deleteDoc, updateDoc, collection, query, where, setDoc, getFirestore, startAfter } from "firebase/firestore"; 

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
    filteredEvents: (state) => (date, published) => {
      const events = state.events
      const eventIds = Object.keys(events)
      return eventIds.filter(id => events[id].date === date && events[id].published === published)
    },
    eventBeingEdited: (state) => (IdBeingUpdated) => {
      const events = state.events
      const eventIds = Object.keys(events)
      return eventIds.filter(id => events[id].id === IdBeingUpdated)
    }
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
    publishEvent(state, id) {
      state.events[id].published = true
    }
  },
  actions: {
    addEvent(context, submittedEvent) {
      context.commit('addEvent', submittedEvent)
      setDoc(doc(db, "development", submittedEvent.id), submittedEvent);
    },
    deleteEvent(context, id) {
      context.commit('deleteEvent', id)
      deleteDoc(doc(db, "development", id));
    },
    async publishEvent(context, id) {
      context.commit('publishEvent', id)
      // CHANGE TO "submitted-events" FOR ACTUAL EVENTS
      await updateDoc(doc(db, "development", id), { published: true });
    },

    // EDITING FIREBASE EVENTS
    async getDBEvents(context, date) {
      const q = query(collection(db, "development"), where("date", "==", date));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const event = doc.data()
        context.commit('addEventFromDB', { id: doc.id, event })
      });
    },

  }
})
