const axios = require('axios');
const fs = require('fs-extra');

// In-memory storage for conversation context
const conversationContext = {};

module.exports.config = {
    name: "deviceinfo",
    description: "Get information about a device.",
    usage: "/deviceinfo <device name>",
    role: "user",
    usePrefix: true,
    aliases: [],
    author: "Rishad",
};

module.exports.run = async function ({ bot, chatId, args }) {
    const search = args.join(" ");

    if (!search) {
        bot.sendMessage(chatId, "Please provide the name of the device you want to search for.");
        return;
    }

    const searchUrl = `https://for-devs.onrender.com/api/deviceinfo/search?query=${encodeURIComponent(search)}&apikey=fuck`;

    try {
        const searchResults = await axios.get(searchUrl).then((res) => res.data);

        if (searchResults.results.length === 0) {
            bot.sendMessage(chatId, `❌No results found for '${search}'. Please try again with a different device name.`);
            return;
        }

        let replyMessage = "🔍 Search Results:\n\n";
        searchResults.results.forEach((device, index) => {
            replyMessage += `${index + 1}. ${device.name}\n`;
        });
        replyMessage += "\nReply with the number of the device you want to get info about.";

        // Store the search results in the conversation context
        conversationContext[chatId] = {
            command: "deviceinfo",
            data: searchResults.results
        };

        bot.sendMessage(chatId, replyMessage);
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "An error occurred while fetching device information.");
    }
};

// This function needs to be called whenever a message is received to check if it's a reply
module.exports.handleReply = async function ({ bot, chatId, message }) {
    if (!conversationContext[chatId] || conversationContext[chatId].command !== "deviceinfo") {
        return;
    }

    const results = conversationContext[chatId].data;
    const selectedNumber = parseInt(message.text);

    if (isNaN(selectedNumber) || selectedNumber <= 0 || selectedNumber > results.length) {
        bot.sendMessage(chatId, "Invalid option selected. Please reply with a valid number.");
        return;
    }

    const selectedDevice = results[selectedNumber - 1];
    const url = selectedDevice.url;
    const infoUrl = `https://for-devs.onrender.com/api/deviceinfo/info?url=${encodeURIComponent(url)}&apikey=fuck`;

    try {
        const deviceInfo = await axios.get(infoUrl).then((res) => res.data.result);

        let infoMessage = `📱Device: ${deviceInfo.title}\n`;
        infoMessage += `📅 Release Date: ${deviceInfo.releaseDate}\n`;
        // Add more device information as needed

        bot.sendMessage(chatId, infoMessage);
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "An error occurred while fetching device information.");
    }

    // Clear the conversation context
    delete conversationContext[chatId];
};
