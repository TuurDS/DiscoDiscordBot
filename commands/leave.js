const {
  getVoiceConnection
} = require("@discordjs/voice");
const {
  safeExit,
  sendMessage
} = require("../functions/functions");
module.exports = {
  name: "leave",
  description: "bot leaves vc",
  async execute(client, message, cmd, args) {
    try {

      const queue = client.player.getQueue(message.guild.id) || client.player.createQueue(message.guild.id);
      queue.leave();
      //leave a checkmark reaction on the message
      message.react("👋");

    } catch (error) {
      console.log(error);
      sendMessage(message.channel, "**an error occurred!**");
    }
  },
};