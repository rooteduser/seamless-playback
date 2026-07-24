// register spotify and attach new button
let button = null;
let buttonObserver = null;

function attachButtonObserver(newButton) {
    if (buttonObserver) {
        buttonObserver.disconnect();
    }

    button = newButton;
    browser.runtime.sendMessage({
        type: "REGISTER_SPOTIFY",
        playing: getLabel(button)
    });

    buttonObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.attributeName === "aria-label") {
                browser.runtime.sendMessage({
                    type: getLabel(button) ? "SPOTIFY_PLAYED" : "SPOTIFY_PAUSED"
                });
            }
        }
    });

    buttonObserver.observe(button, {
        attributes: true,
        attributeFilter: ["aria-label"]
    });
}

// get the current playing label
function getLabel(button) {
    let label = button ? button.getAttribute("aria-label") : null;
    if(label === "Play") return false;
    else if(label === "Pause") return true;
    else return null; 
}

// observes changes in the page and calls attachButtonObserver when there is a change
const pageObserver = new MutationObserver(() => {
    const newButton = document.querySelector(
        '[data-testid="control-button-playpause"]'
    );

    if (newButton && newButton !== button) {
        attachButtonObserver(newButton);
    }
});

pageObserver.observe(document.body, {
    childList: true,
    subtree: true
});

// initial setup
const initialButton = document.querySelector(
    '[data-testid="control-button-playpause"]'
);

if (initialButton) {
    attachButtonObserver(initialButton);
}

// listens for incoming messages
browser.runtime.onMessage.addListener((message, sender) => {
    playing = getLabel(button);
    if(message === "FIRST_PAUSE" && playing === true){
        button.click()
    }
    else if(message === "PAUSE_SPOTIFY" && playing === true){
        button.click()
        console.log("Pause")
    } 
    else if(message === "RESUME_SPOTIFY" && playing === false) {
        button.click()
        console.log("Play")
    } 
})
