import "/libs/jquery.min.js"
import downloadTextData from "/utils/downloadTextData.js"
import modal from "/utils/modal.js";
import getTextFromFileChooser from "/utils/getTextFromFileChooser.js";
import { translateDocument, t } from "/utils/i18n.js";

document.addEventListener('DOMContentLoaded', () => {
    translateDocument();
});

$("#backupDB")[0].addEventListener("click", async () => {
    let data = await chrome.storage.local.get(null)
    downloadTextData(JSON.stringify(data, null, "\t"), `FoxyPGP_backup_${Date.now()}.json`)
})
$("#restoreDB")[0].addEventListener("click", async () => {
    let data = JSON.parse(await getTextFromFileChooser())
    await modal.confirm(t("confirm"), t("confirmRestoreBackup"))
    if(data){
        await chrome.storage.local.clear();
        await chrome.storage.local.set(data)
    }
})
$("#clearDB")[0].addEventListener("click", async () => {
    await modal.confirm(t("confirm"), t("confirmClearDatabase"))
    await chrome.storage.local.clear();
})