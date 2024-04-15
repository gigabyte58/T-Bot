// commands/websitehtml.js
const axios = require('axios');
const cheerio = require('cheerio');

module.exports.config = {
    name: "websitehtml",
    description: "Fetch and display HTML content from a website",
    usage: "/websitehtml <url>",
    role: "user", // Allow all users to execute
    usePrefix: true,
    aliases: ["html", "scrape"],
    author: "Samir Thakuri",
};

module.exports.run = async function ({ bot, args, chatId }) {
    // Extract the URL from the arguments
    const url = args[0];

    // Check if a URL is provided
    if (!url) {
        bot.sendMessage(chatId, "Please provide a URL to fetch HTML content.");
        return;
    }

    try {
        // Fetch HTML content from the website
        const response = await axios.get(url);
        const htmlContent = response.data;

        // Parse HTML content using Cheerio
        const $ = cheerio.load(htmlContent);

        // Extract and send a part of the HTML content (for demonstration purposes)
        const snippet = $('body').html(); // Change this based on your needs

        // Send the HTML content in markdown style
        bot.sendMessage(chatId, `\`\`\`html\n${snippet}\n\`\`\``, { parseMode: 'Markdown' });
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, `Error fetching HTML content from ${url}.`);
    }
};
