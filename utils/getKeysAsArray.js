import * as openpgp from "/libs/openpgp.min.mjs"
import escapeHTML from "/utils/escapeHTML.js"

export default async function(type){
    let keys = await chrome.storage.local.get("keys").then(v => v.keys)
    let readKey
    let _type = type
    let data = []
    for(let [id, k] of Object.entries(keys)){
        if(_type == "private" && k.length != 2) continue
        
        let key = await openpgp.readKey({armoredKey: k[0]})
        let name = escapeHTML(key.users[0].userID.name ? key.users[0].userID.name : key.users[0].userID.userID)
        let email = escapeHTML(key.users[0].userID.email ? key.users[0].userID.email : "null")
        let type = k.length === 2 ? "pub+priv" : "pub"
        let creationTime = escapeHTML(key.getCreationTime().toString())
        let expirationTime = escapeHTML(await key.getExpirationTime().then(t => t.toString()))
        let algorithm = escapeHTML(Object.values(key.getAlgorithmInfo()).toString())
        let fingerprint = escapeHTML(key.getFingerprint())
        data.push({name, email, type, creationTime, expirationTime, id, algorithm, fingerprint})
    }
    return data
}