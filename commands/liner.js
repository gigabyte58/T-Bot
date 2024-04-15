const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "liner",
    description: "Get an AI-generated response from Liner",
    usage: "/liner <prompt>",
    role: "user",
    usePrefix: true,
    aliases: [],
    author: "YourNameHere", // Replace with your name
};

module.exports.run = async function ({ bot, chatId, args }) {
    const prompt = args.join(' ');

    if (!prompt) {
        return bot.sendMessage(chatId, "😡 Please provide a prompt.");
    }

    try {
        const url = 'https://linerva.getliner.com/platform/copilot/v3/answer';
        const headers = {
            'content-type': 'application/json'
        };
        const data = {
            spaceId: 18097491,
            "threadId": "53697617",
            "userMessageId": 61014208,
            "userId": 8925712,
            query: prompt,
            agentId: '@liner-pro',
            platform: 'web',
            regenerate: false
        };

        const response = await axios.post(url, data, { headers });
        const jsonResponse = { response: response.data };
        fs.writeFileSync('response.json', JSON.stringify(jsonResponse, null, 2));
        const responsesArray = response.data.split('\n');
        const lastResponse = JSON.parse(responsesArray[responsesArray.length - 2]);
        const answer = lastResponse.answer;

        // Format the response
        const formattedResponse = answer.match(/```(\w+)\n([\s\S]+)```/) ?
            answer : "AI says:\n```\n" + answer + "\n```";

        bot.sendMessage(chatId, formattedResponse, { parseMode: 'Markdown' });
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "❌ Failed to get response from Liner. Please try again later.");
    }
};