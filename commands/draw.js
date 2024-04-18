const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "draw",
    description: "Generate an image based on a prompt",
    usage: "/imagine <prompt>",
    role: "user",
    usePrefix: true,
    aliases: ["image"],
    author: "MICRON",
};

module.exports.run = async function ({ bot, chatId, args }) {
    const text = args.join(' ');

    if (!text) {
        return bot.sendMessage(chatId, "😡 Please provide a prompt.");
    }

    const baseURL = `https://apis-1y9l.onrender.com/gen2?prompt=${encodeURIComponent(text)}`;

    // Send the "Generating" message and store its message ID
    const generatingMessage = await bot.sendMessage(chatId, "✅ Generating, please wait...");

    const formattedText = `*Prompt:* _${text}_`;

    try {
        const response = await axios({
            method: 'get',
            url: baseURL,
            responseType: 'stream'
        });

        const path = `images/${Date.now()}.png`;
        const writer = fs.createWriteStream(path);

        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        await bot.sendPhoto(chatId, path, { caption: formattedText, parseMode: 'Markdown' });
    
        fs.unlinkSync(path);

        // Delete the "Generating" message after sending the photo
        bot.deleteMessage(chatId, generatingMessage.message_id);
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "❌ Failed to generate the image. Please try again later.");
        // Delete the "Generating" message if an error occurs
        bot.deleteMessage(chatId, generatingMessage.message_id);
    }
};
