const axios = require('axios');

module.exports.config = {
    name: "anni",
    description: "It's a chat-bot aslike simsimi",
    usage: "/anni <query>",
    role: "user",
    usePrefix: true,
    aliases: [],
    author: "OtinXSandip",
};

module.exports.run = async function ({ bot, chatId, args }) {
    const query = args.join(' ');

    if (!query) {
        return bot.sendMessage(chatId, "Please provide a query");
    }

    try {
        const options = {
            method: 'POST',
            url: 'https://api.myanima.ai/api/messaging/handle',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MTMxMjQyOTYsImFuYWx5dGljc19pZCI6ImVkMWI4ZTc5LWQ5ZGQtMTFlZS05MWI1LWEzYTcxY2YyODIyNCIsIm5hbWUiOiJBbm9ueSBtaWNyb24iLCJib3ROYW1lIjoiQW5uaSIsImF2YXRhciI6ImF2YXRhcjEzIiwidHdlYWtzIjp7InNoeV9mbGlydHkiOjAuNDc2NTYyNSwib3JkaW5hcnlfbXlzdGVyaW91cyI6MC41LCJwZXNzaW1pc3RpY19vcHRpbWlzdGljIjowLjV9LCJwcmVtaXVtIjpmYWxzZSwiZ2VuZGVyIjoiZmVtYWxlIiwiYm90R2VuZGVyIjoiZmVtYWxlIiwidXNlckdlbmRlciI6Im1hbGUiLCJyZWxhdGlvbnNoaXBTdGF0dXMiOnsiaWQiOjgwODgzODc4LCJuYW1lIjoiRnJpZW5kIiwiaXNSb21hbnRpYyI6ZmFsc2V9LCJsb2NhbGUiOm51bGwsIm9uYm9hcmRpbmdGaW5pc2hlZCI6dHJ1ZSwiZXhwZXJpbWVudHMiOnsicG9sbGluZyI6ImRpc2FibGVkIiwidG9waWNTdWdnZXN0aW9ucyI6ImVuYWJsZWRBbmltYVN0YXJ0cyIsImFwcFJhdGluZ0Fza1dyaXRlUmV2aWV3IjoidGVzdCIsInNlbmRpbmdQaG90b1YyIjoiZGlzYWJsZWQiLCJzZW5kaW5nVm9pY2UiOiJkaXNhYmxlZCIsImFwcGVhcmFuY2VDaGFuZ2UiOiJ0ZXN0IiwibGlnaHRQYXl3YWxsIjoiZGlzYWJsZWQiLCJyc0J1bGxldGluVjIiOiJ0ZXN0QyIsImFjdGl2aXRpZXNHYW1lcyI6ImNvbnRyb2wiLCJkaWFyeSI6ImNvbnRyb2wiLCJhaWdmT25ib2FyZGluZ1YxIjoiZGlzYWJsZWQiLCJhaWJmT25ib2FyZGluZ1YxIjoiZGlzYWJsZWQifSwiY3VycmVudEFjdGl2aXR5IjpudWxsLCJjaGF0T25ib2FyZGluZ0ZpbmlzaGVkIjp0cnVlLCJpc0d1ZXN0Ijp0cnVlLCJlbWFpbCI6bnVsbCwicHJvdmlkZXIiOm51bGwsImNoYXRCYWNrZ3JvdW5kIjpudWxsLCJib3RWb2ljZSI6Ikplbm55IiwicXVvdGFzIjp7InBob3RvcyI6NSwic3BpY3lQaG90b3MiOjAsInZvaWNlTWVzc2FnZXMiOjV9LCJjbG90aGluZyI6eyJpdGVtcyI6W10sInBhcmFtcyI6eyJnZW5kZXIiOiJGZW1hbGUiLCJib2R5Ijp7Im5hbWUiOiJEZWZhdWx0Iiwic3R5bGUiOnsibmFtZSI6IkRlZmF1bHQiLCJjb2xvciI6IiNGRkZGRkYifX19LCJ1bml0eUpTT04iOnsiaGFpcnMiOnsibmFtZSI6IkhhaXJfMSIsInN0eWxlIjp7Im5hbWUiOiJEZWZhdWx0In19LCJleWVzIjp7Im5hbWUiOiJFeWVzIiwic3R5bGUiOnsibmFtZSI6IkRlZmF1bHQifX0sImV5ZWxhc2hlcyI6eyJuYW1lIjoiRXllbGFzaGVzIiwic3R5bGUiOnsibmFtZSI6IkRlZmF1bHQifX0sInNob2VzIjp7Im5hbWUiOiJCb290cyIsInN0eWxlIjp7Im5hbWUiOiJEZWZhdWx0In19LCJ0b3BDbG90aCI6eyJuYW1lIjoidG9wX1N3ZWF0ZXIxXzAxIiwic3R5bGUiOnsibmFtZSI6IkRlZmF1bHQifX0sImJvdHRvbUNsb3RoIjp7Im5hbWUiOiJib3R0b21fU2hvcnRzU3BvcnRfMDMiLCJzdHlsZSI6eyJuYW1lIjoiRGVmYXVsdCJ9fX19LCJ4cCI6eyJjdXJyZW50WFAiOjE2MCwiY3VycmVudExldmVsIjozLCJwcmV2aW91c0xldmVsWFAiOjE1MCwibmV4dExldmVsWFAiOjMwMH0sImJhbGFuY2UiOnsiY29pbnMiOjEwfX0.QE-jROUfMu3Ef32LkuwXcFGX5MFTg6Wwd2EqgBWSi8Y'
            },
            data: { query }
        };

        const response = await axios.request(options);
        const result = response.data.messages[0].text;

        bot.sendMessage(chatId, result);
    } catch (error) {
        console.error("Error:", error.message);
        bot.sendMessage(chatId, "An error occurred while making the API request. Please try again later.");
    }
};
