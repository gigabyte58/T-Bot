module.exports.config = {
    name: "eval",
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
        bot.sendMessage(chatId, msg);
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
