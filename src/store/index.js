import { createStore } from 'vuex'

// FIREBASE
import { initializeApp } from "firebase/app";
import { doc, getDocs, deleteDoc, collection, query, where, setDoc, getFirestore } from "firebase/firestore"; 

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
    events: []
  },
  getters: {
    getDatefromHashDate: (state, getters) => (date) => {
      let input = date.split("-");
      let dayNum = parseInt(input[2]) + 1
      let day = (dayNum < 10 ? '0' : '') + dayNum
      let dateObject = new Date(input[0] +"-"+ input[1] +"-"+ day);
      
      return dateObject
    },
  },
  mutations: {
    addEvent(state, submittedEvent) {
      state.events.push(submittedEvent)
    },

    addEventFromFB(state, eventsOnDate) {
        state.events.push(eventsOnDate)
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
        const eventsOnDate = doc.data()

        context.commit('addEventFromFB', eventsOnDate)

      });
    },

    async deleteFromFirebase(context, event) {
      let eventToBeDeleted
      // add firebase events to store events based on submitted event date
      const q = query(collection(db, "development"), where("id", "==", event.id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        eventToBeDeleted = doc.id
      });
      deleteDoc(doc(db, "development", eventToBeDeleted));
    },

    updateEventOnFirebase(context, event) {
      console.log('update from firebase', event)
    },

    async sendToFirebase(context, submittedEvent) {
      submittedEvent.published = true
      // CHANGE TO "submitted-events" FOR ACTUAL EVENTS
      await setDoc(doc(db, "development", 'event-'+`${submittedEvent.date}`+'-'+Date.now()+''), submittedEvent);
    },
  }
})
