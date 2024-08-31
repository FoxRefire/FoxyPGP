if(chrome.windows){
    chrome.action.onClicked.addListener(() => {
        chrome.windows.create({
            url: "popup/manager.html",
            type: "popup",
            width: 710,
            height: 570
        });
    });
}

function createMenu(){
    chrome.contextMenus.create({
        id: "editor",
        title: "Open as FoxyPGP editor",
        contexts: ["editable","selection"]
    })
}

if(chrome.contextMenus){
    chrome.runtime.onInstalled.addListener(createMenu)
    chrome.runtime.onStartup.addListener(createMenu)
    chrome.contextMenus.onClicked.addListener(async (info, tab) => {
        let text = await chrome.tabs.sendMessage(tab.id, {type: "openEditor", text: info.selectionText}) || ""
        chrome.windows.create({
            url: `popup/editor.html?text=${encodeURIComponent(text)}`,
            type: "popup",
            width: 710,
            height: 570
        });
    })
}
