import "/libs/jquery.min.js"
import * as openpgp from "/libs/openpgp.min.mjs"

async function selectKey(type){
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

async function getKeysAsArray(type){
    let keys = await chrome.storage.local.get("keys").then(v => v.keys)
    let readKey
    let _type = type
    let data = []
    for(let [id, k] of Object.entries(keys)){
        if(_type == "private" && k.length != 2) continue
        
        let key = await openpgp.readKey({armoredKey: k[0]})
        let name = key.users[0].userID.name ? key.users[0].userID.name : key.users[0].userID.userID
        let email = key.users[0].userID.email ? key.users[0].userID.email : "null"
        let type = k.length === 2 ? "pub+priv" : "pub"
        data.push({name, email, type, id})
    }
    return data
}

async function loadKeyAsObject(id, type){
    let keys = await chrome.storage.local.get("keys").then(v => v.keys)
    if(type == "public"){
        return await openpgp.readKey({armoredKey:  keys[id][0]})
    } else if(type=="private"){
        let passphrase = prompt("Enter a passphrase of your private key")
        return await openpgp.decryptKey({
            privateKey: await openpgp.readPrivateKey({armoredKey: keys[id][1]}),
            passphrase
        })
    }
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
        await result.signatures[0].verified ? alert("OK: Signature verified") : Error()
    } catch {
        alert("Error: Signature mismatched")
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

    $("#editorText")[0].value = await openpgp.decrypt({
        message: await openpgp.readMessage({armoredMessage: $("#editorText")[0].value}),
        decryptionKeys: key
    }).then(obj => obj.data)
})