import { createStore } from 'vuex'

// FIREBASE
import { initializeApp } from "firebase/app";
import { doc, setDoc, getFirestore } from "firebase/firestore"; 

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
    event: []
  },
  mutations: {
    addEvent(state, submittedEvent) {
      state.event.push(submittedEvent)
    }
  },
  actions: {
    async addEvent(context, submittedEvent) {

      context.commit('addEvent', submittedEvent)

      // CHANGE TO "submitted-events" FOR ACTUAL EVENTS
      await setDoc(doc(db, "development", 'event-'+`${submittedEvent.date}`+'-'+Date.now()+''), submittedEvent);
    },
  },
  modules: {
  }
})
