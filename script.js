// Hide the download button initially
document.getElementById("download-btn").style.display = "none";

// Main function triggered by the "Generate QR Code" button
function uploadAndGenerate() {
    let details = document.getElementById("person_details").value.trim();
    let fileInput = document.getElementById("file_input").files[0];

    // Validate input
    if (!details && !fileInput) {
        alert("Please enter details or upload a file.");
        return;
    }

    // If no file is uploaded, generate QR with only text details
    if (!fileInput) {
        createQR({ details });
        return;
    }

    // If a file is uploaded, read it as Base64
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

// Function to generate the QR code
function createQR(data) {
    let jsonString = JSON.stringify(data);

    // GitHub Pages-compatible absolute URL
    let baseURL = window.location.href.replace("index.html", "");
    let viewerURL = baseURL + "viewer.html?" + encodeURIComponent(jsonString);

    let qrcodeEl = document.getElementById("qrcode");
    qrcodeEl.innerHTML = ""; // Clear previous QR code

    // Generate QR code
    new QRCode(qrcodeEl, {
        text: viewerURL,
        width: 256,
        height: 256,
        correctLevel: QRCode.CorrectLevel.H
    });

    // Once QR is rendered, show the download button
    let qrImg = qrcodeEl.querySelector("img");
    if (qrImg) {
        qrImg.onload = () => {
            let btn = document.getElementById("download-btn");
            btn.style.display = "block";
            btn.onclick = () => {
                let link = document.createElement("a");
                link.href = qrImg.src;
                link.download = "medical_qr.png";
                link.click();
            };
        };
    }
}


