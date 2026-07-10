let ytId, spfyId, spfyStatus, ytPaused, spfyPaused;
let ytPlay = false;
let spfyPlay = false;
let enabled = true;

function updateBadge() {
    browser.action.setBadgeText({
        text: enabled ? "ON" : "OFF"
    });

    browser.action.setBadgeBackgroundColor({
        color: enabled ? "green" : "red"
    });
}

updateBadge();

browser.action.onClicked.addListener(() => {
    enabled = !enabled;
    updateBadge();
});

browser.runtime.onMessage.addListener((message, sender) => {
    if(!enabled) return;
    switch(message.type) {
        case "REGISTER_YOUTUBE":
            ytId = sender.tab.id;
            browser.tabs.sendMessage(ytId, "FIRST_PAUSE");
            // if (message.playing) ytPlay = true;
            break;
            
        case "REGISTER_SPOTIFY":
            spfyId = sender.tab.id;
            browser.tabs.sendMessage(spfyId, "FIRST_PAUSE");
            // if (message.playing) spfyPlay 01.
            // = true;
            break;

        case "SPOTIFY_PLAYED":
            spfyPlay = true;
            if(ytId && ytPlay){
                browser.tabs.sendMessage(ytId, "PAUSE_YOUTUBE").catch(console.error);
                ytPaused = true;
            }
            break;
        
        case "SPOTIFY_PAUSED":
            spfyPlay = false;
            if(ytId && ytPaused){
                browser.tabs.sendMessage(ytId, "RESUME_YOUTUBE");
                ytPaused = false;
            }
            break;

        case "YT_PLAYED":
            ytPlay = true;
            if(spfyId && spfyPlay){
                browser.tabs.sendMessage(spfyId, "PAUSE_SPOTIFY");
                spfyPaused = true;
            }
            break;

        case "YT_PAUSED":
            ytPlay = false;
            if(spfyId && spfyPaused){
                browser.tabs.sendMessage(spfyId, "RESUME_SPOTIFY");
                spfyPaused = false;
            }
            break;

    }
})
