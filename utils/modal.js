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
    }
}