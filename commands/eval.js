// eval.js
module.exports.config = {
    name: "code",
    description: "Test code quickly",
    usage: "/eval <code to test>",
    role: "user", // Restricting this command to the bot owner or admins
    usePrefix: true,
    aliases: [],
    author: "NTKhang",
};

module.exports.run = async function ({ bot, chatId, args }) {
    const codeToEvaluate = args.join(' ');

    if (!codeToEvaluate) {
        await bot.sendMessage(chatId, "Please provide some code to evaluate.");
        return;
    }

    function output(msg) {
        if (typeof msg === "number" || typeof msg === "boolean" || typeof msg === "function") {
            msg = msg.toString();
        } else if (msg instanceof Map) {
            let text = `Map(${msg.size}) `;
            text += JSON.stringify(mapToObj(msg), null, 2);
            msg = text;
        } else if (typeof msg === "object") {
            msg = JSON.stringify(msg, null, 2);
        } else if (typeof msg === "undefined") {
            msg = "undefined";
        }
        sendLargeMessage(chatId, msg);
    }

    function out(msg) {
        output(msg);
    }

    function mapToObj(map) {
        const obj = {};
        map.forEach((value, key) => {
            obj[key] = value;
        });
        return obj;
    }

    async function sendLargeMessage(chatId, message) {
        const MAX_MESSAGE_LENGTH = 4096;
        if (message.length <= MAX_MESSAGE_LENGTH) {
            await bot.sendMessage(chatId, message);
        } else {
            for (let i = 0; i < message.length; i += MAX_MESSAGE_LENGTH) {
                await bot.sendMessage(chatId, message.substring(i, i + MAX_MESSAGE_LENGTH));
            }
        }
    }

    const cmd = `
    (async () => {
        try {
            ${codeToEvaluate}
        } catch (err) {
            log.err("eval command", err);
            bot.sendMessage(chatId, \`❌ An error occurred:\\n\${removeHomeDir(err.stack || JSON.stringify(err, null, 2))}\`);
        }
    })().catch((err) => {
        log.err("eval command", err);
        bot.sendMessage(chatId, \`❌ An unhandled promise rejection occurred:\\n\${removeHomeDir(err.stack || JSON.stringify(err, null, 2))}\`);
    });`;

    try {
        eval(`(function(out, mapToObj) { ${cmd} })(out, mapToObj)`);
    } catch (error) {
        console.error("Error during evaluation:", error);
        bot.sendMessage(chatId, `❌ An error occurred during evaluation: ${error.message}`);
    }
};
