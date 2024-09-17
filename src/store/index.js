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

// test creds
// const firebaseConfig = {
//   apiKey: "AIzaSyDgJkeYFH6F6h2RBn5SZJ8hDktY3bQSito",
//   authDomain: "ww2-development.firebaseapp.com",
//   projectId: "ww2-development",
//   storageBucket: "ww2-development.appspot.com",
//   messagingSenderId: "150864423280",
//   appId: "1:150864423280:web:be521909810e49c69e87b5",
//   measurementId: "G-B4V4090WQW"
// }

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

export default createStore({
  state: {
    events: {},
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
      const filteredEvents = eventIds.filter(id => events[id].published === false)
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
    dateNonpubEvents: (state) => (date, searchTerm) => {
      const events = state.events
      const eventIds = Object.keys(events)
      const filteredEvents = eventIds.filter(id => events[id].date === date && events[id].published === false)
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
    },
    clearStateEvents(state) {
      state.events = {}
    },
    
    
    updateEventTitle(state, { eventId, newTitle, oldTitle, timeTextChange }) {
      if (state.events[eventId]) {
        state.events[eventId].title = newTitle;
        state.events[eventId].reworded = true;
        state.events[eventId].oldTitle = oldTitle
        state.events[eventId].rewordTime = timeTextChange
      }
    },
    updatePicLink(state, { eventId, picLink, time }) {
      if (state.events[eventId]) {
        state.events[eventId].mainPicture = picLink;
        state.events[eventId].picSubmitTime = time;
      }
    },
    updateaccuratePictureStatus(state, { accuratePictureIdToChange, accuratePictureStatus }) {
      if (state.events[accuratePictureIdToChange]) { 
        state.events[accuratePictureIdToChange].accuratePicture = accuratePictureStatus;

        console.log(accuratePictureIdToChange, accuratePictureStatus)
      }
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
    clearStateEvents(context) {
      context.commit('clearStateEvents')
    },
    async changeText(context, {loopEventIds, loopeventTitlesToChange, loopOldTitles, timeTextChange}) {

      await updateDoc(doc(db, "submitted-events", loopEventIds), { title: loopeventTitlesToChange, reworded: true, oldTitle: loopOldTitles, rewordTime: timeTextChange  })

      context.commit('updateEventTitle', { eventId: loopEventIds, newTitle: loopeventTitlesToChange, oldTitle: loopOldTitles, timeTextChange });

    },





    async addPicLink(context, {loopEventIds, loopeventPicsToAdd, time}) {
      await updateDoc(doc(db, "submitted-events", loopEventIds), { mainPicture: loopeventPicsToAdd, picSubmitTime: time })

      context.commit('updatePicLink', { eventId: loopEventIds, picLink: loopeventPicsToAdd, time });
    },

    async updateaccuratePictureStatus(context, {accuratePictureIdToChange, accuratePictureStatus}) {
      console.log(accuratePictureIdToChange, accuratePictureStatus)
      await updateDoc(doc(db, "submitted-events", accuratePictureIdToChange), { accuratePicture: accuratePictureStatus })

      context.commit('updateaccuratePictureStatus', { accuratePictureIdToChange, accuratePictureStatus })
    },







// CHANGE ID DELETE
    async changeId(context, {loopEventIds, newId}) {
        await updateDoc(doc(db, "submitted-events", loopEventIds), { id: newId })
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
    },
    async loadNonpublishedEvents(context, date) {
      // CHANGE TO "submitted-events" FOR ACTUAL EVENTS
      let q = query(collection(db, "submitted-events"), where("published", "!=", true));
      // if (date) q = query(q, where("date", "==", date))

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const event = doc.data()
        context.commit('addEventFromDB', { id: doc.id, event })
      });
    },
    async loadPublishedEvents(context, date) {
      // CHANGE TO "submitted-events" FOR ACTUAL EVENTS
      const q = query(collection(db, "submitted-events"), where("published", "==", true));
      // if (date) q = query(q, where("date", "==", date))

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const event = doc.data()
        context.commit('addEventFromDB', { id: doc.id, event })
      });
    },

  }
})