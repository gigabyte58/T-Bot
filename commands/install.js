const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "install",
    description: "Install a new command for the bot",
    usage: "/install <command>.js /// <code>",
    role: "admin", // Restrict to admin users only
    usePrefix: true,
    aliases: ["addcommand"],
    author: "MICRON"
};

module.exports.run = async function ({ bot, args, chatId, message }) {
    if (args.length < 1) {
        return bot.sendMessage(chatId, "Please specify the command file and include the code. Usage: /install <command>.js /// <code>");
    }

    const commandName = args[0];
    if (!commandName.endsWith('.js')) {
        return bot.sendMessage(chatId, "Please ensure the command file name ends with '.js'");
    }

    // Extract the code using a delimiter '///'
    const messageText = message.text;
    const delimiter = "///";
    const codeStartIndex = messageText.indexOf(delimiter) + delimiter.length;
    const code = messageText.slice(codeStartIndex).trim();

    if (!code) {
        return bot.sendMessage(chatId, "No code provided after the delimiter. Please include the JavaScript code to install.");
    }

    const commandsPath = path.join(__dirname, '.');
    const filePath = path.join(commandsPath, commandName);

    if (fs.existsSync(filePath)) {
        return bot.sendMessage(chatId, `A command with the name "${commandName}" already exists.`);
    }

    try {
        fs.writeFileSync(filePath, code, { encoding: 'utf8' });
        bot.sendMessage(chatId, `✅ The command "${commandName}" has been successfully installed.`);
    } catch (err) {
        console.error(err);
        bot.sendMessage(chatId, `Failed to install the command "${commandName}": ${err.message}`);
    }
};
