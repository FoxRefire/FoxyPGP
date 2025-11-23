import "/libs/jquery.min.js"
import * as openpgp from "/libs/openpgp.min.mjs"
import modal from "/utils/modal.js";
import getTextFromFileChooser from "/utils/getTextFromFileChooser.js";
import { translateDocument, t } from "/utils/i18n.js";

document.addEventListener('DOMContentLoaded', () => {
    translateDocument();
    M.Tabs.init($(".tabs"), null);
});

async function addKey(keys){
    let current = await chrome.storage.local.get("keys").then(v => v.keys)
    if(!current){
        current = {}
    }
    let id = await openpgp.readKey({armoredKey: keys[0]}).then(k => k.getKeyID().toHex())
    current[id] = keys
    await chrome.storage.local.set({keys: current})
}

//Generate Key Pair
$("#generate")[0].addEventListener("submit", async e => {
    e.preventDefault()
    let uid
    if($("#email")[0].value){
        uid = [{ name: $("#name")[0].value, email: $("#email")[0].value}]
    } else {
        uid = [{ name: $("#name")[0].value}]
    }

    if($("#passphrase")[0].value != $("#passphrase-confirm")[0].value){
        return
    }

    let {privateKey, publicKey} = await openpgp.generateKey({
        userIDs: uid,
        passphrase: $("#passphrase")[0].value
    })
    addKey([publicKey, privateKey])
    await modal.alert(t("succeed"), t("keyPairCreated"))
    location.href = "/popup/manager.html"
})

//Import Key Pair
$("#privKeySelect")[0].addEventListener("click", async e => {
    $("#privKeyArea")[0].value = await getTextFromFileChooser()
})
$("#import-priv")[0].addEventListener("submit", async e => {
    e.preventDefault()
    let loadedPrivateKey = await openpgp.readPrivateKey({armoredKey: $("#privKeyArea")[0].value})
    let armoredPublicKey = loadedPrivateKey.toPublic().armor()
    let armoredPrivateKey = loadedPrivateKey.armor()

    addKey([armoredPublicKey, armoredPrivateKey])
    await modal.alert(t("succeed"), t("keyPairImported"))
    location.href = "/popup/manager.html"
})

//Import Public Key
$("#pubKeySelect")[0].addEventListener("click", async () => {
    $("#pubKeyArea")[0].value = await getTextFromFileChooser()
})
$("#import-pub")[0].addEventListener("submit", async e => {
    e.preventDefault()
    let armoredPublicKey = await openpgp.readKey({armoredKey: $("#pubKeyArea")[0].value}).then(k => k.armor())

    addKey([armoredPublicKey])
    await modal.alert(t("succeed"), t("publicKeyImported"))
    location.href = "/popup/manager.html"
})