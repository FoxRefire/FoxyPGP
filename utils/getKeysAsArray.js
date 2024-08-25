import * as openpgp from "/libs/openpgp.min.mjs"
export default async function(type){
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
        let creationTime = key.getCreationTime()
        let expirationTime = await key.getExpirationTime()
        let algorithm = Object.values(key.getAlgorithmInfo())
        let fingerprint = key.getFingerprint()
        data.push({name, email, type, creationTime, expirationTime, id, algorithm, fingerprint})
        console.log(key)
    }
    return data
}