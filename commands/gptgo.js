const gptgo = require('./../lib/gptGO'); // Adjust the path accordingly

module.exports.config = {
    name: "gptgo",
    description: "Generate text using GPTGo",
    usage: "/gptgo <question>",
    aliases: ["gptgo"],
    role: "user", // Allow all users to execute
    usePrefix: true,
    author: "Samir Thakuri",
};

module.exports.run = async function ({ bot, args, chatId }) {
    const question = args.join(' ');
    const opts = { proxy: true };

    if (!question) {
        bot.sendMessage(chatId, `⚠️ Please ask something to me.`);
        return;
    }

    // Send a pre-processing message
    const preMessage = await bot.sendMessage(chatId, "💭 | Thinking...");

    try {
        const response = await gptgo(question, opts);

        // Check if the generated content contains code
        const formattedResponse = response.match(/```(\w+)\n([\s\S]+)```/) ?
            response : "GPTGo:\n```\n" + response + "\n```";

        // Send the formatted response as Markdown
        bot.sendMessage(chatId, formattedResponse, { parseMode: 'Markdown' });
    } catch (error) {
        console.error(error.message);
        bot.sendMessage(chatId, "⚠️ An error occurred while interacting GPTGo.");
    } finally {
        // Delete the pre-processing message
        bot.deleteMessage(chatId, preMessage.message_id);
    }
};
