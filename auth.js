import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    onSnapshot,
    deleteDoc,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

//
// DEFAULT CODE ACCOUNTS
//
const DEFAULT_USERS = {
    nachos: {
        password: "010281",
        role: "owner"
    },

    backupowner: {
        password: "backup123",
        role: "owner"
    },

    friend1: {
        password: "abc123",
        role: "admin"
    }
};

//
// FIREBASE
//
const usersRef =
    collection(db, "users");

const sitesRef =
    collection(db, "sites");

const settingsRef =
    collection(db, "settings");

//
// USER STATE
//
let currentUser =
    null;

let currentRole =
    null;

//
// ELEMENTS
//
const loginScreen =
    document.getElementById(
        "loginScreen"
    );

const adminPanel =
    document.getElementById(
        "adminPanel"
    );

const usernameInput =
    document.getElementById(
        "username"
    );

const passwordInput =
    document.getElementById(
        "password"
    );

const loginBtn =
    document.getElementById(
        "loginBtn"
    );

const loginError =
    document.getElementById(
        "loginError"
    );

const roleText =
    document.getElementById(
        "roleText"
    );

//
// LOGIN
//
loginBtn.addEventListener(
    "click",
    login
);

passwordInput.addEventListener(
    "keydown",
    (e) => {
        if (e.key === "Enter") {
            login();
        }
    }
);

async function login() {

    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value.trim();

    //
    // CODE ACCOUNTS
    //
    if (
        DEFAULT_USERS[
            username
        ]
    ) {

        const user =
            DEFAULT_USERS[
                username
            ];

        if (
            user.password ===
            password
        ) {

            finishLogin(
                username,
                user.role
            );

            return;
        }
    }

    //
    // FIREBASE USERS
    //
    const snapshot =
        await getDocs(
            usersRef
        );

    let found =
        false;

    snapshot.forEach(
        (userDoc) => {

            const user =
                userDoc.data();

            if (
                user.username ===
                username &&

                user.password ===
                password
            ) {

                found =
                    true;

                finishLogin(
                    username,
                    user.role
                );
            }
        }
    );

    if (!found) {

        loginError.textContent =
            "Invalid username or password.";
    }
}

//
// LOGIN SUCCESS
//
function finishLogin(
    username,
    role
) {

    currentUser =
        username;

    currentRole =
        role;

    loginScreen
        .classList
        .add(
            "hidden"
        );

    adminPanel
        .classList
        .remove(
            "hidden"
        );

    roleText.textContent =
        role.toUpperCase();

    setupPermissions();
    setupTabs();

    loadStats();
    loadSites();
    loadAccounts();
}

//
// PERMISSIONS
//
function setupPermissions() {

    //
    // STANDARD
    //
    if (
        currentRole ===
        "standard"
    ) {

        document
            .querySelectorAll(
                ".admin-only"
            )
            .forEach(el => {

                el.style.display =
                    "none";
            });
    }

    //
    // ADMIN
    //
    if (
        currentRole ===
        "admin"
    ) {

        document
            .querySelectorAll(
                ".owner-only"
            )
            .forEach(el => {

                el.style.display =
                    "none";
            });
    }
}

//
// SIDEBAR TABS
//
function setupTabs() {

    const navBtns =
        document.querySelectorAll(
            ".nav-btn"
        );

    const tabs =
        document.querySelectorAll(
            ".tab-section"
        );

    navBtns.forEach(
        btn => {

            btn.addEventListener(
                "click",
                () => {

                    navBtns.forEach(
                        b =>
                        b.classList.remove(
                            "active"
                        )
                    );

                    tabs.forEach(
                        tab =>
                        tab.classList.remove(
                            "active"
                        )
                    );

                    btn.classList.add(
                        "active"
                    );

                    const tabName =
                        btn.dataset.tab;

                    document
                        .getElementById(
                            tabName
                        )
                        .classList
                        .add(
                            "active"
                        );
                }
            );
        }
    );
}

//
// DASHBOARD STATS
//
function loadStats() {

    onSnapshot(
        sitesRef,
        (snapshot) => {

            document.getElementById(
                "siteCount"
            ).textContent =
                snapshot.size;
        }
    );

    onSnapshot(
        usersRef,
        (snapshot) => {

            document.getElementById(
                "accountCount"
            ).textContent =
                snapshot.size +
                Object.keys(
                    DEFAULT_USERS
                ).length;
        }
    );
}

//
// CREATE ACCOUNT
//
const createUserBtn =
    document.getElementById(
        "createUserBtn"
    );

createUserBtn?.addEventListener(
    "click",
    async () => {

        if (
            currentRole ===
            "standard"
        ) {
            return;
        }

        const username =
            document.getElementById(
                "newUsername"
            ).value.trim();

        const password =
            document.getElementById(
                "newPassword"
            ).value.trim();

        const role =
            document.getElementById(
                "newRole"
            ).value;

        if (
            !username ||
            !password
        ) {
            alert(
                "Fill fields."
            );
            return;
        }

        await addDoc(
            usersRef,
            {
                username,
                password,
                role
            }
        );

        alert(
            "Account created."
        );
    }
);

