document.getElementById("download-btn").style.display = "none";

function testQR() {
    uploadAndGenerate();
}

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

    // Works locally & on GitHub Pages
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

    // Wait until QR `<img>` is generated
    const observer = new MutationObserver(() => {
        const img = qrcodeEl.querySelector("img");
        if (img && img.src) {
            document.getElementById("download-btn").style.display = "block";

            document.getElementById("download-btn").onclick = function () {
                downloadQR(img.src);
            };

            observer.disconnect();
        }
    });

    observer.observe(qrcodeEl, { childList: true, subtree: true });
}

function downloadQR(imageSrc) {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = "QR_Code.png";
    link.click();
}
