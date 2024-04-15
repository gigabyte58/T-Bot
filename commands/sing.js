const axios = require('axios');
const fs = require('fs');
const ytdl = require('ytdl-core');
const yts = require('yt-search');

module.exports.config = {
    name: "sing",
    description: "Play music by searching for a song title",
    usage: "/sing <song_title>",
    role: "user",
    usePrefix: true,
    aliases: ["playmusic"],
    author: "Subash",
};

module.exports.run = async function ({ bot, args, chatId }) {
    const musicName = args.join(' ');

    if (!musicName) {
        bot.sendMessage(chatId, "Please specify a music name!");
        return;
    }

    bot.sendMessage(chatId, "Searching for music...");

    try {
        const searchResults = await yts(musicName);
        if (!searchResults.videos.length) {
            bot.sendMessage(chatId, "No music found.");
            return;
        }

        const music = searchResults.videos[0];
        const musicUrl = music.url;

        const stream = ytdl(musicUrl, { filter: 'audioonly', quality: 'highestaudio' });

        const musicTitle = music.title;
        const artist = music.author.name;
        const duration = music.duration.timestamp;

        const fileName = `${chatId}_${Date.now()}.mp3`;
        const filePath = `./tmp/${fileName}`;

        stream.pipe(fs.createWriteStream(filePath));

        stream.on('end', () => {
            bot.sendAudio(chatId, filePath, {
                title: musicTitle,
                performer: artist,
                duration: duration,
            }, (err) => {
                fs.unlinkSync(filePath);
            });
        });
    } catch (error) {
        console.error('[ERROR]', error);
        bot.sendMessage(chatId, "Sorry, an error occurred while processing the command.");
    }
};
