// attach new video element
let currentVideo = null;

function attachVideo(video){
    if(!video || currentVideo === video) return;
    
    if(currentVideo){
        currentVideo.removeEventListener("play", onPlay);
        currentVideo.removeEventListener("pause", onPause);
    }

    currentVideo = video;
    
    browser.runtime.sendMessage({
        type: "REGISTER_YOUTUBE",
        playing: !video.paused
    })

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
}

// handles video transition
let changingVideo = false;

window.addEventListener("yt-navigate-start", () => {
    changingVideo = true;
});

window.addEventListener("yt-navigate-finish", () => {
    changingVideo = false;
});

// functions to play and pause
function onPlay(){    
    browser.runtime.sendMessage({
        type: "YT_PLAYED"
    })
}

function onPause(){
    if(changingVideo) return;

    browser.runtime.sendMessage({
        type: "YT_PAUSED"
        })
}

attachVideo(document.querySelector("video"));

// observe for changes in the DOM and attach the newest video element
const observer = new MutationObserver(() => {
    const video = document.querySelector("video");
    if (video && video !== currentVideo) {
        attachVideo(video);
    }
})

// watches for changes in the DOM
observer.observe(document.body, {
    childList: true,
    subtree: true
});


// handles communication with the background script
browser.runtime.onMessage.addListener((message, sender) => {
    if(message === "FIRST_PAUSE"){
        currentVideo.pause();
    }
    else if(message === "PAUSE_YOUTUBE"){
        currentVideo.pause();
    } else if(message === "RESUME_YOUTUBE") {
        currentVideo.play();
    } else {
        console.log(message);
    }
})