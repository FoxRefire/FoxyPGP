import "/libs/jquery.min.js"
import * as openpgp from "/libs/openpgp.min.mjs"

document.addEventListener('DOMContentLoaded', async () => {
    M.FloatingActionButton.init($(".fixed-action-btn"), {hoverEnabled: false});
    M.Tooltip.init($(".tooltipped"), null);
    writeKeysList(await getKeysAsArray())
    addHandler()
});

function addHandler(){
    Array.from($('tr[name="key"]')).forEach(e => {
        e.addEventListener("click", () => location.href = `/popup/view.html?id=${e.id}`)
    })
}

async function getKeysAsArray(){
    let keys = await chrome.storage.local.get("keys").then(v => v.keys)
    let data = []
    for(let [id, k] of Object.entries(keys)){
        let key = await openpgp.readKey({armoredKey: k[0]})
        console.log(key)
        let name = key.users[0].userID.name ? key.users[0].userID.name : key.users[0].userID.userID
        let email = key.users[0].userID.email ? key.users[0].userID.email : "null"
        let type = k.length === 2 ? "pub+priv" : "pub"
        data.push({name, email, type, id})
    }
    return data
}

function writeKeysList(arr){
    arr.forEach(item => {
        $("#keys-tbody")[0].insertAdjacentHTML("afterbegin", `
            <tr id=${item.id} name="key">
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.type}</td>
                <td>${item.id}</td>
            </tr>
        `)
    })
}
