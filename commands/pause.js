module.exports = {
  name: "pause",
  aliases: ["ps"],
  description: "pauses the music player!",
  async execute(client, message, cmd, args, Discord, queue) {
    try {
      const voice_channel = message.member.voice.channel;
      if (!voice_channel) return message.channel.send("You need to be in a channel to execute this command!");

      let server_queue = queue.get(message.guild.id);
      if (!server_queue.audio_player) return message.reply("**There is nothing to pause!**");
      const success = server_queue.audio_player.pause();

      if (success) return message.reply("**The player has been paused!**");
      return message.reply("**The player wasn't able to pause!**");
    } catch (error) {
      console.log(error);
      message.channel.send("**An Error occurred!**");
    }
  },
};