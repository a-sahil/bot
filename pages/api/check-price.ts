import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// Add both your Chat ID and your friend's Chat ID
const CHAT_IDS = [process.env.YOUR_CHAT_ID, process.env.FRIEND_CHAT_ID];

const LOW_THRESHOLD = 2730;
const HIGH_THRESHOLD = 2760;
const lastNotified = { low: false, high: false };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch Ethereum price from CoinGecko
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );

    const ethPrice = response.data.ethereum.usd;
    console.log(`Ethereum Price: $${ethPrice}`);

    // Check thresholds and send Telegram alerts
    if (ethPrice <= LOW_THRESHOLD && !lastNotified.low) {
      await sendTelegramMessage(`🔴 Ethereum dropped below $${LOW_THRESHOLD}! Current price: $${ethPrice}`);
      lastNotified.low = true;
      lastNotified.high = false;
    } else if (ethPrice >= HIGH_THRESHOLD && !lastNotified.high) {
      await sendTelegramMessage(`🟢 Ethereum crossed above $${HIGH_THRESHOLD}! Current price: $${ethPrice}`);
      lastNotified.high = true;
      lastNotified.low = false;
    }

    res.status(200).json({ price: ethPrice });
  } catch (error) {
    console.error("Error fetching ETH price:", error);
    res.status(500).json({ error: "Failed to fetch ETH price" });
  }
}

async function sendTelegramMessage(message: string) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  // Loop through all Chat IDs to send the message to both
  for (const chatId of CHAT_IDS) {
    try {
      await axios.post(url, {
        chat_id: chatId,
        text: message,
      });
      console.log(`Telegram message sent to chat ID: ${chatId}`);
    } catch (error) {
      console.error(`Failed to send Telegram message to chat ID: ${chatId}`, error);
    }
  }
}