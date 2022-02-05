const {
  video_player,
  fetchNextSong
} = require("../functions/functions");
module.exports = {
  name: "skip",
  description: "skippes the current track",
  async execute(client, message, cmd, args, Discord, queue) {
    try {
      const voice_channel = message.member.voice.channel;
      if (!voice_channel) return message.channel.send("You need to be in a channel to execute this command!");
      const permissions = voice_channel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT")) return message.channel.send("You dont have the correct permissions");
      if (!permissions.has("SPEAK")) return message.channel.send("You dont have the correct permissions");

      let server_queue = queue.get(message.guild.id);
      if (!message.member.voice.channel) return message.channel.send("You need to be in a channel to execute this command!");
      if (!server_queue || !server_queue.songs) {
        return message.channel.send(`There are no songs in queue 😔`);
      }
      if (!args[0]) {
        args[0] = 1;
      }
      if (isNaN(args[0])) return message.reply("please enter a valid number!");
      args[0] = parseInt(args[0]);
      if (args[0] < 1 || args[0] > server_queue.songs.length) return message.reply(`please enter a number between 1 and ${server_queue.songs.length}!`);

      let total = server_queue.currentSong + args[0];

      if (server_queue.repeat) {
        total = total % server_queue.songs.length;
      }
      server_queue.currentSong = total - 1;
      let str = "songs";
      if (args[0] < 2) str = "song";
      message.channel.send(`Skipped **${args[0]} ${str}**`);
      video_player(message, fetchNextSong(server_queue), queue);
    } catch (error) {
      console.log(error);
      message.channel.send("**An Error occurred!**");
    }
  },
};