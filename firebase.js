// Firebase Config
import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCjEBgO_8y70a3G_ZTS3arQIm5QYTjIwRc",
    authDomain: "site-search-0.firebaseapp.com",
    projectId: "site-search-0",
    storageBucket: "site-search-0.firebasestorage.app",
    messagingSenderId: "1032700073870",
    appId: "1:1032700073870:web:c2865b56a9421be480f6df"
};

const app =
    initializeApp(firebaseConfig);

export const db =
    getFirestore(app);