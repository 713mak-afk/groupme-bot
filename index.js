const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const BOT_ID = "a5f3cb50d0b36074d629a7c20f"; // your bot ID

// AI endpoint + key from OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/", async (req, res) => {
const text = req.body.text;

// Ignore empty messages
if (!text) {
return res.sendStatus(200);
}

try {
// Send the user's message to OpenAI
const aiResponse = await axios.post(
"https://api.openai.com/v1/chat/completions",
{
model: "gpt-4o-mini",
messages: [
{ role: "system", content: "You are a helpful AI inside a GroupMe chat." },
{ role: "user", content: text }
]
},
{
headers: {
"Authorization": `Bearer ${OPENAI_API_KEY}`,
"Content-Type": "application/json"
}
}
);

const reply = aiResponse.data.choices[0].message.content;

// Send the AI's reply back to GroupMe
await axios.post("https://api.groupme.com/v3/bots/post", {
bot_id: BOT_ID,
text: reply
});

} catch (error) {
console.error("AI error:", error.response?.data || error.message);
}

res.sendStatus(200);
});

app.listen(3000, () => console.log("Bot is running"));