//
// LOAD ACCOUNTS
//
function loadAccounts() {

    const accountList =
        document.getElementById(
            "accountList"
        );

    if (!accountList)
        return;

    accountList.innerHTML =
        "";

    //
    // CODE ACCOUNTS
    //
    Object.entries(
        DEFAULT_USERS
    ).forEach(
        ([username, user]) => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "admin-site-item";

            div.innerHTML = `
                <div>
                    <strong>
                        ${username}
                    </strong>
                    <br>
                    ${user.role}
                    <br>
                    <small>
                        Code Account
                    </small>
                </div>
            `;

            accountList.appendChild(
                div
            );
        }
    );

    //
    // FIREBASE USERS
    //
    onSnapshot(
        usersRef,
        (snapshot) => {

            snapshot.forEach(
                (userDoc) => {

                    const user =
                        userDoc.data();

                    const div =
                        document.createElement(
                            "div"
                        );

                    div.className =
                        "admin-site-item";

                    div.innerHTML = `
                        <div>
                            <strong>
                                ${user.username}
                            </strong>
                            <br>
                            ${user.role}
                        </div>

                        ${
                            currentRole ===
                            "owner"
                            ?
                            `
                            <button
                                class="delete-user"
                                data-id="${userDoc.id}"
                            >
                                Delete
                            </button>
                            `
                            :
                            ""
                        }
                    `;

                    accountList.appendChild(
                        div
                    );
                }
            );

            document
                .querySelectorAll(
                    ".delete-user"
                )
                .forEach(btn => {

                    btn.onclick =
                    async () => {

                        await deleteDoc(
                            doc(
                                db,
                                "users",
                                btn.dataset.id
                            )
                        );
                    };
                });
        }
    );
}

//
// LOAD SITES
//
function loadSites() {

    const siteList =
        document.getElementById(
            "adminSiteList"
        );

    const addBtn =
        document.getElementById(
            "addSiteBtn"
        );

    //
    // LIVE SITE LIST
    //
    onSnapshot(
        sitesRef,
        (snapshot) => {

            siteList.innerHTML =
                "";

            snapshot.forEach(
                (siteDoc) => {

                    const site =
                        siteDoc.data();

                    const canEdit =
                        currentRole ===
                        "owner" ||

                        currentRole ===
                        "admin" ||

                        (
                            currentRole ===
                            "standard" &&
                            site.createdBy ===
                            currentUser
                        );

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

                            ${site.category}

                            <br>

                            <small>
                                ${site.description || ""}
                            </small>

                            ${
                                site.featured
                                ?
                                "<br>⭐ Featured"
                                :
                                ""
                            }

                            ${
                                site.hidden
                                ?
                                "<br>👁 Hidden"
                                :
                                ""
                            }

                        </div>

                        ${
                            canEdit
                            ?
                            `
                            <div class="button-row">

                                <button
                                    class="edit-site"
                                    data-id="${siteDoc.id}"
                                >
                                    Edit
                                </button>

                                <button
                                    class="toggle-feature"
                                    data-id="${siteDoc.id}"
                                    data-state="${site.featured}"
                                >
                                    Feature
                                </button>

                                <button
                                    class="toggle-hidden"
                                    data-id="${siteDoc.id}"
                                    data-state="${site.hidden}"
                                >
                                    Hide
                                </button>

                                ${
                                    currentRole !==
                                    "standard"
                                    ?
                                    `
                                    <button
                                        class="delete-site"
                                        data-id="${siteDoc.id}"
                                    >
                                        Delete
                                    </button>
                                    `
                                    :
                                    ""
                                }

                            </div>
                            `
                            :
                            ""
                        }
                    `;

                    siteList.appendChild(
                        div
                    );
                }
            );

            setupSiteButtons();
        }
    );

    //
    // ADD SITE
    //
    addBtn.onclick =
    async () => {

        const name =
            document.getElementById(
                "siteName"
            ).value.trim();

        const image =
            document.getElementById(
                "siteImage"
            ).value.trim();

        const url =
            document.getElementById(
                "siteURL"
            ).value.trim();

        const description =
            document.getElementById(
                "siteDescription"
            ).value.trim();

        const category =
            document.getElementById(
                "siteCategory"
            ).value;

        await addDoc(
            sitesRef,
            {
                name,
                image,
                url,
                description,
                category,
                featured: false,
                hidden: false,
                createdBy:
                    currentUser,
                createdAt:
                    Date.now()
            }
        );
    };
}

//
// SITE BUTTONS
//
function setupSiteButtons() {

    document
        .querySelectorAll(
            ".delete-site"
        )
        .forEach(btn => {

            btn.onclick =
            async () => {

                await deleteDoc(
                    doc(
                        db,
                        "sites",
                        btn.dataset.id
                    )
                );
            };
        });

    document
        .querySelectorAll(
            ".toggle-feature"
        )
        .forEach(btn => {

            btn.onclick =
            async () => {

                await updateDoc(
                    doc(
                        db,
                        "sites",
                        btn.dataset.id
                    ),
                    {
                        featured:
                            btn.dataset.state
                            !== "true"
                    }
                );
            };
        });

    document
        .querySelectorAll(
            ".toggle-hidden"
        )
        .forEach(btn => {

            btn.onclick =
            async () => {

                await updateDoc(
                    doc(
                        db,
                        "sites",
                        btn.dataset.id
                    ),
                    {
                        hidden:
                            btn.dataset.state
                            !== "true"
                    }
                );
            };
        });
}