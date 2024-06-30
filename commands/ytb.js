const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "ytb",
    description: "Search and send top YouTube video",
    usage: "/ytb [query]",
    role: "user", // Allow all users to execute
    usePrefix: true,
    aliases: ["youtube"],
    author: "MICRON",
};

module.exports.run = async function ({ bot, args, chatId }) {
    const query = args.join(" ");

    if (!query) {
        bot.sendMessage(chatId, "Please provide a search query.");
        return;
    }

    // Send a pre-processing message
    const preMessage = await bot.sendMessage(chatId, "Searching for the top YouTube video...");

    try {
        // Search for the top YouTube video
        const { videos } = await ytSearch(query);
        const topVideo = videos[0];

        if (!topVideo) {
            bot.sendMessage(chatId, "No video found for the given query.");
            return;
        }

        // Download the video and get its details
        const videoInfo = await ytdl.getInfo(topVideo.url);
        const videoTitle = videoInfo.videoDetails.title;
        const videoAuthor = videoInfo.videoDetails.author.name;
        const videoDuration = formatDuration(videoInfo.videoDetails.lengthSeconds);

        // Download and save the video to the cache directory with a random filename
        const randomFilename = `video_${Date.now()}_${Math.floor(Math.random() * 10000)}.mp4`;
        const videoPath = path.join(__dirname, '..', 'tmp', randomFilename);
        await ytdl(topVideo.url).pipe(fs.createWriteStream(videoPath));

        // Send the video with relevant information
        bot.sendVideo(chatId, videoPath, {
            caption: `Here's the top YouTube video:\n\n🎥 Title: ${videoTitle}\n👤 Author: ${videoAuthor}\n⏱ Duration: ${videoDuration}`
        });
    } catch (error) {
        console.error(error.message);
        bot.sendMessage(chatId, "⚠️ An error occurred while processing the YouTube search.");
    } finally {
        // Delete the pre-processing message
        bot.deleteMessage(chatId, preMessage.message_id);
    }
};

// Helper function to format video duration
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
