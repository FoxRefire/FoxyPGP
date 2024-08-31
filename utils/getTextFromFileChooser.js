export default function(){
    let input = document.createElement('input');
    input.type = "file"
    input.click()
    return new Promise(resolve => {
        input.addEventListener("change", async () => {
            resolve(await input.files[0].text())
        })
    })
}