const axios = require("axios");
const fs = require("fs");

module.exports.config = {
    name: "downloader",
    description: "Download Instagram videos",
    usage: "/insta <link>",
    role: "user", // or any specific role you want
    usePrefix: true,
    aliases: ["insta", "fb"],
    author: "YourNameHere", // Replace with your name
};

module.exports.run = async function ({ bot, message, args }) {
    try {
        const url = args.join(" ");
        if (!url) {
            return bot.sendMessage(message.chat.id, "Please provide a URL");
        }

        const instaResponse = await axios.get(`https://sandipbaruwal.onrender.com/insta?url=${url}`);
        const videoUrl = instaResponse.data.url;

        if (!videoUrl) {
            return bot.sendMessage(message.chat.id, "No video found for the provided URL");
        }

        const response = await axios({
            method: "GET",
            url: videoUrl,
            responseType: "stream",
        });

        const videoPath = "./video.mp4";
        const videoStream = fs.createWriteStream(videoPath);
        response.data.pipe(videoStream);

        await new Promise((resolve, reject) => {
            videoStream.on("finish", resolve);
            videoStream.on("error", reject);
        });

        bot.sendVideo(message.chat.id, fs.createReadStream(videoPath))
            .then(() => fs.unlinkSync(videoPath)) // Delete the video file after sending
            .catch(error => {
                console.error("Error sending video:", error.message);
                bot.sendMessage(message.chat.id, "Failed to send the video");
            });
    } catch (error) {
        console.error("Error:", error.message);
        bot.sendMessage(message.chat.id, "An error occurred while processing the request");
    }
};
