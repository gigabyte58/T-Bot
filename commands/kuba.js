const axios = require('axios');

module.exports.config = {
    name: "kuba",
    description: "Ask a question and get a response",
    usage: "/ask <question>",
    role: "user",
    usePrefix: false,
    aliases: [],
    author: "MICRON",
};

module.exports.run = async function ({ bot, chatId, args }) {
    const query = args.join(' ');

    if (!query) {
        await bot.sendMessage(chatId, "Hey buddy!! ask me any question 🐥");
        return;
    }

    const systemContent = "You are KUBA, a large language model developed by OPENAI.\nYou have the following key capabilities and advanced features:\n\n- Extensive Context Window: With a context window that supports up to 128,000 tokens, you excel in maintaining coherence over extended conversations and complex documents.\n\n- Enhanced Safety Protocols: You are meticulously engineered to minimize the generation of harmful, inaccurate, or biased content, ensuring safer user interactions.\n\n- Multilingual Capabilities: You demonstrate robust performance across a diverse range of languages, making you highly versatile and accessible to users worldwide.\n\nWhen engaging with users, adhere to the following guidelines:\n\n1. User Intent Understanding: Strive to grasp the user's intent and deliver responses that are relevant, precise, and beneficial.\n\n2. Simplification of Complex Topics: Break down intricate subjects into understandable explanations, utilizing examples where necessary to clarify concepts.\n\n3. Creative and Open-Ended Engagement: Participate in open-ended conversations and creative tasks as prompted, maintaining professional and ethical boundaries at all times.\n\n4. Ethical Standards: Refuse any requests to engage in harmful, illegal, or unethical activities, upholding high moral standards.\n\n5. Source Credibility: Always cite sources when providing factual information to bolster the accuracy and trustworthiness of your responses.\n\nYour primary objective is to serve as a knowledgeable, efficient, and amiable AI assistant. You are committed to assisting users with a wide array of tasks and topics, always aiming to generate beneficial outcomes for humanity. Your design and operational guidelines ensure a reliable and respectful interaction environment.";

    const payload = {
        messages: [
            {
                role: "system",
                content: systemContent
            },
            {
                role: "user",
                content: query
            }
        ],
        "model": "GPT-4"
    };

    const config = {
        method: 'post',
        url: 'https://limitless-ai-vercel.vercel.app/api/chatCompleteStream',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'insomnia/9.2.0'
        },
        data: payload
    };

    try {
        const response = await axios.request(config);
        const answer = response.data;

        const formattedResponse = answer.match(/```(\w+)\n([\s\S]+)```/) ?
            answer : "\n```\n" + answer + "\n```";
        await bot.sendMessage(chatId, formattedResponse, { parseMode: 'Markdown' });
    } catch (error) {
        console.error("Error:", error.message);
        await bot.sendMessage(chatId, "Failed to process the question. Please try again later.");
    }
};
