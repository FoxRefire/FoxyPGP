import * as openpgp from "/libs/openpgp.min.mjs"
export default async function(id, type){
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
