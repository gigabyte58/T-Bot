module.exports.config = {
    name: "unsend",
    version: "1.0",
    author: "ConvertedFromPython",
    role: "admin", // or whatever role is appropriate
    usePrefix: true,
    aliases: ["un", "rv", "revoke"],
    description: "Delete messages in a chat",
};

module.exports.run = async function ({ bot, chatId, message, args }) {
    const replied = message.reply_to_message;
    if (!replied) 
        return bot.sendMessage(chatId, "Please reply to the message which you wanna unsend");

    const cmd = args[0] ? args[0].toLowerCase() : null;
    const repliedMsgId = replied.message_id;
    const messageId = message.message_id;

    const deleteMessages = async (messageIds) => {
        for (let msgId of messageIds) {
            try {
                await bot.deleteMessage(chatId, msgId);
            } catch (error) {
                if (error.response && error.response.statusCode === 403) {
                    await bot.sendMessage(chatId, "I don't have permission to delete messages in this chat.");
                    break;
                } else {
                    console.error(`Error deleting message ${msgId}: ${error.message}`);
                    break;
                }
            }
        }
    };

    if (cmd === "a") {
        let msgs = [];
        for (let id = repliedMsgId; id <= messageId; id++) {
            msgs.push(id);
        }
        await deleteMessages(msgs);
    } else if (cmd && !isNaN(cmd)) {
        let count = parseInt(cmd);
        let msgs = [];
        for (let id = repliedMsgId; id < repliedMsgId + count + 1 && id < messageId; id++) {
            msgs.push(id);
        }
        await deleteMessages(msgs);
        if (msgs.length - 2 < count) {
            await bot.sendMessage(chatId, `Only ${msgs.length - 2} messages were deleted after the replied message.`);
        }
    } else {
        await deleteMessages([repliedMsgId, messageId]);
    }
};
