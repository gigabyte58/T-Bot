// loader.js

const fs = require('fs-extra');
const path = require('path');

const loadCommands = (bot, commandsPath, prefix, adminId, logger) => {
    fs.readdirSync(commandsPath).forEach(file => {
        const command = require(path.join(commandsPath, file));

        const commandTriggers = [command.config.name.toLowerCase(), ...command.config.aliases.map(alias => alias.toLowerCase())];

        bot.on(commandTriggers.map(trigger => prefix + trigger), (msg) => {
            const chatId = msg.chat.id;
            const userId = msg.from.id;
            const isAdmin = adminId.includes(userId.toString().toLowerCase());

            // Log command information
            const logMessage = `Command: ${prefix}${command.config.name} | User ID: ${userId} | Group ID: ${chatId}`;
            logger(logMessage);

            // Check if the command exists
            if (typeof command.run !== 'function') {
                bot.sendMessage(chatId, `Command "${prefix}${command.config.name}" does not exist.`);
                return;
            }

            // Check command role and execute if allowed
            if (command.config.role === 'user' || (command.config.role === 'admin' && isAdmin)) {
                // Execute the command and pass the message object
                command.run({ bot, message: msg, args: msg.text.split(' ').slice(1), chatId, userId, isAdmin });
            } else {
                bot.sendMessage(chatId, 'You do not have permission to use this command.');
            }
        });
    });
};


const loadEvents = (bot, eventsPath) => {
    fs.readdirSync(eventsPath).forEach(file => {
        const event = require(path.join(eventsPath, file));
        // Call the event function with the bot instance
        event(bot);
    });
};

module.exports = { loadCommands, loadEvents };
