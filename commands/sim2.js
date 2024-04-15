const axios = require("axios");

module.exports.config = {
    name: "sim",
    description: "Simsimi ChatBot by Simsimi.fun",
    usage: "/sim <word>: chat with Simsimi",
    role: "user",
    usePrefix: true,
    aliases: [],
    author: "KENLIEPLAYS",
};

module.exports.run = async function ({ bot, chatId, args }) {
    if (args.length > 0) {
        const yourMessage = args.join(" ");
        try {
            const responseMessage = await getMessage(yourMessage);
            bot.sendMessage(chatId, `${responseMessage}`);
        } catch (err) {
            console.error(err);
            bot.sendMessage(chatId, "What?");
        }
    }
};

async function getMessage(yourMessage) {
    try {
        const res = await axios.get(
            `https://simsimi.fun/api/v2/?mode=talk&lang=bn&message=${yourMessage}&filter=true`
        );
        if (!res.data.success) {
            throw new Error("API returned a non-successful message");
        }
        return res.data.success;
    } catch (err) {
        console.error("Error while getting a message:", err);
        throw err;
    }
}
