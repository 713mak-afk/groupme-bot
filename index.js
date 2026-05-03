// ===============================
// ChavrusaGPT - GroupMe AI Bot
// ===============================

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

// -------------------------------
// CONFIG
// -------------------------------
const BOT_ID = "fbc7db65cd3c18bd82e9527791";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// In‑memory contacts (no texting)
let contacts = {};

// Personality prompt
const personality = `
You are ChavrusaGPT — a smart, friendly, helpful assistant with light humor.
Your style:
- Medium-length answers
- Clear and simple explanations
- Friendly tone
- Light humor when appropriate
- Never too long or overwhelming
- Never rude or chaotic
`;

// -------------------------------
// SEND MESSAGE TO GROUPME
// -------------------------------
function sendMessage(text) {
axios.post("https://api.groupme.com/v3/bots/post", {
bot_id: BOT_ID,
text: text
}).catch(err => console.error("GroupMe Error:", err));
}

// -------------------------------
// OPENAI RESPONSE
// -------------------------------
async function askOpenAI(prompt) {
try {
const response = await axios.post(
"https://api.openai.com/v1/chat/completions",
{
model: "gpt-4o-mini",
messages: [
{ role: "system", content: personality },
{ role: "user", content: prompt }
],
max_tokens: 180
},
{
headers: {
"Authorization": `Bearer ${OPENAI_API_KEY}`,
"Content-Type": "application/json"
}
}
);

return response.data.choices[0].message.content.trim();
} catch (err) {
console.error("OpenAI Error:", err.response?.data || err);
return "My brain glitched for a second — try again.";
}
}

// -------------------------------
// COMMAND HANDLER
// -------------------------------
async function handleCommand(text) {
const parts = text.split(" ");
const command = parts[0].toLowerCase();

switch (command) {

case "+help":
return `
Commands:
+help — Show commands
+joke — Random joke
+quote — Random quote
+roll — Roll a dice
+8ball — Magic 8-ball
+addcontact name number — Save a contact
+contacts — List saved contacts
+define word — Dictionary definition
+ai message — Force AI response
`;

case "+joke":
return "Why don’t skeletons fight each other? They don’t have the guts.";

case "+quote":
return "“The best time to plant a tree was 20 years ago. The second best time is now.”";

case "+roll":
return `You rolled a ${Math.floor(Math.random() * 6) + 1}!`;

case "+8ball":
const answers = [
"Absolutely yes.",
"Nope.",
"Ask again later.",
"Definitely.",
"I wouldn't count on it.",
"Possibly… if you believe."
];
return answers[Math.floor(Math.random() * answers.length)];

case "+addcontact":
if (parts.length < 3) return "Usage: +addcontact name number";
const name = parts[1].toLowerCase();
const number = parts[2];
contacts[name] = number;
return `Saved contact: ${name} → ${number}`;

case "+contacts":
if (Object.keys(contacts).length === 0) return "No contacts saved yet.";
return Object.entries(contacts)
.map(([n, num]) => `${n}: ${num}`)
.join("\n");

case "+define":
if (parts.length < 2) return "Usage: +define word";
return await askOpenAI(`Define this word in simple terms: ${parts[1]}`);

case "+ai":
return await askOpenAI(parts.slice(1).join(" "));

default:
return "Unknown command. Try +help.";
}
}
