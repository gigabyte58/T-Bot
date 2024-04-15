const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "gpt",
    description: "Get an AI-generated response using GPT-4",
    usage: "/gpt <prompt>",
    role: "user",
    usePrefix: true,
    aliases: [],
    author: "YourNameHere", // Replace with your name
};

module.exports.run = async function ({ bot, chatId, args, userId }) {
    const prompt = args.join(' ');

    if (!prompt) {
        return bot.sendMessage(chatId, "😡 Please provide a prompt.");
    }

    try {
        const apiUrl = 'https://gpt4-phi-rose.vercel.app/kshitiz';
        const apiKey = 'kshitiz'; // Assuming 'kshitiz' is your API key, replace with the actual key if different
        const encodedPrompt = encodeURIComponent(prompt);

        // Fetch the AI-generated response from the GPT-4 API
        const response = await axios.get(`${apiUrl}?prompt=${encodedPrompt}&uid=${userId}&apikey=${apiKey}`);
        const aiResponse = response.data.gpt4;

        // Optionally, save the response to a file (could be useful for logging or auditing)
        fs.writeFileSync('gpt_response.json', JSON.stringify({ prompt, aiResponse }, null, 2));

        // Send the AI response back to the user
        bot.sendMessage(chatId, `AI says:\n${aiResponse}`);
    } catch (error) {
        console.error("Error:", error);
        bot.sendMessage(chatId, "❌ Failed to get a response. Please try again later.");
    }
};
