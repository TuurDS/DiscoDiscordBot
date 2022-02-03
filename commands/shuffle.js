module.exports = {
  name: "shuffle",
  aliases: ["sf"],
  description: "shuffles the music queue!",
  async execute(client, message, cmd, args, Discord, queue) {
    try {
      const voice_channel = message.member.voice.channel;
      if (!voice_channel) return message.channel.send("You need to be in a channel to execute this command!");

      let server_queue = queue.get(message.guild.id);
      if (!server_queue.songs) return message.reply("**There are no tracks to be shuffled!**");
      if (server_queue.songs.length < 2) return message.reply("**There are not enough tracks to be shuffle the queue (min 2)!**");
      shuffle(server_queue.songs);
      return message.reply("**The player has been shuffled!**");
    } catch (error) {
      console.log(error);
      message.channel.send("**An Error occurred!**");
    }
  },
};

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}