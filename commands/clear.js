const {
  sendMessage
} = require("../functions/functions");

module.exports = {
  name: "clear",
  description: "clears the current queue!",
  async execute(client, message, cmd, args, Discord, queue) {
    try {
      const voice_channel = message.member.voice.channel;
      if (!voice_channel) return sendMessage(message.channel, "You need to be in a channel to execute this command!");

      const server_queue = queue.get(message.guild.id);

      if (!server_queue || server_queue.songs.length < 1) return sendMessage(message.channel, "**Queue is already empty!**");

      server_queue.songs = [];
      return sendMessage(message.channel, "The queue has been **cleared**", "GREEN");
    } catch (error) {
      console.log(error);
      sendMessage(message.channel, "**an error occurred!**");
    }
  },
};