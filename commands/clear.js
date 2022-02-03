module.exports = {
  name: "clear",
  description: "clears the current queue!",
  async execute(client, message, cmd, args, Discord, queue) {
    try {
      const voice_channel = message.member.voice.channel;
      if (!voice_channel) return message.channel.send("You need to be in a channel to execute this command!");

      const server_queue = queue.get(message.guild.id);

      if (!server_queue || server_queue.songs.length < 1) return message.channel.send("**Queue is already empty!**");

      server_queue.songs = [];
      return message.channel.send("**The queue has been cleared!**");
    } catch (error) {
      console.log(error);
      message.channel.send("**An Error occurred!**");
    }
  },
};