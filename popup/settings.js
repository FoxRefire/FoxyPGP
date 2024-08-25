import "/libs/jquery.min.js"
import downloadTextData from "/utils/downloadTextData.js"

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

$("#backupDB")[0].addEventListener("click", async () => {
    let data = await chrome.storage.local.get(null)
    downloadTextData(JSON.stringify(data, null, "\t"), `FoxyPGP_backup_${Date.now()}.json`)
})
$("#restoreDB")[0].addEventListener("click", async () => {
    let data = JSON.parse(await openFileChooser())
    let confirmBool = confirm("Are you sure you want to restore the backup? Doing this will overwrite the original data.")
    if(data && confirmBool){
        await chrome.storage.local.clear();
        await chrome.storage.local.set(data)
    }
})
$("#clearDB")[0].addEventListener("click", async () => {
    let confirmBool = confirm("Are you sure you want to delete the database? Unless you have a backup, you will never be able to restore it again.")
    if(confirmBool){
        await chrome.storage.local.clear();
    }
})