const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "anigen",
    description: "Generate an image based on a text prompt",
    usage: "/gen <prompt>",
    role: "user",
    usePrefix: true,
    aliases: [],
    author: "MICRON",
};

module.exports.run = async function ({ bot, chatId, args }) {
  const prompt = args.join(' ');

  if (!prompt) {
    return bot.sendMessage(chatId, " Please provide a prompt.");
  }

  const generatingMessage = await bot.sendMessage(chatId, "✅ Generating, please wait...");

  try {
    const startTime = new Date().getTime();

    // 1. Generate Task ID
    const generateTaskIdUrl = 'https://replicate.com/api/models/lucataco/proteus-v0.2/versions/06775cd262843edbde5abab958abdbb65a0a6b58ca301c9fd78fa55c775fc019/predictions';
    const generateTaskIdData = {
      "input": {
        "width": 1024,
        "height": 1024,
        "prompt": `${prompt},official art, anime, pixiv,masterpiece,HDR,anime,anime style,beuatiful anime`,
        "scheduler": "KarrasDPM",
        "num_outputs": 1,
        "guidance_scale": 7.5,
        "apply_watermark": true,
        "negative_prompt": " ,malformed hands,malformed fingers,malformed faces,malformed body parts,mutated body parts,malfromed eyes,mutated fingers,mutated hands,realistic,worst quality, low quality, blurry, pixelated, extra limb, extra fingers, bad hand, text, name, letters, out of frame, lowres, text, error, cropped, jpeg artifacts, ugly, duplicate, morbid, mutilated, out of frame, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, username, watermark, signature",
        "prompt_strength": 0.8,
        "num_inference_steps": 30
      },
      "stream": false
    }

    const taskIdResponse = await axios.post(generateTaskIdUrl, generateTaskIdData, {
      headers: { 'Content-Type': 'application/json' }
    });
    const taskId = taskIdResponse.data.id; // Assuming the response contains the generated ID

    // 2. Fetch Image URL
    const fetchImageUrlUrl = 'https://freak-jnh7.onrender.com/get_prediction';
    const fetchImageData = {
      "id": taskId
    };

    const imageUrlResponse = await axios.post(fetchImageUrlUrl, fetchImageData, {
      headers: { 'Content-Type': 'application/json' }
    });
    const imageURL = imageUrlResponse.data; // Assuming the response contains the image URL

    const endTime = new Date().getTime();
    const timeTaken = (endTime - startTime) / 1000;

    const caption = `Here is your imagination \nTime taken: ${timeTaken} seconds\ndownload link: ${imageURL}`;

    // Download and send image (unchanged logic)
    const imageResponse = await axios.get(imageURL, { responseType: 'stream' });
    const filePath = `gen.jpg`;
    const writer = fs.createWriteStream(filePath);
    imageResponse.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    await bot.sendPhoto(chatId, filePath, { caption: caption });
    fs.unlinkSync(filePath);

    // Delete the "Generating" message after sending the photo (unchanged)
    bot.deleteMessage(chatId, generatingMessage.message_id);

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "❌ Failed to generate the image. Please try again later.");
    // Delete the "Generating" message if an error occurs (unchanged)
    bot.deleteMessage(chatId, generatingMessage.message_id);
  }
};
