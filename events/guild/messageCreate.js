require('dotenv').config();
const {
  sendMessage
} = require("../../functions/functions");

module.exports = (client, Discord, message) => {
  try {
    const prefix = process.env.DISCORD_PREFIX;
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(" ");
    const cmd = args.shift().toLowerCase();
    const command =
      client.commands.get(cmd) ||
      client.commands.find((e) => e.aliases && e.aliases.includes(cmd));

    if (command) command.execute(client, message, cmd, args);
    else sendMessage(message.channel, "This command does not exist!");
  } catch (error) {
    console.log(error);
    sendMessage(message.channel, "**An Error occurred!**");
  }
};