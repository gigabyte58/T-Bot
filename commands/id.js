module.exports.config = {
    name: "id",
    version: "1.0",
    author: "YourNameHere",
    role: "user",
    usePrefix: true,
    aliases: ["uid", "cid"],
    description: "Get your Telegram user ID or the chat ID",
};

module.exports.run = async function ({ bot, chatId, userId, args }) {
    const commandType = args[0]?.toLowerCase();

    if (commandType === "uid") {
        // Send the user's ID as a message
        bot.sendMessage(chatId, `Your Telegram user ID is: ${userId}`);
    } else if (commandType === "cid") {
        try {
            // Sending the chat ID as a message
            bot.sendMessage(chatId, `Chat ID: ${chatId}`);
        } catch (error) {
            // Handling errors if message sending fails
            console.error(`Error occurred while fetching and sending chat ID: ${error.message}`);
        }
    } else {
        bot.sendMessage(chatId, `Invalid command type. Please use either "/id uid" or "/id cid".`);
    }
};
