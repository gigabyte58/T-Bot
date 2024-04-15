const axios = require('axios');

module.exports.config = {
    name: "bard",
    description: "Ask a question and get a response",
    usage: "/ask <question>",
    role: "user",
    usePrefix: false,
    aliases: [],
    author: "OtinXSandip",
};

module.exports.run = async function ({ bot, chatId, args }) {
    const prompt = args.join(' ');

    if (!prompt) {
        await bot.sendMessage(chatId, "Hey buddy!! ask me any question 🐥");
        return;
    }

    try {
        const response = await axios.get(`https://haze-ultra-advanced-d80346bab842.herokuapp.com/bard?question=${prompt}`);
        const data = response.data;
        const answer = data.answer;

        // Send text response
        const formattedResponse = answer.match(/```(\w+)\n([\s\S]+)```/) ?
        answer : "\n```\n" + answer + "\n```";
        await bot.sendMessage(chatId, formattedResponse, { parseMode: 'Markdown' });

        // Check if there are image URLs and send them
        if (data.image_urls && data.image_urls.length > 0) {
            for (const imageUrl of data.image_urls) {
                await bot.sendPhoto(chatId, imageUrl);
            }
        }
    } catch (error) {
        console.error("Error:", error.message);
        await bot.sendMessage(chatId, "Failed to process the question. Please try again later.");
    }
};
