export default {
    alert(title, msg){
        let content = `
            <div id="modalAlertElem" class="modal">
                <div class="modal-content">
                    <h4>${title}</h4>
                    <p id="modalMsg">${msg}</p>
                </div>
                <div class="modal-footer">
                    <a href="#!" class="modal-close waves-effect btn-flat">OK</a>
                </div>
            </div>
        `
        modalContainer.innerHTML = content
        M.Modal.init(modalAlertElem, null)
        return new Promise(resolve => {
            let modal = M.Modal.getInstance(modalAlertElem)
            modal.options.onCloseEnd = () => resolve()
            modal.open()
        })
    },
    confirm(title,msg){
        let content = `
            <div id="modalConfirmElem" class="modal">
                <div class="modal-content">
                    <h4>${title}</h4>
                    <p id="modalMsg">${msg}</p>
                </div>
                <div class="modal-footer">
                    <a href="#!" class="modal-close waves-effect btn-flat">No</a>
                    <a id="modalConfirmed" href="#!" class="waves-effect btn-flat">Yes</a>
                </div>
            </div>
        `
        modalContainer.innerHTML = content
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
        let content = `
            <div id="modalPassphrase" class="modal">
                <div class="modal-content">
                    <h4>Enter Passphrase</h4>
                    <p>Enter a passphrase of your private key</p>
                    <form>
                        <div class="input-field">
                            <input id="passphrase" type="password" placeholder="*********" required>
                        </div>
                        <input type="submit" class="hide">
                    </form>
                </div>
                <div class="modal-footer">
                    <a href="#!" class="modal-close waves-effect btn-flat">Cancel</a>
                    <a id="modalOK" href="#!" class="waves-effect btn-flat">OK</a>
                </div>
            </div>
        `
        modalContainer.innerHTML = content
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
        let content = `
            <div id="modalNewPassphrase" class="modal">
                <div class="modal-content">
                    <h4>Set new passphrase</h4>
                    <form>
                        <div class="input-field">
                            <input id="newPass" type="password" placeholder="*********" required>
                            <label for="name">New passphrase</label>
                        </div>
                        <div class="input-field">
                            <input id="newPassConfirm" type="password" placeholder="*********" required>
                            <label for="name">Confirm new passphrase</label>
                        </div>
                        <input type="submit" class="hide">
                    </form>
                </div>
                <div class="modal-footer">
                    <a href="#!" class="modal-close waves-effect btn-flat">Cancel</a>
                    <a id="modalOK" href="#!" class="waves-effect btn-flat">OK</a>
                </div>
            </div>
        `
        modalContainer.innerHTML = content
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