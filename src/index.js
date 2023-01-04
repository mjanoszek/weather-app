import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import * as path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
const app = express();
const port = 3000;
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json());
const whitelist = [
    "http://127.0.0.1",
    "http://127.0.0.1:1234",
    "http://127.0.0.1:3000",
];
const corsOptions = {
    origin: (origin, callback) => {
        callback(null, true);
    },
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
const sendFile = (req, res) => {
    console.log("test", req.path);
    res.sendFile(__dirname + "/" + req.path);
};
app.get("*.css", sendFile);
app.get("*.js", sendFile);
app.get("*.ttf", sendFile);
app.get("*.woff2", sendFile);
const urls = {
    "/weather": (req) => `https://api.openweathermap.org/data/2.5/weather?q=${req.query.city}&units=imperial&appid=${process.env.WEATHER_API_KEY}`,
    "/byLocation": (req) => `https://api.openweathermap.org/data/2.5/weather?lat=${req.query.lat}&lon=${req.query.lon}&appid=${process.env.WEATHER_API_KEY}&units=imperial`,
    "/timezone": (req) => `https://api.ipgeolocation.io/timezone?apiKey=${process.env.TIMEZONE_API_KEY}&lat=${req.query.lat}&long=${req.query.long}`,
};
async function sendData(req, res) {
    try {
        if (!process.env.WEATHER_API_KEY) {
            throw new Error("You forgot to set RANDOMER_API_TOKEN");
        }
        let url = req.url.split("?").shift();
        const result = await fetch(urls[url](req), {
            method: "get",
        });
        res.json(await result.json());
    }
    catch (err) {
        res.status(400).json("bad request");
    }
}
app.get("/weather", sendData);
app.get("/byLocation", sendData);
app.get("/timezone", sendData);
app.listen(port, () => console.log(`App listening on port ${port}`));
//# sourceMappingURL=index.js.map