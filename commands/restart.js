// commands/restart.js
const { spawn } = require('child_process');

module.exports.config = {
    name: "restart",
    description: "Restart the bot",
    usage: "/restart",
    role: "admin", // Require admin role to execute
    usePrefix: true,
    aliases: ["reload"],
    author: "Your Name",
};

module.exports.run = async function ({ bot, chatId }) {

    bot.sendMessage(chatId, "Restarting the bot...");

    // Spawn a new Node.js process to restart the bot
    try {
        const child = spawn('node', ['index.js'], {
            detached: true,
            stdio: 'ignore',
        });

        child.unref();
        
        bot.sendMessage(chatId, "Successfully restarted the bot.");
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "Failed to restart the bot.");
    }

    // Exit the current process
    process.exit(0);
};
