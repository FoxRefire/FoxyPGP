import "/libs/jquery.min.js"
import * as openpgp from "/libs/openpgp.min.mjs"
import getKeysAsArray from "/utils/getKeysAsArray.js"
import loadKeyAsObject from "/utils/loadKeyAsObject.js"
import modal from "/utils/modal.js";
import { translateDocument, t } from "/utils/i18n.js";

document.addEventListener('DOMContentLoaded', async () => {
    translateDocument();
    $("#editorText")[0].value = (new URL(location.href)).searchParams.get("text")
    window.id = (new URL(location.href)).searchParams.get("id")
    window.id && hideUnnecessaryElement(window.id)
});

async function hideUnnecessaryElement(id){
    let keys = await chrome.storage.local.get("keys").then(v => v.keys[window.id])
    if(keys.length != 2){
        $("#sign")[0].style.display = "none"
        $("#decrypt")[0].style.display = "none"
    }
}

async function selectKey(type){
    if(window.id){
        return window.id
    }
    $("#editor-block")[0].style.display = "none"
    $("#selector-block")[0].style.display = null
    $("#select-key")[0].innerHTML = ""

    let data = await getKeysAsArray(type)
    data.forEach(item => {
        $("#select-key")[0].insertAdjacentHTML("afterbegin", `
            <li id=${item.id} class="collection-item">${item.name} (${item.email})</li>
        `)
    })
    return await new Promise(resolve => {
        $("#selector-block")[0].addEventListener("click", e => {
            $("#editor-block")[0].style.display = null
            $("#selector-block")[0].style.display = "none"

            resolve(e.target.id)
        })
    })
}

$("#sign")[0].addEventListener("click", async () => {
    let selectedID = await selectKey("private")
    let key = await loadKeyAsObject(selectedID, "private")

    $("#editorText")[0].value = await openpgp.sign({
        message: await openpgp.createCleartextMessage({text: $("#editorText")[0].value}),
        signingKeys: key
    });
})

$("#verify")[0].addEventListener("click", async () => {
    let selectedID = await selectKey("public")
    let key = await loadKeyAsObject(selectedID, "public")

    let result = await openpgp.verify({
        message: await openpgp.readCleartextMessage({cleartextMessage: $("#editorText")[0].value}),
        verificationKeys: key
    })

    try{
        await result.signatures[0].verified ? modal.alert(t("ok"), t("signatureVerified")) : Error()
    } catch {
        modal.alert(t("error"), t("signatureMismatched"))
    }
})

$("#encrypt")[0].addEventListener("click", async () => {
    let selectedID = await selectKey("public")
    let key = await loadKeyAsObject(selectedID, "public")

    $("#editorText")[0].value = await openpgp.encrypt({
        message: await openpgp.createMessage({text: $("#editorText")[0].value}),
        encryptionKeys: key
    })
})

$("#decrypt")[0].addEventListener("click", async () => {
    let selectedID = await selectKey("private")
    let key = await loadKeyAsObject(selectedID, "private")

    try {
        $("#editorText")[0].value = await openpgp.decrypt({
            message: await openpgp.readMessage({armoredMessage: $("#editorText")[0].value}),
            decryptionKeys: key
        }).then(obj => obj.data)
    } catch {
        modal.alert(t("error"), t("decryptionFailed"))
    }
})