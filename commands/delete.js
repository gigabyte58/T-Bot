const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "delete",
    description: "Delete a command file from the bot",
    usage: "/delete <command>",
    role: "admin", // Restrict to admin users only
    usePrefix: true,
    aliases: ["del"],
    author: "MICRON"
};

module.exports.run = async function ({ bot, args, chatId }) {

    const commandName = args[0];
    if (!commandName) {
        return bot.sendMessage(chatId, "Please specify the command to delete using: /delete <command>");
    }

    const commandsPath = path.join(__dirname, '.');  // Check this path carefully
    const commandFile = findCommandFile(commandsPath, commandName);

    if (commandFile) {
        try {
            fs.unlinkSync(commandFile);
            bot.sendMessage(chatId, `✅ The command "${commandName}" has been successfully deleted.`);
        } catch (err) {
            console.error(err);
            bot.sendMessage(chatId, `Failed to delete the command "${commandName}": ${err.message}`);
        }
    } else {
        bot.sendMessage(chatId, `The command "${commandName}" does not exist. Checked in directory: ${commandsPath}`);
    }
};

function findCommandFile(commandsPath, input) {
    const files = fs.readdirSync(commandsPath);
    console.log("Directory files:", files);  // Debugging output
    for (const file of files) {
        const command = require(path.join(commandsPath, file));
        if (
            file.replace(/\.[^/.]+$/, '') === input ||
            command.config.name === input ||
            (command.config.aliases && command.config.aliases.includes(input))
        ) {
            return path.join(commandsPath, file);
        }
    }
    return null;
}
