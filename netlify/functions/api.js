const express = require("express");
const axios = require("axios");
const serverless = require("serverless-http");

const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  const alert = req.body;

  if (!alert?.check_name || !alert?.current_state) {
    return res.status(400).send("Bad Request: Missing required fields");
  }

  try {
    const message =
      ` Pingdom Alert\n\n` +
      `Check: ${alert.check_name}\n` +
      `State: ${alert.current_state}\n` +
      `Time: ${new Date().toLocaleString("en-EG")}`;

    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message
      }
    );

    return res.status(200).send("OK");
  } catch (error) {
    console.error("Telegram Error:", error.response?.data || error.message);
    return res.status(500).send("Telegram API Error");
  }
});

module.exports.handler = serverless(app);
