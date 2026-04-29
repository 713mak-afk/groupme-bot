const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const BOT_ID = "a5f3cb50d0b36074d629a7c20f";

app.post("/", async (req, res) => {
const text = req.body.text;

if (text && text.startsWith("+")) {
const reply = "@Copilot " + text.substring(1);

await axios.post("https://api.groupme.com/v3/bots/post", {
bot_id: BOT_ID,
text: reply
});
}

res.sendStatus(200);
});

app.listen(3000, () => console.log("Bot is running"));
