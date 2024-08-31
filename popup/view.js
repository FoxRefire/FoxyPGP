import "/libs/jquery.min.js"
import * as openpgp from "/libs/openpgp.min.mjs"
import getKeysAsArray from "/utils/getKeysAsArray.js"
import loadKeyAsObject from "/utils/loadKeyAsObject.js"
import downloadTextData from "/utils/downloadTextData.js"
import modal from "/utils/modal.js";


document.addEventListener('DOMContentLoaded', async () => {
    writeKeyDetails()
    hideUnnesesaryElement()
})

async function writeKeyDetails(){
    let id = (new URL(location.href)).searchParams.get("id")
    let data = (await getKeysAsArray()).find(e => e.id==id)
    let details = [
        ["Name", data.name],
        ["Email", data.email],
        ["Type", data.type],
        ["Creation Time", data.creationTime],
        ["Expiration Time", data.expirationTime],
        ["Algorithm", data.algorithm],
        ["ID", data.id],
        ["Fingerprint", data.fingerprint]
    ]
    details.forEach(item => {
        $("#detailsTable")[0].insertAdjacentHTML("beforeend", `
            <tr>
                <th>${item[0]}</th>
                <th>${item[1]}</th>
            </tr>
        `)
    })
}

async function hideUnnesesaryElement(){
    let id = (new URL(location.href)).searchParams.get("id")
    let type = (await getKeysAsArray()).find(e => e.id==id).type
    if(type == "pub"){
        $("#changePass")[0].style.display = "none"
        $("#exportPriv")[0].style.display = "none"
    }
}

function openEditor(){
    let id = (new URL(location.href)).searchParams.get("id")
    location.href = `/popup/editor.html?id=${id}`
}

async function changePass(){
    let id = (new URL(location.href)).searchParams.get("id")
    let key = await loadKeyAsObject(id, "private")
    let [newPass, newPassConfirm] = await modal.newPassphrase()

    if(newPass != newPassConfirm){
        modal.alert("Error", "Passphrase wasn't match")
        return
    }

    let reEncryptedKey = await openpgp.encryptKey({privateKey:key, passphrase:newPass})
    let current = await chrome.storage.local.get("keys").then(v => v.keys)
    current[id] = [reEncryptedKey.toPublic().armor(), reEncryptedKey.armor()]
    await chrome.storage.local.set({keys: current})
}

async function removeKey(){
    await modal.confirm("Confirm", "Are you sure you want to remove this key? Unless you have a backup, you will never be able to restore it again.")
    let id = (new URL(location.href)).searchParams.get("id")
    let current = await chrome.storage.local.get("keys").then(v => v.keys)
    delete current[id]
    await chrome.storage.local.set({keys: current})
    location.href = "/popup/manager.html"
}

async function exportPub() {
    let id = (new URL(location.href)).searchParams.get("id")
    let key = await loadKeyAsObject(id, "public")
    downloadTextData(key.armor(), `${key.getUserIDs()[0]}.pub.pem`)
}

async function exportPriv() {
    let id = (new URL(location.href)).searchParams.get("id")
    let key = await loadKeyAsObject(id, "private")
    downloadTextData(key.armor(), `${key.getUserIDs()[0]}.priv.pem`)
}

$("#openEditor")[0].addEventListener("click", openEditor)
$("#changePass")[0].addEventListener("click", changePass)
$("#removeKey")[0].addEventListener("click", removeKey)
$("#exportPub")[0].addEventListener("click", exportPub)
$("#exportPriv")[0].addEventListener("click", exportPriv)