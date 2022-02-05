const {
  video_player
} = require("../functions/functions");

module.exports = {
  name: "fastforward",
  aliases: ["ff"],
  description: "fastforwards a specific amount of time!",
  async execute(client, message, cmd, args, Discord, queue) {
    try {
      const voice_channel = message.member.voice.channel;
      if (!voice_channel) return message.channel.send("You need to be in a channel to execute this command!");

      let server_queue = queue.get(message.guild.id);
      if (!server_queue.audio_player || !server_queue.songs[server_queue.currentSong]) return message.reply("**There is nothing to fast forward!**");
      if (!args[0]) return message.reply("please enter the amount you want to fastforward!");
      if (isNaN(args[0])) return message.reply("please enter a valid number!");
      if (args[0] < 1 || args[0] > server_queue.songs[server_queue.currentSong].duration / 1000 - 1)
        return message.reply(`please enter a number between 1 and ${server_queue.songs[server_queue.currentSong].duration / 1000 - 1}!`);

      let offset = (server_queue.audio_player._state.resource.playbackDuration + server_queue.currentOffset) / 1000 + parseInt(args[0]);
      if (offset > server_queue.songs[server_queue.currentSong].duration / 1000 - 1) {
        offset = server_queue.songs[server_queue.currentSong].duration / 1000 - 1;
      }

      video_player(message, server_queue.songs[server_queue.currentSong], queue, offset);
      message.channel.send(`fastforwarded ${parseInt(args[0])} seconds!`);

    } catch (error) {
      console.log(error);
      message.channel.send("**An Error occurred!**");
    }
  },
};