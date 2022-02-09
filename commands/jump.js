const {
  video_player,
  sendMessage
} = require("../functions/functions");
module.exports = {
  name: "jump",
  description: "jumps to a specific track!",
  async execute(client, message, cmd, args, Discord, queue) {
    try {
      const voice_channel = message.member.voice.channel;
      if (!voice_channel)
        return sendMessage(message.channel,
          "You need to be in a channel to execute this command!"
        );
      const permissions = voice_channel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT"))
        return sendMessage(message.channel, "You dont have the correct permissions");
      if (!permissions.has("SPEAK"))
        return sendMessage(message.channel, "You dont have the correct permissions");

      let server_queue = queue.get(message.guild.id);
      if (!message.member.voice.channel)
        return sendMessage(message.channel,
          "You need to be in a channel to execute this command!"
        );
      if (!server_queue || !server_queue.songs) {
        return sendMessage(message.channel, `There are no songs in queue 😔`);
      }
      if (isNaN(args[0])) return sendMessage(message.channel, "please enter a valid number!");
      args[0] = parseInt(args[0]);
      if (args[0] < 1 || args[0] > server_queue.songs.length)
        return sendMessage(message.channel,
          `please enter a number between **1** and **${server_queue.songs.length}**`
        );

      server_queue.currentSong = args[0] - 1;

      sendMessage(message.channel,
        `jumped to track **${args[0]}** [${
          server_queue.songs[args[0] - 1].title
        }](${server_queue.songs[args[0] - 1].url})`, "GREEN"
      );
      video_player(client, message, fetchNextSong(server_queue), queue);
    } catch (error) {
      console.log(error);
      sendMessage(message.channel, "**an error occurred!**");
    }
  },
};

const fetchNextSong = (server_queue) => {
  if (!server_queue || !server_queue.songs) return null;

  return server_queue.songs[server_queue.currentSong];
};