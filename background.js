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
