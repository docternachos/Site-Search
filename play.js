const params =
    new URLSearchParams(
        window.location.search
    );

const url =
    params.get("url");

const iframe =
    document.getElementById(
        "siteFrame"
    );

const fullscreenBtn =
    document.getElementById(
        "fullscreenBtn"
    );

const openSiteBtn =
    document.getElementById(
        "openSiteBtn"
    );

const blockedMessage =
    document.getElementById(
        "blockedMessage"
    );

//
// INVALID URL
//
if (!url) {

    window.location.href =
        "index.html";
}

//
// LOAD SITE
//
iframe.src =
    url;

openSiteBtn.href =
    url;

//
// FULLSCREEN
//
fullscreenBtn
.addEventListener(
    "click",
    () => {

        if (
            iframe.requestFullscreen
        ) {

            iframe
            .requestFullscreen();
        }
    }
);

//
// EMBED BLOCK CHECK
//
iframe.onload =
() => {

    try {

        iframe.contentWindow
        .document;

    } catch {

        //
        // site blocked
        //
        blockedMessage
            .classList
            .remove(
                "hidden"
            );

        iframe.style.display =
            "none";
    }
};

//
// KEYBOARD FIX
//
window.addEventListener(
    "click",
    () => {

        iframe.focus();
    }
);