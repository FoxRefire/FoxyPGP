import { t } from "./i18n.js";

export default {
    alert(title, msg){
        const modalContainer = document.getElementById("modalContainer");
        let content = `
            <div id="modalAlertElem" class="modal">
                <div class="modal-content">
                    <h4>${title}</h4>
                    <p id="modalMsg">${msg}</p>
                </div>
                <div class="modal-footer">
                    <a href="#!" class="modal-close waves-effect btn-flat">${t("ok")}</a>
                </div>
            </div>
        `
        modalContainer.innerHTML = content
        const modalAlertElem = document.getElementById("modalAlertElem");
        M.Modal.init(modalAlertElem, null)
        return new Promise(resolve => {
            let modal = M.Modal.getInstance(modalAlertElem)
            modal.options.onCloseEnd = () => resolve()
            modal.open()
        })
    },
    confirm(title,msg){
        const modalContainer = document.getElementById("modalContainer");
        let content = `
            <div id="modalConfirmElem" class="modal">
                <div class="modal-content">
                    <h4>${title}</h4>
                    <p id="modalMsg">${msg}</p>
                </div>
                <div class="modal-footer">
                    <a href="#!" class="modal-close waves-effect btn-flat">${t("no")}</a>
                    <a id="modalConfirmed" href="#!" class="waves-effect btn-flat">${t("yes")}</a>
                </div>
            </div>
        `
        modalContainer.innerHTML = content
        const modalConfirmElem = document.getElementById("modalConfirmElem");
        const modalConfirmed = document.getElementById("modalConfirmed");
        M.Modal.init(modalConfirmElem, null)
        return new Promise((resolve, reject) => {
            let modal = M.Modal.getInstance(modalConfirmElem)
            modal.options.onCloseEnd = _ => reject()
            modalConfirmed.addEventListener("click", _ => {
                resolve()
                modal.close()
            })
            modal.open()
        })
    },
    enterPassphrase(){
        const modalContainer = document.getElementById("modalContainer");
        let content = `
            <div id="modalPassphrase" class="modal">
                <div class="modal-content">
                    <h4>${t("enterPassphrase")}</h4>
                    <p>${t("enterPassphraseMessage")}</p>
                    <form>
                        <div class="input-field">
                            <input id="passphrase" type="password" placeholder="${t("passphrasePlaceholder")}" required>
                        </div>
                        <input type="submit" class="hide">
                    </form>
                </div>
                <div class="modal-footer">
                    <a href="#!" class="modal-close waves-effect btn-flat">${t("cancel")}</a>
                    <a id="modalOK" href="#!" class="waves-effect btn-flat">${t("ok")}</a>
                </div>
            </div>
        `
        modalContainer.innerHTML = content
        const modalPassphrase = document.getElementById("modalPassphrase");
        const modalOK = document.getElementById("modalOK");
        const passphrase = document.getElementById("passphrase");
        M.Modal.init(modalPassphrase, null)
        return new Promise((resolve, reject) => {
            let modal = M.Modal.getInstance(modalPassphrase)
            modal.options.onCloseEnd = _ => reject()
            modalOK.addEventListener("click", _ => {
                resolve(passphrase.value)
                modal.close()
            })
            modalPassphrase.addEventListener("submit", e => {
                e.preventDefault()
                resolve(passphrase.value)
                modal.close()
            })
            modal.open()
        })
    },
    newPassphrase(){
        const modalContainer = document.getElementById("modalContainer");
        let content = `
            <div id="modalNewPassphrase" class="modal">
                <div class="modal-content">
                    <h4>${t("setNewPassphrase")}</h4>
                    <form>
                        <div class="input-field">
                            <input id="newPass" type="password" placeholder="${t("passphrasePlaceholder")}" required>
                            <label for="name">${t("newPassphrase")}</label>
                        </div>
                        <div class="input-field">
                            <input id="newPassConfirm" type="password" placeholder="${t("passphrasePlaceholder")}" required>
                            <label for="name">${t("confirmNewPassphrase")}</label>
                        </div>
                        <input type="submit" class="hide">
                    </form>
                </div>
                <div class="modal-footer">
                    <a href="#!" class="modal-close waves-effect btn-flat">${t("cancel")}</a>
                    <a id="modalOK" href="#!" class="waves-effect btn-flat">${t("ok")}</a>
                </div>
            </div>
        `
        modalContainer.innerHTML = content
        const modalNewPassphrase = document.getElementById("modalNewPassphrase");
        const modalOK = document.getElementById("modalOK");
        const newPass = document.getElementById("newPass");
        const newPassConfirm = document.getElementById("newPassConfirm");
        M.Modal.init(modalNewPassphrase, null)
        return new Promise((resolve, reject) => {
            let modal = M.Modal.getInstance(modalNewPassphrase)
            modal.options.onCloseEnd = _ => reject()
            modalOK.addEventListener("click", _ => {
                resolve([newPass.value, newPassConfirm.value])
                modal.close()
            })
            modalNewPassphrase.addEventListener("submit", e => {
                e.preventDefault()
                resolve([newPass.value, newPassConfirm.value])
                modal.close()
            })
            modal.open()
        })
    }
}