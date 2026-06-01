const params = new URLSearchParams(window.location.search);

let url = params.get("url");
const name = params.get("name");

const frame = document.getElementById("siteFrame");
const blockedMessage = document.getElementById("blockedMessage");
const openSiteBtn = document.getElementById("openSiteBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

if (!url || url === "null" || url === "undefined") {
    alert("No valid URL provided");
    window.location.href = "/";
}

try {
    url = decodeURIComponent(url);
} catch (e) {
    console.error("URL decode failed");
}

frame.src = url;
openSiteBtn.href = url;

//
// SMART EMBED CHECK
//
let loaded = false;

frame.onload = () => {
    loaded = true;
};

setTimeout(() => {
    if (!loaded) {
        frame.style.display = "none";
        blockedMessage.classList.remove("hidden");
    }
}, 5000);

//
// FULLSCREEN
//
fullscreenBtn.addEventListener("click", async () => {
    try {
        await frame.requestFullscreen();
    } catch (e) {
        console.error(e);
    }
});