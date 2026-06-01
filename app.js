import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const PASSCODE = "010281";
const SESSION_KEY = "site_search_admin";

const loginContainer =
    document.getElementById("loginContainer");

const adminPanel =
    document.getElementById("adminPanel");

const loginBtn =
    document.getElementById("loginBtn");

const passcodeInput =
    document.getElementById("passcode");

const errorText =
    document.getElementById("errorText");

const addSiteBtn =
    document.getElementById("addSiteBtn");

const siteName =
    document.getElementById("siteName");

const siteImage =
    document.getElementById("siteImage");

const siteURL =
    document.getElementById("siteURL");

const adminSiteList =
    document.getElementById("adminSiteList");

const sitesGrid =
    document.getElementById("sitesGrid");

const searchInput =
    document.getElementById("searchInput");

const emptyState =
    document.getElementById("emptyState");

const sitesRef = collection(db, "sites");

let allSites = [];

//
// ADMIN LOGIN
//
if (loginBtn) {
    const savedSession =
        sessionStorage.getItem(SESSION_KEY);

    if (savedSession === "true") {
        loginContainer.classList.add("hidden");
        adminPanel.classList.remove("hidden");
    }

    loginBtn.addEventListener("click", login);

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

            loginContainer.classList.add(
                "hidden"
            );

            adminPanel.classList.remove(
                "hidden"
            );

            loadAdminSites();
        } else {
            errorText.textContent =
                "Incorrect passcode.";
        }
    }

    addSiteBtn.addEventListener(
        "click",
        async () => {
            const name =
                siteName.value.trim();

            const image =
                siteImage.value.trim();

            const url =
                siteURL.value.trim();

            if (
                !name ||
                !image ||
                !url
            ) {
                alert(
                    "Fill in all fields."
                );
                return;
            }

            try {
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
            } catch (err) {
                console.error(err);
                alert(
                    "Failed to add site."
                );
            }
        }
    );
}

//
// HOMEPAGE
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
// LOAD HOME SITES
//
function loadHomeSites() {
    onSnapshot(
        sitesRef,
        (snapshot) => {
            allSites =
                snapshot.docs.map(
                    (doc) => ({
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
        allSites.filter(
            (site) =>
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

    filtered.forEach((site) => {
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
                    href="play.html?url=${encodeURIComponent(site.url)}&name=${encodeURIComponent(site.name)}"
                >
                    Open Site
                </a>
            </div>
        `;

        sitesGrid.appendChild(card);
    });
}

//
// ADMIN SITE LIST
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
                        <span>
                            ${site.name}
                        </span>

                        <button
                            class="delete-btn"
                            data-id="${siteDoc.id}"
                        >
                            Delete
                        </button>
                    `;

                    adminSiteList.appendChild(
                        div
                    );
                }
            );

            document
                .querySelectorAll(
                    ".delete-btn"
                )
                .forEach((btn) => {
                    btn.addEventListener(
                        "click",
                        async () => {
                            const id =
                                btn.dataset.id;

                            const confirmDelete =
                                confirm(
                                    "Delete this site?"
                                );

                            if (
                                !confirmDelete
                            )
                                return;

                            await deleteDoc(
                                doc(
                                    db,
                                    "sites",
                                    id
                                )
                            );
                        }
                    );
                });
        }
    );
}