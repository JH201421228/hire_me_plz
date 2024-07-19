// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
// import { getDatabase } from "firebase/database";
// import { getStorage } from "firebase/storage";
// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAPL-IZDcdiNR9cli06L3thshn6NVHVpS0",
//   authDomain: "quiz-pjt.firebaseapp.com",
//   databaseURL: 'https://quiz-pjt-default-rtdb.asia-southeast1.firebasedatabase.app',
//   projectId: "quiz-pjt",
//   storageBucket: "quiz-pjt.appspot.com",
//   messagingSenderId: "755101474972",
//   appId: "1:755101474972:web:decc571c2572c95f768d59"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const db = getDatabase(app)
// export const storage = getStorage(app)
// export default app

// plz del above code

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import getEnv from "./utils/getEnv";

const firebase_api_key = getEnv('FIREBASE_API_KEY')

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: firebase_api_key,
  authDomain: "hiremeplz-f2437.firebaseapp.com",
  databaseURL: "https://hiremeplz-f2437-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "hiremeplz-f2437",
  storageBucket: "hiremeplz-f2437.appspot.com",
  messagingSenderId: "713456907518",
  appId: "1:713456907518:web:9818956cd323905f9161af"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)
export const storage = getStorage(app)
export default app
