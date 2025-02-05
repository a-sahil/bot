import axios from "axios";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const LOW_THRESHOLD = 2720;
const HIGH_THRESHOLD = 2780;
let lastNotified = { low: false, high: false };

export default async function handler(req, res) {
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

// Function to send Telegram notification
async function sendTelegramMessage(message: string) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  try {
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });
    console.log("Telegram message sent:", message);
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
  }
}
