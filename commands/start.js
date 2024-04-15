// commands/start.js

module.exports.config = {
    name: "start",
    description: "Start command to greet users or provide information about the bot",
    usage: "/starwt",
    aliases: [],
    role: "user",
    usePrefix: true,
    author: "Your Name",
};

module.exports.run = async function ({ bot, chatId }) {
    // Your logic for the start command
    const welcomeMessage = "Welcome to the bot! Feel free to explore the available commands by typing /help.";
    bot.sendMessage(chatId, welcomeMessage);
};
