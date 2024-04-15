// commands/stats.js

module.exports.config = {
    name: "stats",
    description: "Display bot statistics",
    usage: "/stats",
    role: "user",
    usePrefix: true,
    aliases: ["ping", "upt", "time"],
    author: "OtinXSandip",
};

module.exports.run = async function ({ bot, chatId }) {
    try {
        const uptimeInSeconds = process.uptime();
        const formattedUptime = formatUptime(uptimeInSeconds);
        const currentDate = new Date();
        const dateString = currentDate.toLocaleDateString("en-US", { year: "numeric", month: "numeric", day: "numeric" });
        const timeString = currentDate.toLocaleTimeString("en-US", { timeZone: "Asia/Dhaka", hour12: true });

        const timeStart = Date.now();
        await bot.sendMessage(chatId, "wait a second 🐥");
        const ping = Date.now() - timeStart;

        let pingStatus = "Not smooth throw your router, buddy";
        if (ping < 400) {
            pingStatus = "Smooth like your pussy cat";
        }

        bot.sendMessage(chatId, `🏊 | Bot running time: ${formattedUptime}\n\n📅 | Date: ${dateString}\n\n⏰| Time: ${timeString}\n\n📶 | Ping: ${ping}ms\n\nPing status: ${pingStatus}`);
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "An error occurred while retrieving data.");
    }
};

function formatUptime(uptimeInSeconds) {
    const hours = Math.floor(uptimeInSeconds / 3600);
    const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeInSeconds % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
}
