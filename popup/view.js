import "/libs/jquery.min.js"
import getKeysAsArray from "/utils/getKeysAsArray.js"


document.addEventListener('DOMContentLoaded', async () => {
    writeKeyDetails()
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
