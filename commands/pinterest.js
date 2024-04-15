const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "pinterest",
    description: "Get Image From Pinterest",
    usage: "/pinterest <search query> <number of images>",
    role: "user",
    usePrefix: true,
    aliases: ["pin"],
    author: "MICRON",
};

module.exports.run = async function ({ bot, chatId, args }) {
    try {
        const keySearch = args.join(" ");
        if (!keySearch.includes("-")) {
            return bot.sendMessage(chatId, "Please enter the search query and -number of images (1-9)");
        }
        const keySearchs = keySearch.substr(0, keySearch.indexOf("-"));
        let numberSearch = keySearch.split("-").pop() || 50;
        if (numberSearch > 50) {
            numberSearch = 50;
        }

        const apiUrl = `https://api-samirxyz.onrender.com/api/Pinterest?query=${encodeURIComponent(keySearchs)}&number=${numberSearch}&apikey=global`;

        const res = await axios.get(apiUrl);
        const data = res.data.result;

        for (let i = 0; i < Math.min(numberSearch, data.length); i++) {
            const imgResponse = await axios.get(data[i], { responseType: 'arraybuffer' });
            const imgPath = path.join(__dirname, '..', 'images', `pinterest_image_${i + 1}.jpg`);
            await fs.outputFile(imgPath, imgResponse.data);
            await bot.sendDocument(chatId, imgPath, { disable_notification: true });
            await fs.remove(imgPath);
        }
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "An error occurred.");
    }
};
