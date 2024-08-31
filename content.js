chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.text){
        sendResponse(message.text)
    } else if(document.activeElement.value) {
        sendResponse(document.activeElement.value)
    }
})
