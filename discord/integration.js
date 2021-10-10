const setting = require("../settings.json");
const discord = require("discord.js");
const {discord_integration} = require("../settings.json");

const bot = new discord.Client();
const sendImage = (imageURL) => {
    const guild = bot.guilds.cache.find(guild => guild.id === discord_integration.guildId);
    const channel = guild.channels.cache.find(channel => channel.name === discord_integration.channel_name);

    const res = new discord.MessageEmbed()
        .setAuthor("WiiUMC","https://wiiumc.herokuapp.com/resources/tile150x150.png")
        .setImage("Imagen de WiiUMC")
        .setImage(imageURL)
        .setFooter("WiiUMC Server Integration")
        .setTimestamp(Date.now());
    channel.send(res)
}

bot.login(discord_integration.token);

module.exports = {
    sendImage
}