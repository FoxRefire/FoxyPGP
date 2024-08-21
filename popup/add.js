import "/libs/jquery.min.js"
import * as openpgp from "/libs/openpgp.min.mjs"

document.addEventListener('DOMContentLoaded', () => {
    M.Tabs.init($(".tabs"), null);
});

function openFileChooser(){
    let input = document.createElement('input');
    input.type = "file"
    input.click()
    return new Promise(resolve => {
        input.addEventListener("change", async () => {
            resolve(await input.files[0].text())
        })
    })
}

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
    alert("Key Pair has created")
    location.href = "/popup/manager.html"
})

//Import Key Pair
$("#privKeySelect")[0].addEventListener("click", async e => {
    $("#privKeyArea")[0].value = await openFileChooser()
})
$("#import-priv")[0].addEventListener("submit", async e => {
    e.preventDefault()
    let loadedPrivateKey = await openpgp.readPrivateKey({armoredKey: $("#privKeyArea")[0].value})
    let armoredPublicKey = loadedPrivateKey.toPublic().armor()
    let armoredPrivateKey = loadedPrivateKey.armor()

    addKey([armoredPublicKey, armoredPrivateKey])
    alert("Key Pair has imported")
    location.href = "/popup/manager.html"
})

//Import Public Key
$("#pubKeySelect")[0].addEventListener("click", async () => {
    $("#pubKeyArea")[0].value = await openFileChooser()
})
$("#import-pub")[0].addEventListener("submit", async e => {
    e.preventDefault()
    let armoredPublicKey = await openpgp.readKey({armoredKey: $("#pubKeyArea")[0].value}).then(k => k.armor())

    addKey([armoredPublicKey])
    alert("Public Key has imported")
    location.href = "/popup/manager.html"
})