import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBIoXtNJA9aIx8n3CNy_-M6XDAzKfXVkfw",
  authDomain: "odoo-5c12f.firebaseapp.com",
  databaseURL: "https://odoo-5c12f-default-rtdb.firebaseio.com",
  projectId: "odoo-5c12f",
  storageBucket: "odoo-5c12f.firebasestorage.app",
  messagingSenderId: "790237663912",
  appId: "1:790237663912:web:eaa8fa4b32b00ea77c289d",
  measurementId: "G-CZMTG5YJYC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export default app;