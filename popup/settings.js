import "/libs/jquery.min.js"
import downloadTextData from "/utils/downloadTextData.js"
import modal from "/utils/modal.js";
import getTextFromFileChooser from "/utils/getTextFromFileChooser.js";

$("#backupDB")[0].addEventListener("click", async () => {
    let data = await chrome.storage.local.get(null)
    downloadTextData(JSON.stringify(data, null, "\t"), `FoxyPGP_backup_${Date.now()}.json`)
})
$("#restoreDB")[0].addEventListener("click", async () => {
    let data = JSON.parse(await getTextFromFileChooser())
    await modal.confirm("Confirm", "Are you sure you want to restore the backup? Doing this will overwrite the original data.")
    if(data){
        await chrome.storage.local.clear();
        await chrome.storage.local.set(data)
    }
})
$("#clearDB")[0].addEventListener("click", async () => {
    await modal.confirm("Confirm", "Are you sure you want to delete the database? Unless you have a backup, you will never be able to restore it again.")
    await chrome.storage.local.clear();
})