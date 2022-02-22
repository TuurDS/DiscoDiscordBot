const {
  video_player,
  fetchNextSong,
  sendMessage
} = require("../functions/functions");
module.exports = {
  name: "skip",
  description: "skippes the current track",
  async execute(client, message, cmd, args, Discord, queue) {
    try {
      const voice_channel = message.member.voice.channel;
      if (!voice_channel) return sendMessage(message.channel, "You need to be in a channel to execute this command!");
      const permissions = voice_channel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT")) return sendMessage(message.channel, "You dont have the correct permissions");
      if (!permissions.has("SPEAK")) return sendMessage(message.channel, "You dont have the correct permissions");

      let server_queue = queue.get(message.guild.id);
      if (!message.member.voice.channel) return sendMessage(message.channel, "You need to be in a channel to execute this command!");
      if (server_queue && server_queue.nowplaying == null) {
        if (!server_queue){
          return sendMessage(message.channel, `There are no songs in queue 😔`);
        }
        if (!server_queue || !server_queue.songs || server_queue.songs.length == 0) {
          return sendMessage(message.channel, `There are no songs in queue 😔`);
        }
      }
      if (!args[0]) {
        args[0] = 1;
      }
      if (isNaN(args[0])) return sendMessage(message.channel, "please enter a valid number!");
      args[0] = parseInt(args[0]);
      let length = server_queue.songs.length;
      if (length == 0) length = 1;
      if (args[0] < 1 || args[0] > length) return sendMessage(message.channel, `please enter a number between **1** and **${length}**`);

      let total = server_queue.currentSong + args[0];

      if (server_queue.repeat) {
        total = total % server_queue.songs.length;
      }
      server_queue.currentSong = total - 1;
      let str = "songs";
      if (args[0] < 2) str = "song";
      sendMessage(message.channel, `Skipped **${args[0]} ${str}**`, "GREEN");
      video_player(client, message, fetchNextSong(server_queue), queue);
    } catch (error) {
      console.log(error);
      sendMessage(message.channel, "**an error occurred!**");
    }
  },
};