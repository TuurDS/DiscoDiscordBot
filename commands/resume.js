const {
  sendMessage
} = require("../functions/functions");
module.exports = {
  name: "resume",
  aliases: ["rs"],
  description: "resumes the music player!",
  async execute(client, message, cmd, args, Discord, queue) {
    try {
      const voice_channel = message.member.voice.channel;
      if (!voice_channel)
        return sendMessage(message.channel, "You need to be in a channel to execute this command!");

      let server_queue = queue.get(message.guild.id);
      if (!server_queue.audio_player) return sendMessage(message.channel, "There is nothing to **pause!**");
      const success = server_queue.audio_player.unpause();

      if (success) return sendMessage(message.channel, "The player has been **resumed!**", "GREEN");
      return sendMessage(message.channel, "The player wasn't able to **resume!**");
    } catch (error) {
      console.log(error);
      sendMessage(message.channel, "**an error occurred!**");
    }
  },
};