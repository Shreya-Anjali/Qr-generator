document.getElementById("download-btn").style.display = "none";

function uploadAndGenerate() {
    let details = document.getElementById("person_details").value.trim();
    let fileInput = document.getElementById("file_input").files[0];

    if (!details && !fileInput) {
        alert("Please enter details or upload a file.");
        return;
    }

    if (!fileInput) {
        createQR({ details });
        return;
    }

    let reader = new FileReader();
    reader.onload = function(e) {
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
    let jsonString = JSON.stringify(data);

    // Simplified URL for local testing
    let viewerURL = "viewer.html?" + encodeURIComponent(jsonString);

    let qrcodeEl = document.getElementById("qrcode");
    qrcodeEl.innerHTML = ""; // clear previous QR

    let qr = new QRCode(qrcodeEl, {
        text: viewerURL,
        width: 256,
        height: 256,
        correctLevel: QRCode.CorrectLevel.H
    });

    // Wait for QR to render
    qrcodeEl.querySelector("img").onload = () => {
        let btn = document.getElementById("download-btn");
        btn.style.display = "block";
        btn.onclick = () => {
            let link = document.createElement("a");
            link.href = qrcodeEl.querySelector("img").src;
            link.download = "medical_qr.png";
            link.click();
        };
    };
}

