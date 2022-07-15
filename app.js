const {Client, LocalAuth} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const client = new Client({puppeteer: {headless: true}, authStrategy: new LocalAuth()});
let corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
    methods: "GET, POST"
}
app.use(cors(corsOptions));

client.on('qr', (qr) => {
    console.log('Token Whatsapp ', qr);
    qrcode.generate(qr, {small: true});
});
client.on('ready', () => {
    console.log('Client Siap !');
});
client.on('authenticated', () => {
    console.log('Terautentikasi');
});
client.initialize();

app.get("/", async (req, res) => {
    res.send("Server Whatsapp Running OK");
})

app.post("/kirimpesan", (req, res) => {
    const nomor = req.body.nomor;
    const pesan = req.body.pesan;
    client.sendMessage(nomor + "@c.us", pesan).then(response => {
        res.status(200).json({
            status: "Berhasil"
        });
        console.log("Pesan Berhasil di Kirim Ke " + nomor);
    }).catch(err => {
        res.status(500).json({
            status: "Gagal"
        });
        console.log("Pesan Gagal di Kirim Ke " + nomor);
    })
})

app.listen(200, function(){
    console.log("Server Berjalan di Port: " + 200);
})