const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "upscale",
    description: "Upscale an image",
    usage: "/upscale",
    role: "user",
    usePrefix: true,
    aliases: [],
    author: "Samir B. Thakuri",
};

// Function to submit image for upscaling
async function submitImageForUpscaling(imageData) {
    try {
        const response = await axios.post('https://access1.imglarger.com/PhoAi/Upload', {
            base64Image: imageData.toString('base64'),
            type: 0,
            scaleRadio: '8'
        });
        if (response.status === 200 && response.data.data && response.data.data.code) {
            return response.data.data.code;
        } else {
            console.error(`Error submitting image: ${response.status}, ${response.data}`);
            return null;
        }
    } catch (error) {
        console.error(`Error submitting image: ${error.message}`);
        return null;
    }
}

// Function to fetch upscaled image
async function fetchUpscaledImage(code) {
    try {
        const response = await axios.post('https://access1.imglarger.com/PhoAi/CheckStatus', {
            code: code,
            type: 0,
            scaleRadio: '8'
        });
        if (response.data.code === 200 && response.data.data && response.data.data.status === 'success' && response.data.data.downloadUrls) {
            return response.data.data.downloadUrls[0];
        } else if (response.data.data.status === 'waiting') {
            console.log("Upscaling in progress. Retrying later...");
            return 'retry';
        } else {
            console.error(`Upscaling error or no image generated: ${response.data}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching upscaled image: ${error.message}`);
        return null;
    }
}

module.exports.run = async function ({ bot, chatId, message }) {
    if (!message || !message.photo) {
        return bot.sendMessage(chatId, "Please send an image to upscale.");
    }

    const processingMessage = await bot.sendMessage(chatId, "Received your image. Processing now...");
    const fileId = message.photo[message.photo.length - 1].file_id;

    try {
        const fileUrl = await bot.getFileLink(fileId);
        const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
        const imageData = Buffer.from(response.data, 'binary');
        const code = await submitImageForUpscaling(imageData);

        // Rest of your code for processing the image...
    } catch (error) {
        console.error(`Error handling photo message: ${error.message}`);
        await bot.sendMessage(chatId, "Failed to process the image.");
    }
};


