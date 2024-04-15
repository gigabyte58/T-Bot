const fetch = require('node-fetch');
const os = require('os');
const fs = require('fs');
const exec = require('child_process').exec;

const maxCpu = os.cpus().length;
const maxRam = os.totalmem();
const maxRamInGB = (maxRam / 1024 / 1024 / 1024).toFixed(2);
const language = process.env.REPL_LANGUAGE;
const platform = os.platform();
const architecture = os.arch();
const cpuModel = os.cpus()[0].model;
const uptime = os.uptime();
const nodejs = process.version;

// Ensure global.client is an object
if (!global.client) {
    global.client = {};
}

// Now you can safely set the timeStart property
global.client.timeStart = new Date().getTime();

module.exports.config = {
    name: "sid",
    description: "Display system uptime and information",
    usage: "/upt",
    role: "user", // 0: All users
    usePrefix: true,
    aliases: [],
    author: "R1zaX",
};

function byte2mb(bytes) {
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(bytes, 10) || 0;
    while (n >= 1024 && ++l) n = n / 1024;
    return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
}

module.exports.run = async function ({ bot, chatId }) {
    const xuly = Math.floor((Date.now() - global.client.timeStart) / 4444);
    var trinhtrang = xuly < 10 ? "Good ✔️" : xuly > 10 && xuly < 100 ? "Stable" : "Slow";
    const pidusage = await require('pidusage')(process.pid);

    const time = process.uptime(),
        gio = Math.floor(time / (60 * 60)),
        phut = Math.floor((time % (60 * 60)) / 60),
        giay = Math.floor(time % 60);

    // Calculate ping
    const pingStart = Date.now();
    await bot.sendMessage(chatId, "Calculating ping...");
    const ping = Date.now() - pingStart;

    // Get current date string
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString("en-US", { year: "numeric", month: "numeric", day: "numeric" });

    exec(`powershell -command "(Get-ChildItem '${__dirname}' -Recurse | Measure-Object -Property Length -Sum).Sum"`, (error, stdout, stderr) => {
        if (error || stderr) {
            bot.sendMessage(chatId, `An error has occurred: ${error ? error.message : stderr}`);
            return;
        }

        const storageUsed = stdout.trim();
        const size = parseInt(stdout.trim());

        bot.sendMessage(chatId, `━━━━[ 𝗨𝗣𝗧𝗜𝗠𝗘 ]━━━━\n\n            ${gio} : ${phut} : ${giay}\n\n Language: ${language}\n Operating system: ${platform} ${architecture}\n V-NodeJs: ${nodejs}\n Model CPU: ${cpuModel}\n Memory: ${size}B\n CPU: ${pidusage.cpu.toFixed(1)} % / ${maxCpu} CPUs\n RAM: ${byte2mb(pidusage.memory)} / ${maxRamInGB} GB\n PING: ${ping} ms\n Date: ${dateString}\n Status: ${trinhtrang}\n Uptime system: ${uptime} seconds`);
    });
};
