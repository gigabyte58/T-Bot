const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "emoji",
    description: "Convert an emoji to a GIF",
    usage: "/emoji <emoji>",
    role: "user",
    usePrefix: true,
    aliases: [],
    author: "OtinXSandip",
};

module.exports.run = async function ({ bot, chatId, args }) {
    const emoji = args.join(" ");

    if (!emoji) {
        return bot.sendMessage(chatId, "Provide emoji");
    }

    const response = `https://api.vyturex.com/emoji-gif?emoji=${emoji}`;

    try {
        const gifResponse = await axios.get(response, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(gifResponse.data, 'binary');

        // Write the GIF to a temporary file
        const filePath = `emoji_${Date.now()}.gif`;
        fs.writeFileSync(filePath, buffer);

        // Send the GIF
        await bot.sendDocument(chatId, filePath);

        // Delete the temporary file
        fs.unlinkSync(filePath);
    } catch (error) {
        bot.sendMessage(chatId, "API sucks");
    }
};
