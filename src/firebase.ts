import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyC_f4Hs1IZYBP1oRzW9galaGMQmTs2fdtw",
  authDomain: "misrii-20.firebaseapp.com",
  projectId: "misrii-20",
  storageBucket: "misrii-20.firebasestorage.app",
  messagingSenderId: "273737390789",
  appId: "1:273737390789:web:43e4a90b77555ecd6faeac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize & Export Firebase Services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Validate connection to Firestore on initialization
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

testConnection();

export default app;
