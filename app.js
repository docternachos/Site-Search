import { db } from "./firebase.js";

import {
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const sitesRef =
    collection(db, "sites");

const settingsRef =
    collection(db, "settings");

//
// ELEMENTS
//
const sitesGrid =
    document.getElementById(
        "sitesGrid"
    );

const featuredGrid =
    document.getElementById(
        "featuredGrid"
    );

const recentGrid =
    document.getElementById(
        "recentGrid"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const categoryBtns =
    document.querySelectorAll(
        ".category-btn"
    );

const announcementBar =
    document.getElementById(
        "announcementBar"
    );

//
// STATE
//
let allSites = [];
let currentCategory =
    "all";

//
// LOAD SITES
//
onSnapshot(
    sitesRef,
    (snapshot) => {

        allSites = [];

        snapshot.forEach(
            (siteDoc) => {

                const site =
                    siteDoc.data();

                //
                // Ignore hidden
                //
                if (
                    site.hidden
                ) return;

                allSites.push({
                    id:
                        siteDoc.id,
                    ...site
                });
            }
        );

        render();
    }
);

//
// SEARCH
//
searchInput.addEventListener(
    "input",
    render
);

//
// CATEGORY BUTTONS
//
categoryBtns.forEach(
    btn => {

        btn.addEventListener(
            "click",
            () => {

                categoryBtns.forEach(
                    b =>
                    b.classList.remove(
                        "active"
                    )
                );

                btn.classList.add(
                    "active"
                );

                currentCategory =
                    btn.dataset.category;

                render();
            }
        );
    }
);

//
// RENDER
//
function render() {

    sitesGrid.innerHTML =
        "";

    featuredGrid.innerHTML =
        "";

    recentGrid.innerHTML =
        "";

    const search =
        searchInput.value
        .toLowerCase();

    let filtered =
        allSites.filter(
            site => {

                const matchesSearch =
                    site.name
                    .toLowerCase()
                    .includes(
                        search
                    );

                const matchesCategory =
                    currentCategory ===
                    "all" ||

                    site.category ===
                    currentCategory;

                return (
                    matchesSearch &&
                    matchesCategory
                );
            }
        );

    //
    // FEATURED
    //
    filtered
    .filter(
        site =>
        site.featured
    )
    .forEach(
        site => {

            featuredGrid
            .appendChild(
                createCard(
                    site
                )
            );
        }
    );

    //
    // RECENT
    //
    [...filtered]
    .sort(
        (a, b) =>
        b.createdAt -
        a.createdAt
    )
    .slice(0, 8)
    .forEach(
        site => {

            recentGrid
            .appendChild(
                createCard(
                    site
                )
            );
        }
    );

    //
    // ALL
    //
    filtered.forEach(
        site => {

            sitesGrid
            .appendChild(
                createCard(
                    site
                )
            );
        }
    );
}

//
// CARD
//
function createCard(
    site
) {

    const div =
        document.createElement(
            "div"
        );

    div.className =
        "site-card";

    div.innerHTML = `
        <img
            src="${site.image}"
            alt="${site.name}"
            class="site-image"
            onerror="
                this.src=
                'https://placehold.co/600x400/111111/9333ea?text=Site'
            "
        >

        <div
            class="site-content"
        >

            <h3>
                ${site.name}
            </h3>

            <p>
                ${
                    site.description
                    ||
                    "No description."
                }
            </p>

            <small>
                ${site.category}
            </small>

        </div>
    `;

    div.addEventListener(
        "click",
        () => {

            const encoded =
                encodeURIComponent(
                    site.url
                );

            window.location.href =
                `play.html?url=${encoded}`;
        }
    );

    return div;
}

//
// KEYBOARD SHORTCUT
//
document.addEventListener(
    "keydown",
    (e) => {

        if (
            e.key === "/"
        ) {

            e.preventDefault();

            searchInput.focus();
        }
    }
);