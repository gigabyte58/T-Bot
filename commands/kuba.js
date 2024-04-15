const axios = require('axios');

module.exports.config = {
    name: "kuba",
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
        const response = await axios.get(`https://sandipbaruwal.onrender.com/gpt?prompt=${encodeURIComponent(prompt)}`);
        const answer = response.data.answer;
        
        const formattedResponse = answer.match(/```(\w+)\n([\s\S]+)```/) ?
        answer : "\n```\n" + answer + "\n```";
        bot.sendMessage(chatId, formattedResponse, { parseMode: 'Markdown' });
    } catch (error) {
        console.error("Error:", error.message);
        await bot.sendMessage(chatId, "Failed to process the question. Please try again later.");
    }
};
