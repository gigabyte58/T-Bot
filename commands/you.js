const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "you",
    description: "Get an AI-generated response from youChat",
    usage: "/you <prompt>",
    role: "user",
    usePrefix: true,
    aliases: [],
    author: "MICRON", // Replace with your name
};

module.exports.run = async function ({ bot, chatId, args }) {
    const prompt = args.join(' ');
    if (!prompt) {
        return bot.sendMessage(chatId, "😡 Please provide a prompt.");
    }

    try {
        const params = {
            q: prompt,
            page: '1',
            count: '10',
            safeSearch: 'Moderate',
            responseFilter: 'WebPages,TimeZone,Computation,RelatedSearches',
            domain: 'youchat',
            use_personalization_extraction: 'true',
            queryTraceId: '1e31bea9-7fd3-4083-950a-e0aef7eb8511',
            chatId: '1e31bea9-7fd3-4083-950a-e0aef7eb8511',
            conversationTurnId: '4565152c-28c8-4aac-a749-1cea61537ea2',
            pastChatLength: '5',
            selectedChatMode: 'custom',
            selectedAIModel: 'gpt_4_turbo',
            traceId: '1e31bea9-7fd3-4083-950a-e0aef7eb8511|4565152c-28c8-4aac-a749-1cea61537ea2|2024-04-09T06:52:03.804Z'
        };

        const headers = {
            cookie: 'uuid_guest=c2e4aeaf-6ce5-4a44-9b7a-82590bc2d7f5; uuid_guest_backup=c2e4aeaf-6ce5-4a44-9b7a-82590bc2d7f5; __cf_bm=cO3F4jras.aV7rNHMj93..XVmRqe5yuVWxKTes5NB2g-1713112906-1.0.1.1-VRdKRwBr5oFcLyt.eN1EljJGR.EVNMN_2TVhkqWNwc.DWtfbEYnH4PdU9CSAPCa.8tU0_zaFfxMaDFmQ0G2y3Z1rVxd2izW4m.lN5MS0Clg; _cfuvid=yBadxa9CEdXeY6XnVYa2e4oySTzhnd1MSApukeVI_AA-1712921022602-0.0.1.1-604800000',
            'User-Agent': 'insomnia/8.6.1'
        };

        const response = await axios.get('https://you.com/api/streamingSearch', { params, headers });

        // Assume the API returns a JSON response that contains a field "data" with the result text
        const data = response.data;
        const formattedResponse = "AI says:\n```\n" + JSON.stringify(data, null, 2) + "\n```";
        bot.sendMessage(chatId, formattedResponse, { parseMode: 'Markdown' });
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "❌ Failed to get response from youChat. Please try again later.");
    }
};
