const express = require("express");
const os = require("os");
const app = express();
const PORT = process.env.PORT || 6070;

const TeleBot = require('telebot');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const logger = require('./logger');
const loader = require('./loader');

const config = require('./config.json');
const { botToken, adminId, prefix } = config;

// Define a map to store message histories for each chat
const chatHistories = new Map();

const bot = new TeleBot(botToken);

app.get('/', async(req, res) => {
    res.sendFile(__dirname + '/web.html');
})

// Load commands dynamically
loader.loadCommands(bot, path.join(__dirname, 'commands'), prefix, adminId, logger);

// Load events dynamically
loader.loadEvents(bot, path.join(__dirname, 'events'));
// Log received messages
bot.on('text', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userMessage = msg.text;
    const history = chatHistories.get(chatId) || [];

    // Check if the message starts with the command prefix
    if (userMessage.startsWith(prefix)) {
        // If the message starts with a command, do not process with ChatGPT
        return;
    }

    // Add bot prompt indicating that it's a doctor
    const botPrompt = "I'm KUBA-ARICHA. I will show commands for using this bot , first send what do you want .. here all command lists  - \n━━━━━\n1. anigen - Generate an image based on a text prompt\n2. anni - It's a chat-bot as like simsimi\n3. arxiv - Search for research articles on Arxiv.\n4. avatar - Create your own avatar image\n5. bard - Ask a question and get a response\n6. caller - Truecaller search utility\n7. clean - Delete all files in subdirectories\n8. cover - Create your own cover image\n9. deviceinfo - Get information about a device.\n10. downloader - Download Instagram videos\n11. draw - Generate an image based on a prompt\n12. element - Get information about an element from the periodic table\n13. emi - Text to Image\n14. emoji - Convert an emoji to a GIF\n15. fs - Send the source code of a command\n16. gemini - Ask a question and get a response\n17. gen - Generate an image based on a text prompt\n18. github - Get information about a GitHub user\n19. gpt - Get an AI-generated response using GPT-4\n20. gptgo - Generate text using GPTGo\n21. help - Display help information\n22. ht - Generate an AI image based on a prompt\n23. id - Get your Telegram user ID or the chat ID\n24. imagine - Generate an image based on a prompt\n25. info - Get info about the bot and owner\n26. iplookup - Fetch information about an IP address\n27. kuba - Ask a question and get a response\n28. leo - Text to Image\n29. liner - Get an AI-generated response from Liner\n30. niji - Generate an image based on a text prompt using a new AI\n31. pinterest - Get Image From Pinterest\n32. proteous - Generate an image based on a text prompt\n33. quiz - Play a quiz\n34. restart - Restart the bot\n35. scrape - Fetch and display HTML content from a website\n36. sdxl - Generate an image based on a text prompt\n37. sid - Display system uptime and information\n38. sim2 - Simsimi ChatBot by Simsimi.fun\n39. sing - Play music by searching for a song title\n40. ss - Take a real-time screenshot of a website\n41. start - Start command to greet users or provide information about the bot\n42. test - Generate an image using the Niji AI\n43. test2 - Send a message with four buttons\n44. topexp - undefined\n45. upscale - Upscale an image\n46. uptime - Display bot statistics\n47. wiki - Get information about a topic from Wikipedia\n48. ytb - Search and send top YouTube video\n━━━━━━━━━━━━━\nType /help to see all available commands. just copy this command and send it to me --";

    // Combine user message, bot prompt, and message history
    const combinedMessage = `${botPrompt}\n${userMessage}\n${history.slice(-5).join('\n')}`; // Get last 20 messages

    try {
        const apiUrl = 'https://chatgpt.apinepdev.workers.dev/';

        // Fetch the AI-generated response from the ChatGPT-like model API
        const response = await axios.get(`${apiUrl}?question=${encodeURIComponent(combinedMessage)}`);
        const aiResponse = response.data.answer;

        // Update message history for the current chat
        const userName = msg.from.username || `${msg.from.first_name} ${msg.from.last_name || ''}`.trim();
        history.push(`User(${userName}): ${userMessage}`);        
        history.push(`Abhibots: ${aiResponse}`);
        chatHistories.set(chatId, history);

        // Send the AI response back to the user
        await bot.sendMessage(chatId, `\n${aiResponse}`);
    } catch (error) {
        console.error("Error:", error);
        await bot.sendMessage(chatId, "❌ Failed to get a response. Please try again later.");
    }
    // Log the received message
    const logMessage = `Received message | User ID: ${userId} | Group ID: ${chatId} | Message: ${userMessage}`;
    logger(logMessage);
});



bot.start();

app.listen(PORT, () => {
    // Get the host name of the machine
    const hostName = os.hostname();
    console.log("Bot is running...");
    console.log(`Hosted On: http://${hostName}:${PORT}/`);
});
