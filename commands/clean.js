const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "clean",
    description: "Delete all files in subdirectories",
    usage: "/clean",
    role: "user", // You might want to restrict this command to admins or the bot owner
    usePrefix: true,
    aliases: ["Samir B. Thakuri"],
    author: "Samir B. Thakuri",
};

module.exports.run = async function ({ bot, chatId }) {
    const directoriesToDelete = ['images','tmp'];

    try {
        console.log("Starting deletion process...");
        for (const directory of directoriesToDelete) {
            // Adjust the path to point to the correct location of the directories
            const directoryPath = path.join(__dirname, '..', directory);
            const files = fs.readdirSync(directoryPath);

            for (const file of files) {
                const filePath = path.join(directoryPath, file);
                const fileStat = fs.statSync(filePath);

                if (fileStat.isFile()) {
                    fs.unlinkSync(filePath);
                    console.log(`Deleted file: ${filePath}`);
                }
            }
        }
        console.log("Deletion process completed successfully!");

        bot.sendMessage(chatId, "Deleted all unwanted caches and temp files from project.");
    } catch (err) {
        console.error(err);
        bot.sendMessage(chatId, `An error occurred while deleting files: ${err.message}`);
    }
};
