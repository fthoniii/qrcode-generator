const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const app = express();
app.use(cors());
const PORT = 3000;

let validQRCodes = {};

// API untuk Generate QR Code Baru
app.get("/generate", (req, res) => {
    const baseURL = req.query.base || "https://ub.ac.id";
    const qrID = uuidv4(); 
    const qrURL = `http://localhost:3000/validate?id=${qrID}`;

    validQRCodes[qrID] = { valid: true, redirect: baseURL };

    setTimeout(() => {
        delete validQRCodes[qrID];
    }, 10000);

    res.json({ qrURL });
});

// API untuk Validasi QR Code
app.get("/validate", (req, res) => {
    const qrID = req.query.id;
    if (validQRCodes[qrID]) {
        res.json({ valid: true, message: "QR Code valid!", redirect: validQRCodes[qrID].redirect });
    } else {
        res.status(404).json({ valid: false, message: "QR Code expired or invalid." });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});