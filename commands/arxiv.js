const axios = require('axios');
const xml2js = require('xml2js');

module.exports.config = {
    name: "arxiv",
    description: "Search for research articles on Arxiv.",
    usage: "/arxiv <query>",
    role: "user", // 0: All users
    usePrefix: true,
    aliases: [],
    author: "August Quinn",
};

module.exports.run = async function ({ bot, args, chatId }) {
    // Check if a search query is provided
    if (!args[0]) {
        bot.sendMessage(chatId, `⚠️ Please provide a search query for Arxiv.\n💡 Usage: ${this.config.usage}`);
        return;
    }

    const query = args.join(" ");

    // Send a pre-processing message
    const preMessage = await bot.sendMessage(chatId, "🔍 | Searching...");

    try {
        const response = await axios.get(`http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}`);
        const xmlData = response.data;

        const parser = new xml2js.Parser();
        parser.parseString(xmlData, (error, result) => {
            if (error) {
                bot.sendMessage(chatId, 'An error occurred while parsing Arxiv data.');
                console.error(error);
                return;
            }

            const entries = result.feed.entry;

            if (!entries || entries.length === 0) {
                bot.sendMessage(chatId, 'No research articles found on Arxiv for the given query.');
                return;
            }

            const article = entries[0];
            const title = article.title[0];
            const summary = article.summary[0];
            const authors = article.author.map((author) => author.name[0]);
            const published = article.published[0];

            const responseMessage = `📚 Arxiv Research Article\n\n📝 Title: ${title}\n\n👥 Authors: ${authors.join(', ')}\n\n🗓️ Published Date: ${published}\n\n📖 Summary: ${summary}`;

            bot.sendMessage(chatId, responseMessage);
        });
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, 'An error occurred while fetching Arxiv data.');
    } finally {
        // Delete the pre-processing message
        bot.deleteMessage(chatId, preMessage.message_id);
    }
};
