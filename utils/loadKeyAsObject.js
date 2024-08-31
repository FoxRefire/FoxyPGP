import * as openpgp from "/libs/openpgp.min.mjs"
import modal from "/utils/modal.js";
export default async function(id, type){
    let keys = await chrome.storage.local.get("keys").then(v => v.keys)
    if(type == "public"){
        return await openpgp.readKey({armoredKey:  keys[id][0]})
    } else if(type=="private"){
        let privateKey = await openpgp.readPrivateKey({armoredKey: keys[id][1]})
        if(privateKey.isDecrypted()){
            return privateKey
        } else {
            let passphrase = await modal.enterPassphrase()
            try{
                return await openpgp.decryptKey({
                    privateKey: privateKey,
                    passphrase
                })
            } catch {
                await modal.alert("Error", "Passphrase incorrect")
                throw "Passphrase incorrect"
            }
        }
    }
}
