const {
  sendMessage
} = require("../functions/functions");

module.exports = {
  name: "clear",
  description: "clears the current queue!",
  async execute(client, message, cmd, args) {
    try {
      const voice_channel = message.member.voice.channel;
      if (!voice_channel) return sendMessage(message.channel, "You need to be in a channel to execute this command!");

      const queue = client.player.getQueue(message.guild.id) || client.player.createQueue(message.guild.id);
      queue.clearQueue();

      return sendMessage(message.channel, "The queue has been **cleared**", "GREEN");
    } catch (error) {
      console.log(error);
      sendMessage(message.channel, "**an error occurred!**");
    }
  },
};