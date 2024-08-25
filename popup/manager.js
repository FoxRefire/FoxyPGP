import "/libs/jquery.min.js"
import getKeysAsArray from "/utils/getKeysAsArray.js"

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
