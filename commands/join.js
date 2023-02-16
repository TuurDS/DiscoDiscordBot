const {
  joinVoiceChannel
} = require("@discordjs/voice");
const {
  sendMessage
} = require("../functions/functions");
module.exports = {
  name: "join",
  description: "bot join vc",
  async execute(client, message, cmd, args, Discord) {
    try {
      const voiceChannel = message.member.voice.channel;

      if (!voiceChannel) return sendMessage(message.channel, "You need to be in a channel to execute this command!");

      const permissions = voiceChannel.permissionsFor(message.client.user);

      if (!permissions.has("CONNECT")) return sendMessage(message.channel, "You dont have the correct permissions");
      if (!permissions.has("SPEAK")) return sendMessage(message.channel, "You dont have the correct permissions");
      
      const queue = client.player.getQueue(message.guild.id) || client.player.createQueue(message.guild.id);
      
      queue.join(voiceChannel);
      message.react("👍");

    } catch (error) {
      console.log(error);
      sendMessage(message.channel, "**an error occurred!**");
    }
  },
};