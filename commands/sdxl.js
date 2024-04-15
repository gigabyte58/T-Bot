const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "sdxl",
    description: "Generate an image based on a text prompt",
    usage: "/gen <prompt>",
    role: "user",
    usePrefix: true,
    aliases: [],
    author: "YourName",
};

module.exports.run = async function ({ bot, chatId, args }) {
    const prompt = args.join(' ');

    if (!prompt) {
        return bot.sendMessage(chatId, "😡 Please provide a prompt.");
    }

    const generatingMessage = await bot.sendMessage(chatId, "✅ Generating, please wait...");

    try {
        const startTime = new Date().getTime();

        const API_URL = "https://modelslab.com/api/v4/dreambooth";
        const KEY = "nyVcfpwe63VVfOhG84G80Uy3t8LCo2p0xAgun7dTMWwZ5CeFJWsA5Xnda7G4";

        const payload = {
            key: KEY,
            prompt: prompt,
            negative_prompt: "painting, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, deformed, ugly, blurry, bad anatomy, bad proportions, extra limbs, cloned face, skinny, glitchy, double torso, extra arms, extra hands, mangled fingers, missing lips, ugly face, distorted face, extra legs, anime",
            width: "512",
            height: "512",
            samples: "1",
            num_inference_steps: "30",
            safety_checker: "no",
            enhance_prompt: "yes",
            seed: "null",
            guidance_scale: "7.5",
            multi_lingual: "yes",
            panorama: "no",
            self_attention: "no",
            upscale: "yes",
            embeddings_model: null,
            lora_model: "",
            tomesd: "yes",
            clip_skip: "2",
            use_karras_sigmas: "yes",
            vae: null,
            lora_strength: "0.5",
            scheduler: "UniPCMultistepScheduler",
            webhook: null,
            track_id: null
        };

        const response = await axios.post(API_URL, payload);

        if (response.status === 200) {
            const data = response.data;
            const imageURL = response.data && response.data.url;

            const imageResponse = await axios.get(imageURL, { responseType: 'stream' });
            const filePath = `gen_image.jpg`;
            const writer = fs.createWriteStream(filePath);
            imageResponse.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            const caption = `Generated image based on prompt: ${prompt}`;
            await bot.sendPhoto(chatId, filePath, { caption: caption });

            bot.deleteMessage(chatId, generatingMessage.message_id);

            fs.unlinkSync(filePath);
        } else {
            throw new Error("Failed to generate the image.");
        }

        const endTime = new Date().getTime();
        const timeTaken = (endTime - startTime) / 1000;
        console.log(`Image generated in ${timeTaken} seconds.`);
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "❌ Failed to generate the image. Please try again later.");
        bot.deleteMessage(chatId, generatingMessage.message_id);
    }
};
