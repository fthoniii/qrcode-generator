const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());

const PORT = 3000;

// Penyimpanan sementara untuk QR Code yang valid
let validQRCodes = {};

// API untuk Generate QR Code Baru
app.get("/generate", (req, res) => {
    const baseURL = req.query.base || "https://ub.ac.id";
    const qrID = uuidv4(); // Buat ID unik untuk QR Code
    const qrURL = `http://localhost:3000/validate?id=${qrID}`;

    // Simpan QR Code ke penyimpanan sementara
    validQRCodes[qrID] = true;

    // Hapus QR Code setelah 30 detik (expired)
    setTimeout(() => {
        delete validQRCodes[qrID];
    }, 30000);

    res.json({ qrURL });
});

// API untuk Validasi QR Code saat dipindai
app.get("/validate", (req, res) => {
    const qrID = req.query.id;
    if (validQRCodes[qrID]) {
        res.json({ valid: true, message: "QR Code valid!", redirect: "" });
    } else {
        res.status(404).json({ valid: false, message: "QR Code expired or invalid." });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
