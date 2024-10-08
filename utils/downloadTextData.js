import escapeHTML from "/utils/escapeHTML.js"

export default function(data, fileName){
    let blob = new Blob([data], {type: "text/plain"});
    let blobLink = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.download = escapeHTML(fileName);
    a.href = blobLink
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobLink);
}