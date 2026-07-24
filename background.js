// Setter methods for extension session storage
async function setYtTab(tabId) {
    await browser.storage.session.set({ ytId: tabId })
}

async function setSpfyTab(tabId) {
    await browser.storage.session.set({ spfyId: tabId })
}

async function setYtPlay(val) {
    await browser.storage.session.set({ ytPlay: val })
}

async function setSpfyPlay(val) {
    await browser.storage.session.set({ spfyPlay: val })
}

async function setYtPaused(val) {
    await browser.storage.session.set({ ytPaused: val })
}

async function setSpfyPaused(val) {
    await browser.storage.session.set({ spfyPaused: val })
}

// Listener and other logic
browser.runtime.onMessage.addListener((message, sender) => {
    switch (message.type) {

        case "REGISTER_YOUTUBE":
            setYtTab(sender.tab.id).then(() => {
                browser.tabs.sendMessage(sender.tab.id, "FIRST_PAUSE")
            })
            break

        case "REGISTER_SPOTIFY":
            setSpfyTab(sender.tab.id).then(() => {
                browser.tabs.sendMessage(sender.tab.id, "FIRST_PAUSE")
            })
            break

        case "SPOTIFY_PLAYED":
            setSpfyPlay(true).then(async () => {
                const { ytId, ytPlay } = await browser.storage.session.get(["ytId", "ytPlay"])
                if (ytId && ytPlay) {
                    browser.tabs.sendMessage(ytId, "PAUSE_YOUTUBE")
                    setYtPaused(true)
                }
            })
            break;

        case "SPOTIFY_PAUSED":
            setSpfyPlay(false).then(async () => {
                const { ytId, ytPaused } = await browser.storage.session.get(["ytId", "ytPaused"])
                if (ytId && ytPaused) {
                    browser.tabs.sendMessage(ytId, "RESUME_YOUTUBE")
                    setYtPaused(false)
                }
            })
            break

        case "YT_PLAYED":
            setYtPlay(true).then(async () => {
                const { spfyId, spfyPlay } = await browser.storage.session.get(["spfyId", "spfyPlay"])
                if (spfyId && spfyPlay) {
                    browser.tabs.sendMessage(spfyId, "PAUSE_SPOTIFY")
                    setSpfyPaused(true)
                }
            })
            break;

        case "YT_PAUSED":
            setYtPlay(false).then(async () => {
                const { spfyId, spfyPaused } = await browser.storage.session.get(["spfyId", "spfyPaused"])
                if (spfyId && spfyPaused) {
                    browser.tabs.sendMessage(spfyId, "RESUME_SPOTIFY")
                    setSpfyPaused(false)
                }
            })
            break
    }
})