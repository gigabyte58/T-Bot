// events/welcome.js

module.exports = (bot) => {
    bot.on('newChatMembers', async (msg) => {
        const newMember = msg.new_chat_members[0];
        const chatId = msg.chat.id;
        const groupName = msg.chat.title;

        // Get the current time
        const currentTime = new Date().getHours();
        let session = '';

        // Determine the session based on the current time
        if (currentTime >= 5 && currentTime < 12) {
            session = 'morning';
        } else if (currentTime >= 12 && currentTime < 18) {
            session = 'afternoon';
        } else {
            session = 'evening';
        }

        // Get the member count
        const memberCount = await bot.getChatMembersCount(chatId);

        // Mention the new user and include member count in the welcome message
        const welcomeMessage = `Hello @${newMember.username}, Welcome to ${groupName}.\n` +
            `You are the ${ordinalSuffix(memberCount)} member.\nHave a nice ${session}!`;

        // Send the welcome message to the group
        bot.sendMessage(chatId, welcomeMessage);
    });
};

// Helper function to add ordinal suffix to numbers (e.g., 1st, 2nd, 3rd)
function ordinalSuffix(number) {
    const j = number % 10, k = number % 100;
    if (j === 1 && k !== 11) {
        return number + "st";
    }
    if (j === 2 && k !== 12) {
        return number + "nd";
    }
    if (j === 3 && k !== 13) {
        return number + "rd";
    }
    return number + "th";
}
