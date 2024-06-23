const axios = require('axios');

module.exports.config = {
    name: "omni",
    description: "Ask a question and get a response",
    usage: "/omni <question>",
    role: "user",
    usePrefix: true,
    aliases: [],
    author: "YourName",
};

module.exports.run = async function ({ bot, chatId, args }) {
    const query = args.join(' ');

    if (!query) {
        await bot.sendMessage(chatId, "Please provide a question.");
        return;
    }

    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://flask-app-6b1u.onrender.com/chat?prompt=answer or response me only in english${encodeURIComponent(query)}`,
        headers: {}
    };

    try {
        const response = await axios.request(config);
        const message = response.data.message;

        const formattedResponse = `${message}`;
        await bot.sendMessage(chatId, formattedResponse);
    } catch (error) {
        console.error("Error:", error.message);
        await bot.sendMessage(chatId, "Failed to process the question. Please try again later.");
    }
};
