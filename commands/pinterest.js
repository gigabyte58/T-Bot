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

        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Frs%3Dac%26len%3D2%26q%3D${encodeURIComponent(keySearchs)}&data=%7B%22options%22%3A%7B%22applied_filters%22%3Anull,%22appliedProductFilters%22%3A%22---%22,%22article%22%3Anull,%22auto_correction_disabled%22%3Afalse,%22corpus%22%3Anull,%22customized_rerank_type%22%3Anull,%22domains%22%3Anull,%22filters%22%3Anull,%22first_page_size%22%3A%2225%22,%22page_size%22%3A%2225%22,%22price_max%22%3Anull,%22price_min%22%3Anull,%22query_pin_sigs%22%3Anull,%22query%22%3A%22${encodeURIComponent(keySearchs)}%22,%22redux_normalize_feed%22%3Atrue,%22rs%22%3A%22ac%22,%22scope%22%3A%22pins%22,%22source_id%22%3Anull,%22top_pin_id%22%3A%22%22%7D,%22context%22%3A%7B%7D%7D`,
            headers: { 
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        };

        const res = await axios.request(config);
        const pins = res.data.resource_response.data.results;
        const origImageLinks = pins.map(pin => pin.images.orig.url);

        for (let i = 0; i < Math.min(numberSearch, origImageLinks.length); i++) {
            const imgResponse = await axios.get(origImageLinks[i], { responseType: 'arraybuffer' });
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
