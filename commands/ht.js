const axios = require('axios');

module.exports.config = {
    name: "hf",
    description: "Generate an AI image based on a prompt",
    usage: "/generateImage <prompt>",
    role: "user",
    usePrefix: true,
    aliases: [],
    author: "YourName",
};

module.exports.run = async function ({ bot, chatId, args }) {
    const prompt = args.join(' ');

    if (!prompt) {
        return bot.sendMessage(chatId, "Please provide a prompt for the image generation.");
    }

    try {
        const response = await axios({
            method: 'POST',
            url: 'https://linaqruf-animagine-xl.hf.space/queue/join?',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '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', // Replace with your Hugging Face token
            },
            data: {
                "api_name": "/run",
                "data": [
                    prompt, // string in 'Prompt' Textbox component
                    "", // string in 'Negative Prompt' Textbox component (empty for now)
                    0, // number in 'Seed' Slider component
                    512, // number in 'Width' Slider component
                    512, // number in 'Height' Slider component
                    1, // number in 'Guidance scale' Slider component
                    1, // number in 'Number of inference steps' Slider component
                    "DPM++ 2M Karras", // string in 'Sampler' Dropdown component
                    "1024 x 1024", // string in 'Aspect Ratio' Radio component
                    "(None)", // string in 'Style Preset' Radio component
                    "(None)", // string in 'Quality Tags Presets' Dropdown component
                    true, // boolean in 'Use Upscaler' Checkbox component
                    0, // number in 'Strength' Slider component
                    1, // number in 'Upscale by' Slider component
                    true, // boolean in 'Add Quality Tags' Checkbox component
                ]
            }
        });

        const imageUrl = response.data[0]; // Assuming the API returns the image URL as the first element

        bot.sendPhoto(chatId, imageUrl, { caption: "Here's your AI generated image:" });
    } catch (error) {
        console.error("Error:", error.message);
        bot.sendMessage(chatId, "An error occurred while making the API request. Please try again later.");
    }
};
