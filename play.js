const params =
    new URLSearchParams(
        window.location.search
    );

let url =
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
    window.location.href =
        "/";
}

try {
    url =
        decodeURIComponent(
            url
        );
} catch {}

frame.src = url;

openSiteBtn.href = url;

//
// KEYBOARD FIX
//
frame.setAttribute(
    "tabindex",
    "0"
);

frame.addEventListener(
    "load",
    () => {

        setTimeout(() => {
            frame.focus();

            try {
                frame.contentWindow.focus();
            } catch {}
        }, 300);
    }
);

//
// SMART BLOCK DETECTION
//
let loaded = false;

frame.onload = () => {
    loaded = true;
};

setTimeout(() => {

    if (!loaded) {

        frame.style.display =
            "none";

        blockedMessage
            .classList
            .remove(
                "hidden"
            );
    }

}, 5000);

//
// FULLSCREEN
//
fullscreenBtn
.addEventListener(
    "click",
    async () => {

        try {

            await frame
                .requestFullscreen();

            setTimeout(() => {

                frame.focus();

                try {
                    frame
                    .contentWindow
                    .focus();
                } catch {}

            }, 300);

        } catch (e) {
            console.error(e);
        }
    }
);