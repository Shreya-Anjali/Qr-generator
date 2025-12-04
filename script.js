document.getElementById("download-btn").style.display = "none";

function uploadAndGenerate() {
    const details = document.getElementById("person_details").value.trim();
    const fileInput = document.getElementById("file_input").files[0];

    if (!details && !fileInput) {
        alert("Please enter details or upload a file.");
        return;
    }

    if (!fileInput) {
        createQR({ details });
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        createQR({
            details,
            fileName: fileInput.name,
            fileType: fileInput.type,
            fileBase64: e.target.result
        });
    };
    reader.readAsDataURL(fileInput);
}

function createQR(data) {
    const jsonString = JSON.stringify(data);

    // Use window.location.origin for absolute URL (works on GitHub Pages)
    const baseURL = window.location.origin + window.location.pathname.replace("index.html", "");
    const viewerURL = baseURL + "viewer.html?" + encodeURIComponent(jsonString);

    const qrcodeEl = document.getElementById("qrcode");
    qrcodeEl.innerHTML = "";

    const qr = new QRCode(qrcodeEl, {
        text: viewerURL,
        width: 256,
        height: 256,
        correctLevel: QRCode.CorrectLevel.H
    });

    // Use MutationObserver to detect when QR img is added to DOM
    const observer = new MutationObserver
