const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "nstall",
    description: "Install a new command for the bot",
    usage: "/install <command>.js <code>",
    role: "admin", // Restrict to admin users only
    usePrefix: true,
    aliases: ["addcommand"],
    author: "Naoh—"
};

module.exports.run = async function ({ bot, args, chatId, message }) {
   
    // Message should include the command name followed by the code.
    // We assume the first word after the command is the filename.
    if (args.length < 1) {
        return bot.sendMessage(chatId, "Please specify the command file and include the code. Usage: /install <command>.js <code>");
    }

    const commandName = args[0];
    if (!commandName.endsWith('.js')) {
        return bot.sendMessage(chatId, "Please ensure the command file name ends with '.js'");
    }

    // Extract the code directly from the message text after the command name
    const messageText = message.text;
    const codeStartIndex = messageText.indexOf(commandName) + commandName.length + 1;
    const code = messageText.slice(codeStartIndex).trim();

    if (!code) {
        return bot.sendMessage(chatId, "No code provided. Please include the JavaScript code to install.");
    }

    const commandsPath = path.join(__dirname, '.');
    const filePath = path.join(commandsPath, commandName);

    if (fs.existsSync(filePath)) {
        return bot.sendMessage(chatId, `A command with the name "${commandName}" already exists.`);
    }

    try {
        fs.writeFileSync(filePath, code);
        bot.sendMessage(chatId, `✅ The command "${commandName}" has been successfully installed.`);
    } catch (err) {
        console.error(err);
        bot.sendMessage(chatId, `Failed to install the command "${commandName}": ${err.message}`);
    }
};
