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

    let baseUrl = window.location.origin + window.location.pathname.replace("index.html", "");
    let viewerURL = baseUrl + "viewer.html?" + encodeURIComponent(jsonString);

    document.getElementById("qrcode").innerHTML = "";
    new QRCode(document.getElementById("qrcode"), {
        text: viewerURL,
        width: 256,
        height: 256,
    });

    setTimeout(() => {
        let qrImg = document.querySelector("#qrcode img");
        if (qrImg) {
            let btn = document.getElementById("download-btn");
            btn.style.display = "block";
            btn.onclick = () => {
                let link = document.createElement("a");
                link.href = qrImg.src;
                link.download = "medical_qr.png";
                link.click();
            };
        }
    }, 400);
}

