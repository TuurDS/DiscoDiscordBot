const {
  sendMessage
} = require("../functions/functions");
module.exports = {
  name: "removesong",
  aliases: ["rms"],
  description: "removes a song from the queue!",
  async execute(client, message, cmd, args, Discord, queue) {
    try {
      const voice_channel = message.member.voice.channel;
      if (!voice_channel)
        return sendMessage(message.channel, "You need to be in a channel to execute this command!");

      let server_queue = queue.get(message.guild.id);
      let amtSongs = server_queue.songs.length;

      if (!amtSongs || amtSongs < 1) return sendMessage(message.channel, "There are no songs to be removed!");
      if (!args[0]) return sendMessage(message.channel, "please enter the queue number of the song you want to remove!");
      if (isNaN(args[0])) return sendMessage(message.channel, "please enter a valid number!");
      if (args[0] < 1 || args[0] > amtSongs) return sendMessage(message.channel, `please enter a number between **1** and **${amtSongs}**`);

      const deletedSong = server_queue.songs.splice(args[0] - 1, 1)[0];
      sendMessage(message.channel, `👍 **[${deletedSong.title}](${deletedSong.url})** has been removed from the queue!`, "GREEN");
    } catch (error) {
      console.log(error);
      sendMessage(message.channel, "**an error occurred!**");
    }
  },
};