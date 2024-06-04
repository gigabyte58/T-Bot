const axios = require('axios');

module.exports.config = {
    name: "blackbox",
    description: "Ask a question and get a response from BlackBox AI",
    usage: "/ask <question>",
    role: "user",
    usePrefix: false,
    aliases: ["bb", "webai"],
    author: "MICRON",
    version: 1.0,
    longDescription: "This is BlackBox. A powerful AI with internet access. It possesses the capability to assist you by producing real-time data.",
    category: "ai",
};

module.exports.run = async function ({ bot, chatId, args }) {
    const query = args.join(' ');

    if (!query) {
        await bot.sendMessage(chatId, "Please enter some text to talk to BlackBox AI.");
        return;
    }

    const userName = "TelegramUser"; // Placeholder for user identification

    const options = {
        method: 'POST',
        url: 'https://www.blackbox.ai/api/chat',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Android) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
        },
        data: {
            messages: [
                {
                    id: 'kYcGcW0',
                    content: query,
                    role: 'user'
                }
            ],
            id: 'kYcGcW0',
            previewToken: null,
            userId: 'f094ccf8-7d9c-4062-a06c-f575c5ba2145',
            codeModelMode: true,
            agentMode: {},
            trendingAgentMode: {},
            isMicMode: false,
            isChromeExt: false,
            githubToken: null,
            clickedAnswer2: false,
            clickedAnswer3: false,
            visitFromURL: null,
        },
    };

    try {
        const response = await axios.request(options);
        // Remove the unwanted "$~~~$...$~~~$" pattern from the response
        const cleanedResponse = response.data.replace(/\$~~~\$.*?\$~~~\$/gs, '').trim();
        // Remove any remaining sources information if necessary
        const textResponse = cleanedResponse.replace(/Sources:.*$/, '').trim();

        // Send the response back to the user
        const formattedResponse = textResponse.match(/```(\w+)\n([\s\S]+)```/) ? textResponse : "\n```\n" + textResponse + "\n```";
        await bot.sendMessage(chatId, `𝗕𝗟𝗔𝗖𝗞𝗕𝗢𝗫  |  🌸\n━━━━━━━━━━━━━━━━━━━\n${formattedResponse}\n━━━━━━━━━━━━━━━━━━━`, { parseMode: 'Markdown' });
    } catch (error) {
        console.error("Error:", error.message);
        await bot.sendMessage(chatId, "An error occurred while making the API request. Please try again later.");
    }
};
