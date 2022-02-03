module.exports = {
  name: "removesong",
  aliases: ["rms"],
  description: "removes a song from the queue!",
  async execute(client, message, cmd, args, Discord, queue) {
    try {
      const voice_channel = message.member.voice.channel;
      if (!voice_channel)
        return message.channel.send("You need to be in a channel to execute this command!");

      let server_queue = queue.get(message.guild.id);
      let amtSongs = server_queue.songs.length;

      if (!amtSongs || amtSongs < 1) return message.reply("There are no songs to be removed!");
      if (!args[0]) return message.reply("please enter the queue number of the song you want to remove!");
      if (isNaN(args[0])) return message.reply("please enter a valid number!");
      if (args[0] < 1 || args[0] > amtSongs) return message.reply(`please enter a number between 1 and ${amtSongs}!`);

      const deletedSong = server_queue.songs.splice(args[0] - 1, 1)[0];
      message.channel.send(`👍 **${deletedSong.title}** has been removed from the queue!`);
    } catch (error) {
      console.log(error);
      message.channel.send("**An Error occurred!**");
    }
  },
};