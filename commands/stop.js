const {
  safeExit
} = require("../functions/functions");
module.exports = {
  name: "stop",
  description: "bot cleares queue and leaves vc",
  async execute(client, message, cmd, args, Discord, queue) {
    try {
      const voice_channel = message.member.voice.channel;
      if (!voice_channel)
        return message.channel.send("You need to be in a channel to execute this command!");
      const permissions = voice_channel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT")) return message.channel.send("You dont have the correct permissions");
      if (!permissions.has("SPEAK")) return message.channel.send("You dont have the correct permissions");

      let server_queue = queue.get(message.guild.id);
      server_queue.currentSong = 0;
      server_queue.songs = [];
      safeExit(queue, message.guild.id);

      message.channel.send(`Queue cleared and Disco left the voice channel 😔!`);
    } catch (error) {
      console.log(error);
      message.channel.send("**An Error occurred!**");
    }
  },
};