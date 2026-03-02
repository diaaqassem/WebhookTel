// require("dotenv").config();
const express = require("express");
const axios = require("axios");
const serverless = require("serverless-http");

const app = express();
app.use(express.json());

app.post("/pingdom", async (req, res) => {
  const alert = req.body;

  if (!alert || !alert.check_name || !alert.current_state) {
    return res.status(400).send("Bad Request: Missing required fields");
  }

  try {
    const message =
      ` *Pingdom Alert*\n\n` +
      `*Check:* ${alert.check_name}\n` +
      `*State:* ${alert.current_state}\n` +
      `*Description:* ${alert.description || "No description"}\n` +
      `*Time:* ${new Date().toLocaleString("en-EG")}\n\n` +
      ` *Call Hosny:* +201017962052`;

    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }
    );

    res.status(200).send("OK");
  } catch (err) {
    console.error("Telegram API error:", err.response?.data || err.message);
    res.sendStatus(500);
  }
});

module.exports.handler = serverless(app);

