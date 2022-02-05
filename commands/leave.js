const {
  getVoiceConnection
} = require("@discordjs/voice");
const {
  safeExit
} = require("../functions/functions");
module.exports = {
  name: "leave",
  description: "bot leaves vc",
  async execute(client, message, cmd, args, Discord, queue) {
    try {
      const channel = message.member.voice.channel;
      const connection = getVoiceConnection(channel.guild.id);
      safeExit(queue, message.guild.id);
    } catch (error) {
      console.log(error);
      message.channel.send("**An Error occurred!**");
    }
  },
};