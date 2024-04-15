const axios = require('axios');

module.exports.config = {
    name: "caller",
    description: "Truecaller search utility",
    usage: "/caller <phone_number>",
    role: "user",
    usePrefix: true,
    aliases: ["truecaller"],
    author: "MICRON",
};

module.exports.run = async function ({ bot, chatId, args }) {
    try {
        const phoneNumber = args[0];

        if (!phoneNumber) {
            bot.sendMessage(chatId, "Please provide a phone number to search");
            return;
        }

        const url = `https://search5-noneu.truecaller.com/v2/search?q=${phoneNumber}&countryCode=BD&type=4&locAddr=&encoding=json`;

        const headers = {
            Authorization: "Bearer a2i09--l-z_CRVJVfxA9y-fxkIgZ0RFlYM9lh-tzaz3OI8qIqtht00_AY79CVlY3"
        };

        const response = await axios.get(url, { headers });
        const result = response.data;

        if (result && result.data && result.data.length > 0) {
            const userDetails = result.data[0];

            const formattedResponse = `Name: ${userDetails.name}\nScore: ${userDetails.score}\nAccess: ${userDetails.access}\nEnhanced: ${userDetails.enhanced}\nPhone Number: ${userDetails.phones[0].nationalFormat}\nCountry Code: ${userDetails.phones[0].countryCode}\nCarrier: ${userDetails.phones[0].carrier}\nAddress: ${userDetails.addresses[0].address}\nTimezone: ${userDetails.addresses[0].timeZone}\nInternet Address: Gmail - ${userDetails.internetAddresses[0]?.id || 'N/A'}`;

            if (userDetails.image) {
                const imageResponse = await axios.get(userDetails.image, { responseType: 'arraybuffer' });
                const photoBuffer = Buffer.from(imageResponse.data);
                bot.sendPhoto(chatId, photoBuffer, { caption: `Truecaller search result for ${phoneNumber}:\n${formattedResponse}` });
            } else {
                bot.sendMessage(chatId, `Truecaller search result for ${phoneNumber}:\n${formattedResponse}`);
            }
        }
    } catch (error) {
        console.error("Error:", error.message);
        bot.sendMessage(chatId, "An error occurred while searching on Truecaller. Please try again later.");
    }
};
