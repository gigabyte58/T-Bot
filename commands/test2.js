// commands/button.js
module.exports.config = {
    name: "button",
    description: "Send a message with four buttons",
    usage: "/button",
    aliases: [],
    role: "user", // All users can use this command
    usePrefix: true,
    author: "Your Name",
};

module.exports.run = async function ({ bot, chatId }) {
    const info1Button = { text: "Info1", callback_data: "info1" };
    const info2Button = { text: "Info2", callback_data: "info2" };
    const exitButton = { text: "Exit", callback_data: "exit" };
    const cancelButton = { text: "Cancel", callback_data: "cancel" };

    const inlineKeyboard = bot.inlineKeyboard([
        [info1Button, info2Button],
        [exitButton, cancelButton]
    ]);

    try {
        const message = "Choose an option:";
        const sentMessage = await bot.sendMessage(chatId, message, { replyMarkup: inlineKeyboard });

        bot.on('callbackQuery', async (msg) => {
            const option = msg.data;

            try {
                if (option === 'info1') {
                    await bot.sendMessage(msg.from.id, 'You clicked the "Info1" button!');
                } else if (option === 'info2') {
                    await bot.sendMessage(msg.from.id, 'You clicked the "Info2" button!');
                } else if (option === 'exit') {
                    await bot.sendMessage(msg.from.id, 'Exiting the command.');
                } else if (option === 'cancel') {
                    await bot.sendMessage(msg.from.id, 'Operation canceled.');
                }
                
                // Delete the button message
                bot.deleteMessage(chatId, sentMessage.message_id);
            } catch (error) {
                console.error('Error sending message:', error.message);
            }
        });
    } catch (error) {
        console.error('Error sending message:', error.message);
    }
};
