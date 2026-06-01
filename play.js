const params =
    new URLSearchParams(
        window.location.search
    );

const url =
    params.get("url");

const frame =
    document.getElementById(
        "siteFrame"
    );

const blockedMessage =
    document.getElementById(
        "blockedMessage"
    );

const openSiteBtn =
    document.getElementById(
        "openSiteBtn"
    );

const fullscreenBtn =
    document.getElementById(
        "fullscreenBtn"
    );

if (!url) {
    location.href = "/";
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
        frame.style.display =
            "none";

        blockedMessage.classList.remove(
            "hidden"
        );
    }
}, 4000);

//
// FULLSCREEN
//
fullscreenBtn.addEventListener(
    "click",
    async () => {
        try {
            if (
                frame.requestFullscreen
            ) {
                await frame.requestFullscreen();
            }
        } catch (e) {
            console.error(e);
        }
    }
);