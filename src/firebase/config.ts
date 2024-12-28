import { initializeApp } from "firebase/app"
import appConfig from "../../env.config"

const env = {
  apiKey: appConfig.FIREBASE_API_KEY,
  authDomain: appConfig.FIREBASE_AUTH_DOMAIN,
  projectId: appConfig.FIREBASE_PROJECT_ID,
  storageBucket: appConfig.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: appConfig.FIREBASE_MESSAGING_SENDER_ID,
  appId: appConfig.FIREBASE_APP_ID
};

const firebaseApp = initializeApp(env);
export default firebaseApp;
