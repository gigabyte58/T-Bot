const axios = require('axios');

module.exports.config = {
    name: "info",
    description: "Get info about the bot and owner",
    usage: "/info",
    role: "user",
    usePrefix: true,
    aliases: [],
    author: "OtinXSandip",
};

module.exports.run = async function ({ bot, chatId }) {
    const imgURL = "https://imgur.com/W17LXgN.jpeg";
    
    const botName = "KUBA ARICHA";
    const botPrefix = "/";
    const ownerName = "MICRON";
    const ownerGender = "Male";
    const ownerMessenger = "m.me/micron.588";

    const replyMessage = `Here is the information ✨
🌸 Bot's Name: ${botName}
🌸 Bot's Prefix: ${botPrefix}
🌸 Owner: ${ownerName}
🌸 Gender: ${ownerGender}
🌸 Messenger: ${ownerMessenger}`;

    try {
        const response = await axios.get(imgURL, { responseType: 'arraybuffer' });
        const photoBuffer = Buffer.from(response.data);
        bot.sendPhoto(chatId, photoBuffer, { caption: replyMessage });
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, replyMessage);
    }
};
