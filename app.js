import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const PASSCODE = "010281";
const SESSION_KEY = "site_search_admin";

const sitesRef = collection(db, "sites");

let allSites = [];

//
// ELEMENTS
//
const loginContainer = document.getElementById("loginContainer");
const adminPanel = document.getElementById("adminPanel");

const loginBtn = document.getElementById("loginBtn");
const passcodeInput = document.getElementById("passcode");
const errorText = document.getElementById("errorText");

const addSiteBtn = document.getElementById("addSiteBtn");

const siteName = document.getElementById("siteName");
const siteImage = document.getElementById("siteImage");
const siteURL = document.getElementById("siteURL");

const adminSiteList = document.getElementById("adminSiteList");

const sitesGrid = document.getElementById("sitesGrid");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");

//
// ADMIN LOGIN
//
if (loginBtn) {

    const savedSession =
        sessionStorage.getItem(SESSION_KEY);

    if (savedSession === "true") {
        showAdminPanel();
    }

    loginBtn.addEventListener(
        "click",
        login
    );

    passcodeInput.addEventListener(
        "keydown",
        (e) => {
            if (e.key === "Enter") {
                login();
            }
        }
    );

    function login() {
        const code =
            passcodeInput.value.trim();

        if (code === PASSCODE) {

            sessionStorage.setItem(
                SESSION_KEY,
                "true"
            );

            showAdminPanel();

        } else {
            errorText.textContent =
                "Incorrect passcode.";
        }
    }

    function showAdminPanel() {
        loginContainer.classList.add(
            "hidden"
        );

        adminPanel.classList.remove(
            "hidden"
        );

        loadAdminSites();
    }

    //
    // ADD SITE
    //
    addSiteBtn.addEventListener(
        "click",
        async () => {

            const name =
                siteName.value.trim();

            const image =
                siteImage.value.trim();

            const url =
                siteURL.value.trim();

            if (!name || !image || !url) {
                alert(
                    "Fill in all fields."
                );
                return;
            }

            if (
                !url.startsWith("http")
            ) {
                alert(
                    "URL must start with https://"
                );
                return;
            }

            await addDoc(
                sitesRef,
                {
                    name,
                    image,
                    url,
                    created:
                        Date.now()
                }
            );

            siteName.value = "";
            siteImage.value = "";
            siteURL.value = "";
        }
    );
}

//
// HOME PAGE
//
if (sitesGrid) {

    loadHomeSites();

    searchInput.addEventListener(
        "input",
        () => {
            renderSites(
                searchInput.value
            );
        }
    );
}

//
// LIVE HOME SYNC
//
function loadHomeSites() {

    onSnapshot(
        sitesRef,
        (snapshot) => {

            allSites =
                snapshot.docs.map(
                    doc => ({
                        id: doc.id,
                        ...doc.data()
                    })
                );

            renderSites();
        }
    );
}

//
// RENDER HOME
//
function renderSites(
    filter = ""
) {

    sitesGrid.innerHTML = "";

    const filtered =
        allSites.filter(site =>
            site.name
                .toLowerCase()
                .includes(
                    filter.toLowerCase()
                )
        );

    emptyState.classList.toggle(
        "hidden",
        filtered.length > 0
    );

    filtered.forEach(site => {

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "site-card";

        card.innerHTML = `
            <img
                class="site-image"
                src="${site.image}"
                onerror="this.src='https://placehold.co/600x400/111111/9333ea?text=Site+Search'"
            >

            <div class="site-content">
                <h3 class="site-title">
                    ${site.name}
                </h3>

                <a
                    class="play-btn"
                    href="play.html?url=${encodeURIComponent(site.url)}"
                >
                    Open Site
                </a>
            </div>
        `;

        sitesGrid.appendChild(
            card
        );
    });
}

//
// ADMIN LIST
//
function loadAdminSites() {

    onSnapshot(
        sitesRef,
        (snapshot) => {

            adminSiteList.innerHTML =
                "";

            snapshot.forEach(
                (siteDoc) => {

                    const site =
                        siteDoc.data();

                    const div =
                        document.createElement(
                            "div"
                        );

                    div.className =
                        "admin-site-item";

                    div.innerHTML = `
                        <div>
                            <strong>
                                ${site.name}
                            </strong>
                            <br>
                            <small>
                                ${site.url}
                            </small>
                        </div>

                        <div style="display:flex;gap:10px;">

                            <button
                                class="edit-btn"
                                data-id="${siteDoc.id}"
                            >
                                Edit
                            </button>

                            <button
                                class="delete-btn"
                                data-id="${siteDoc.id}"
                            >
                                Delete
                            </button>

                        </div>
                    `;

                    adminSiteList.appendChild(
                        div
                    );
                }
            );

            //
            // DELETE
            //
            document
                .querySelectorAll(
                    ".delete-btn"
                )
                .forEach(btn => {

                    btn.onclick =
                    async () => {

                        const id =
                            btn.dataset.id;

                        await deleteDoc(
                            doc(
                                db,
                                "sites",
                                id
                            )
                        );
                    };
                });

            //
            // EDIT
            //
            document
                .querySelectorAll(
                    ".edit-btn"
                )
                .forEach(btn => {

                    btn.onclick =
                    async () => {

                        const id =
                            btn.dataset.id;

                        const newName =
                            prompt(
                                "New Name:"
                            );

                        const newImage =
                            prompt(
                                "New Image URL:"
                            );

                        const newURL =
                            prompt(
                                "New Website URL:"
                            );

                        if (
                            !newName ||
                            !newImage ||
                            !newURL
                        ) return;

                        await updateDoc(
                            doc(
                                db,
                                "sites",
                                id
                            ),
                            {
                                name:
                                    newName,

                                image:
                                    newImage,

                                url:
                                    newURL
                            }
                        );
                    };
                });
        }
    );
}