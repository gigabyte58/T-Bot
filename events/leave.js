// events/leave.js

module.exports = (bot) => {
    bot.on('leftChatMember', async (msg) => {
        const leftMember = msg.left_chat_member;
        const chatId = msg.chat.id;

        // Check if the member left voluntarily or was kicked
        if (msg.from.id === leftMember.id) {
            // Member left voluntarily
            const leaveMessage = `${leftMember.username ? `@${leftMember.username}` : leftMember.first_name} left the group.`;
            bot.sendMessage(chatId, leaveMessage);
        } else {
            // Member was kicked by admin
            const kickedBy = msg.from;
            const leaveMessage = `${leftMember.username ? `@${leftMember.username}` : leftMember.first_name} was kicked by ${kickedBy.username ? `@${kickedBy.username}` : kickedBy.first_name} from the group.`;
            bot.sendMessage(chatId, leaveMessage);
        }
    });
};
